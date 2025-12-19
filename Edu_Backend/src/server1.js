// server.js
const express = require('express');
const multer = require('multer');
const ExcelJS = require('exceljs');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true }));

// app.delete('/signups', (req, res) => {
//   try {
//     if (fs.existsSync(filePath)) {
//       fs.unlinkSync(filePath); // delete Excel file
//     }
//     res.json({ message: 'All signup data deleted successfully' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to delete signup data' });
//   }
// });


// download-signups

// --- paths
const uploadsDir = path.join(__dirname, '..', 'uploads');
const excelDir = 'C:/excel-data';
const filePath = path.join(excelDir, 'signup-data.xlsx');

// Column definitions — use same keys every time so addRow(object) maps correctly
const SHEET_COLUMNS = [
  { header: 'Candidate Name', key: 'name', width: 30 },
  { header: 'Contact Number', key: 'phone', width: 20 },
  { header: 'Email ID', key: 'email', width: 30 },
  { header: 'Aadhar File', key: 'aadhar', width: 30 },
  { header: 'PAN File', key: 'pan', width: 30 },
  { header: 'Image File', key: 'image', width: 30 },
  { header: 'Resume File', key: 'resume', width: 30 },
  { header: 'Date', key: 'date', width: 22 },
];

// ensure folders
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(excelDir)) fs.mkdirSync(excelDir, { recursive: true });

// --- multer setup (store files on disk, keep originalname for Excel)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const safe = file.originalname.replace(/\s+/g, '_');
    cb(null, `${Date.now()}-${safe}`);
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) cb(null, true);
  else cb(null, false);
};
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 }, fileFilter });

// --- ensure Excel file & header
async function ensureExcelFile() {
  console.log('ensureExcelFile called — verifying', filePath);
  const workbook = new ExcelJS.Workbook();
  if (!fs.existsSync(filePath)) {
    const ws = workbook.addWorksheet('Signups');
    ws.columns = SHEET_COLUMNS;
    await workbook.xlsx.writeFile(filePath);
    console.log('Created signup Excel file with header');
  } else {
    // optionally verify worksheet exists, otherwise add it
    try {
      console.log('Reading existing excel file');
      await workbook.xlsx.readFile(filePath);
      const ws = workbook.getWorksheet('Signups') || workbook.getWorksheet(1);
      if (!ws) {
        const newWs = workbook.addWorksheet('Signups');
        newWs.columns = SHEET_COLUMNS;
        await workbook.xlsx.writeFile(filePath);
        console.log('Added missing Signups worksheet and saved');
      } else {
        // Ensure column keys are set so addRow(object) works after reading file
        console.log('Ensuring worksheet columns keys are set');
        ws.columns = SHEET_COLUMNS;
        await workbook.xlsx.writeFile(filePath);
      }
    } catch (err) {
      console.warn('Could not read excel (will recreate header):', err.message);
      const ws = workbook.addWorksheet('Signups');
      ws.columns = SHEET_COLUMNS;
      await workbook.xlsx.writeFile(filePath);
      console.log('Recreated Excel file with header');
    }
  }
}

// --- atomic write (tmp + rename) with retries (helps on Windows)
async function atomicWriteWorkbook(workbook) {
  const tmp = `${filePath}.tmp.${Date.now()}`;
  console.log('Writing workbook to temp file:', tmp);
  await workbook.xlsx.writeFile(tmp);
  const maxAttempts = 5;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      fs.renameSync(tmp, filePath);
      console.log('Renamed temp file to', filePath);
      return;
    } catch (err) {
      console.warn(`rename attempt ${attempt} failed:`, err.message);
      if (attempt === maxAttempts) {
        try {
          fs.copyFileSync(tmp, filePath);
          fs.unlinkSync(tmp);
          console.log('Copied temp file to', filePath, 'and unlinked temp');
          return;
        } catch (copyErr) {
          try { fs.unlinkSync(tmp); } catch (_) {}
          throw copyErr;
        }
      }
      await new Promise(r => setTimeout(r, 150));
    }
  }
}

// --- write queue to serialize writes and avoid race conditions
const writeQueue = [];
let isWriting = false;

function enqueueWrite(job) {
  writeQueue.push(job);
  console.log('Enqueued write for:', job.payload?.name || 'unknown', ' — queueLen now =', writeQueue.length);
  processQueue();
}

async function processQueue() {
  console.log('processQueue called — queueLen =', writeQueue.length, 'isWriting =', isWriting);
  if (isWriting || writeQueue.length === 0) return;
  isWriting = true;
  const { payload, res } = writeQueue.shift();
  console.log('Dequeued write for:', payload?.name || 'unknown', ' — remaining queueLen =', writeQueue.length);
  try {
    await ensureExcelFile();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const ws = workbook.getWorksheet('Signups') || workbook.getWorksheet(1);

    // Ensure column keys are present so addRow(object) maps values correctly
    ws.columns = SHEET_COLUMNS;

    console.log('Before append, rowCount =', ws.rowCount);
    ws.addRow(payload);
    console.log('After append, rowCount =', ws.rowCount);

    await atomicWriteWorkbook(workbook);

    const lastRow = ws.lastRow;
    const header = ws.getRow(1).values.slice(1);
    const values = lastRow.values.slice(1);
    const appended = header.reduce((acc, h, i) => ((acc[h] = values[i] || ''), acc), {});

    console.log('✅ Excel saved successfully', appended);
    try { res.json({ success: true, appended }); } catch (err) { /* client may disconnect */ }
  } catch (err) {
    console.error('❌ EXCEL WRITE ERROR:', err);
    // Save payload to pending JSON so data isn't lost
    try {
      savePending(payload);
      console.log('Payload saved to pending.json due to write error');
    } catch (saveErr) {
      console.error('Failed to save payload to pending.json', saveErr);
    }
    try { res.status(500).json({ error: err.message, savedToPending: true }); } catch (e) {}
  } finally {
    isWriting = false;
    processQueue();
  }
}

const signupRoute = async (req, res) => {
  try {
    const fileNames = {};
    if (req.files) {
      Object.keys(req.files).forEach(
        k => fileNames[k] = req.files[k].map(f => f.originalname)
      );
    }

    console.log('Received signup:', req.body, fileNames);

    const payload = {
      name: req.body.candidatename || '',
      phone: req.body.contactNumber || '',
      email: req.body.email_id || '',
      aadhar: req.files?.aadhar?.[0]?.originalname || '',
      pan: req.files?.pancard?.[0]?.originalname || '',
      image: req.files?.image?.[0]?.originalname || '',
      resume: req.files?.resume?.[0]?.originalname || '',
      date: new Date().toLocaleString(),
    };

    enqueueWrite({ payload, res }); // ✅ THIS sends response after Excel write
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Signup failed' });
  }
};


app.post(
  '/api/signup',
  upload.fields([
    { name: 'aadhar' },
    { name: 'pancard' },
    { name: 'image' },
    { name: 'resume' }
  ]),
  signupRoute
);

// --- POST /signup - matches your Signup.jsx form
app.post('/signup', upload.fields([
  { name: 'aadhar' }, { name: 'pancard' }, { name: 'image' }, { name: 'resume' }
]),signupRoute, (req, res) => {
  // Log incoming request briefly
  try {
    const fileNames = {};
    if (req.files) {
      Object.keys(req.files).forEach(k => fileNames[k] = req.files[k].map(f => f.originalname));
    }
    console.log('Received POST /signup — body keys:', Object.keys(req.body || {}), 'fileNames:', fileNames);
  } catch (e) {
    console.warn('Error while logging incoming request', e.message);
  }

  const payload = {
    name: req.body.candidatename || '',
    phone: req.body.contactNumber || '',
    email: req.body.email_id || '',
    aadhar: req.files?.aadhar?.[0]?.originalname || '',
    pan: req.files?.pancard?.[0]?.originalname || '',
    image: req.files?.image?.[0]?.originalname || '',
    resume: req.files?.resume?.[0]?.originalname || '',
    date: new Date().toLocaleString(),
  };

  console.log('Built payload for enqueue:', payload);

  // Basic validation: reject completely empty submissions (avoid blank Excel rows)
  const hasText = (payload.name && payload.name.toString().trim()) || (payload.phone && payload.phone.toString().trim()) || (payload.email && payload.email.toString().trim());
  if (!hasText) {
    console.warn('Rejecting empty payload (no name/phone/email) to avoid blank rows');
    // If files exist but no text, save to pending so admin can review
    const hasFiles = (req.files && Object.keys(req.files).length > 0);
    if (hasFiles) {
      savePending(payload);
      return res.status(202).json({ accepted: false, savedToPending: true, message: 'Files received but no text fields; saved for manual review' });
    }

    return res.status(400).json({ error: 'Empty payload — please provide name, phone or email' });
  }

  enqueueWrite({ payload, res });
});

// Debug: echo request back (fields + file names) so you can confirm server sees the data
app.post('/debug-echo', upload.fields([
  { name: 'aadhar' }, { name: 'pancard' }, { name: 'image' }, { name: 'resume' }
]), (req, res) => {
  try {
    const files = {};
    if (req.files) Object.keys(req.files).forEach(k => (files[k] = req.files[k].map(f => ({ originalname: f.originalname, filename: f.filename }))));
    console.log('DEBUG ECHO body:', req.body, 'files:', files);
    res.json({ body: req.body, files });
  } catch (err) {
    console.error('DEBUG ECHO ERROR', err);
    res.status(500).json({ error: err.message });
  }
});

// root ping
app.get('/', (req, res) => res.send('signup-backend ok'));

// --- Diagnostics & helpers
const pendingFile = path.join(excelDir, 'pending.json');

function savePending(payload) {
  try {
    const arr = fs.existsSync(pendingFile) ? JSON.parse(fs.readFileSync(pendingFile, 'utf8')) : [];
    arr.push({ payload, ts: new Date().toISOString() });
    fs.writeFileSync(pendingFile, JSON.stringify(arr, null, 2), 'utf8');
    console.log('Saved payload to pending.json — total pending =', arr.length);
  } catch (err) {
    console.error('Failed to write pending.json', err);
  }
}

async function flushPending() {
  if (!fs.existsSync(pendingFile)) return 0;
  try {
    const arr = JSON.parse(fs.readFileSync(pendingFile, 'utf8'));
    if (!Array.isArray(arr) || arr.length === 0) return 0;
    for (const item of arr) {
      enqueueWrite({ payload: item.payload, res: { json: () => {}, status: () => ({ json: () => {} }) } });
    }
    // clear file
    fs.unlinkSync(pendingFile);
    console.log('Flushed pending.json — queued', arr.length);
    return arr.length;
  } catch (err) {
    console.error('Failed to flush pending.json', err);
    return 0;
  }
}

app.get('/status', (req, res) => res.json({ queueLen: writeQueue.length, isWriting, pendingExists: fs.existsSync(pendingFile) }));

app.post('/signup-test', (req, res) => {
  const count = parseInt(req.query.count, 10) || 5;
  for (let i = 0; i < count; i++) {
    const payload = {
      name: `TEST-${Date.now()}-${i}`,
      phone: '0000000000',
      email: `test${i}@example.com`,
      aadhar: '', pan: '', image: '', resume: '', date: new Date().toLocaleString()
    };
    const dummyRes = { json: () => {}, status: () => ({ json: () => {} }) };
    enqueueWrite({ payload, res: dummyRes });
  }
  res.json({ queued: count });
});

// Direct append endpoint (useful for isolating Excel write problems)
app.post('/append-direct', express.json(), async (req, res) => {
  const payload = req.body;
  try {
    await ensureExcelFile();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const ws = workbook.getWorksheet('Signups') || workbook.getWorksheet(1);
    ws.columns = SHEET_COLUMNS; // ensure keys are present
    ws.addRow(payload);
    await atomicWriteWorkbook(workbook);
    res.json({ success: true, appended: payload });
  } catch (err) {
    console.error('append-direct failed:', err);
    savePending(payload);
    res.status(500).json({ error: err.message, savedToPending: true });
  }
});

app.get('/pending', (req, res) => {
  if (!fs.existsSync(pendingFile)) return res.json({ pending: [] });
  try {
    const arr = JSON.parse(fs.readFileSync(pendingFile, 'utf8'));
    res.json({ pending: arr });
  } catch (err) {
    res.status(500).json({ error: 'Failed to read pending' });
  }
});

app.post('/flush-pending', async (req, res) => {
  const n = await flushPending();
  res.json({ queued: n });
});

app.get('/signups', async (req, res) => {
  try {
    if (!fs.existsSync(filePath)) return res.json({ rows: [] });
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const ws = workbook.getWorksheet('Signups') || workbook.getWorksheet(1);
    if (!ws) return res.json({ rows: [] });
    const header = ws.getRow(1).values.slice(1);
    const rows = [];
    ws.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber === 1) return;
      const v = row.values.slice(1);
      const obj = header.reduce((acc, h, i) => ((acc[h] = v[i] || ''), acc), {});
      rows.push(obj);
    });
    res.json({ rows });
  } catch (err) {
    console.error('❌ signups read error', err);
    res.status(500).json({ error: 'Failed to read signups' });
  }
});

app.get('/download-signups', (req, res) => {
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'No file' });
  res.download(filePath);
});

// Peek into queue for debugging
app.get('/peek-queue', (req, res) => {
  const names = writeQueue.map(j => j.payload?.name || 'unknown');
  res.json({ queueLen: writeQueue.length, isWriting, names });
});

// global error handlers to avoid silent failures
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION', reason);
});

// Ensure excel exists and start
ensureExcelFile().catch(e => console.error('Startup ensure failed', e));
app.listen(5000, () => console.log('Server running on http://localhost:5000'));
console.log(req.files);
