Signup.jsx
// import React, { useState } from "react";
// import "./Signup.css";
// import { useNavigate } from "react-router-dom";
// import { useEffect } from "react";


// export default function Signup() {
// const initialState = {
// candidatename: "",
// contactNumber: "",
// email_id: "",
// aadhar: null,
// pancard: null,
// image:null,
// resume: null,
// };


// const [state, setState] = useState(initialState);
// const [message, setMessage] = useState("");
// const [form, setForm] = useState({
//   candidatename: "",
//   contactNumber: "",
//   email_id: "",
// });

// const [files, setFiles] = useState({
//   aadhar: null,
//   pancard: null,
//   image:null,
//   resume: null,
// });

// const validateEmail = (email) => {
//   const emailRegex =
//     /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//   return emailRegex.test(email);
// };

// const validatePhone = (phone) => {
//   const cleanedPhone = phone.trim();
//   const phoneRegex = /^[6-9]\d{9}$/;
//   return phoneRegex.test(cleanedPhone);
// };




// const handleChange = (e) => {
// const { name, value, files, type } = e.target;
// if (type === "file") {
// setState({ ...state, [name]: files[0] });
// } else {
// setState({ ...state, [name]: value });
// }
// };

// const handleSubmit = async (e) => {
//   e.preventDefault();

//   if(!validateEmail(form.email_id)){
//     alert("Please enter the valid email-id")
//     return;
//   }

//  if (!validatePhone(form.contactNumber)) {
//   alert("Please enter a valid 10-digit Indian phone number");
//   return;
// }

//   const formData = new FormData();
//   formData.append("candidatename", form.candidatename);
//   formData.append("contactNumber", form.contactNumber);
//   formData.append("email_id", form.email_id);
//   formData.append("aadhar", files.aadhar);
//   formData.append("pancard", files.pancard);
//   formData.append("image", files.image);
//   formData.append("resume", files.resume);

//   let data;
//   try {
//     const res = await fetch("http://localhost:5000/signup", {
//       method: "POST",
//       body: formData,
//     });

//     if (!res.ok) {
//       const err = await res.text();
//       throw new Error(err || 'Request failed');
//     }

//     data = await res.json();
//   } catch (err) {
//     console.error('Submit error', err);
//     alert('Signup failed: ' + (err.message || 'Server error'));
//     return;
//   }

//   if (data.success) {
//     alert("Signup successful");

//     // ✅ RESET TEXT INPUTS
//     setForm({
//       candidatename: "",
//       contactNumber: "",
//       email_id: "",
//     });

//     // ✅ RESET FILE STATE
//     setFiles({
//       aadhar: null,
//       pancard: null,
//       image:null,
//       resume: null,
//     });

//     // ✅ RESET FILE INPUT UI
//     e.target.reset();
//   }
// };


// const navigate = useNavigate();

// // useEffect(() => {
// //   // If page is refreshed, go back to dashboard
// //   if (performance.getEntriesByType("navigation")[0].type === "reload") {
// //     navigate("/", { replace: true });
// //   }
// // }, []);

// useEffect(() => {
//     const fromDashboard = sessionStorage.getItem("fromDashboard");

//     // If page refreshed or accessed directly
//     if (!fromDashboard) {
//       navigate("/", { replace: true });
//     }

//     // Clear flag after first valid entry
//     sessionStorage.removeItem("fromDashboard");
//   }, []);


// return (
//   <div className="page">
//     <div className="signup-hero">

//       <aside className="illustration" aria-hidden>
//         <svg className="illus-blob" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
//           <defs>
//             <linearGradient id="g1" x1="0" x2="1">
//               <stop offset="0%" stopColor="#7c3aed" />
//               <stop offset="100%" stopColor="#06b6d4" />
//             </linearGradient>
//           </defs>
//           <g transform="translate(300,300)">
//             <path d="M120,-160C157,-129,188,-97,190,-62C192,-27,165,12,146,52C127,92,116,132,89,157C62,182,19,193,-22,196C-62,199,-123,194,-151,166C-179,139,-175,88,-173,41C-171,-5,-171,-49,-150,-79C-129,-109,-87,-125,-46,-154C-5,-183,36,-224,78,-217C120,-210,83,-191,120,-160Z" fill="url(#g1)"/>
//           </g>
//         </svg>
//         <h3 className="illus-title">Join the SakyaEduTech webinar</h3>
//         <p className="illus-text">Fast registration, expert speakers, and a live Q&amp;A session — limited seats.</p>
//         <ul className="features">
//           <li>📜 Certificate</li>
//           <li>🎤 Live Q&amp;A</li>
//           <li>⏱️ 1 hour</li>
//         </ul>
//       </aside>

//       <div className="card">
//         <h1 className="title">Webinar Registration</h1>
//         <p className="subtitle">SakyaEduTech</p>

//         <form id="signup-form" onSubmit={handleSubmit} encType="multipart/form-data" autoComplete="off" className="form-grid">

//           <div className="field">
//             <label>Candidate Name</label>
//             <input
//               type="text"
//               name="candidatename"
//               placeholder="Name"
//               value={form.candidatename}
//               onChange={(e) => setForm({ ...form, candidatename: e.target.value })}
//               required
//             />
//           </div>

//           <div className="field two">
//             <div>
//               <label>Contact Number</label>
//               <input
//                 type="tel"
//                 name="contactNumber"
//                 placeholder="98765 43210"
//                 maxlength="10"
//                 value={form.contactNumber}
//                 onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
//                 required
//               />
//             </div>
//             <div>
//               <label>Email ID</label>
//               <input
//                 type="email"
//                 name="email_id"
//                 placeholder="you@gmail.com"
//                 value={form.email_id}
//                 onChange={(e) => setForm({ ...form, email_id: e.target.value })}
//                 required
//               />
//             </div>
//           </div>

//           <div className="field">
//             <label>Aadhar Card (PDF)</label>
//             <div className="file-row">
//               <input type="file" id="aadhar" onChange={(e) => setFiles({ ...files, aadhar: e.target.files[0] })} required accept="application/pdf" />
//               <div className="file-name">{files.aadhar?.name || 'No file chosen'}</div>
//             </div>
//           </div>

//           <div className="field">
//             <label>PAN Card (PDF)</label>
//             <div className="file-row">
//               <input type="file" id="pancard" onChange={(e) => setFiles({ ...files, pancard: e.target.files[0] })} required accept="application/pdf" />
//               <div className="file-name">{files.pancard?.name || 'No file chosen'}</div>
//             </div>
//           </div>

//           <div className="field">
//             <label>Image (JPG/PNG)</label>
//             <div className="file-row">
//               <input type="file" id="image" onChange={(e) => setFiles({ ...files, image: e.target.files[0] })} required accept="image/*" />
//               <div className="file-name">{files.image?.name || 'No file chosen'}</div>
//             </div>
//           </div>

//           <div className="field">
//             <label>Resume (PDF)</label>
//             <div className="file-row">
//               <input type="file" id="resume" onChange={(e) => setFiles({ ...files, resume: e.target.files[0] })} required accept="application/pdf" />
//               <div className="file-name">{files.resume?.name || 'No file chosen'}</div>
//             </div>
//           </div>

//           {message && <div className="message">{message}</div>}

//           <div className="actions">
//             <button type="submit" className="btn-primary">Signup</button>
//             <button type="button" className="btn-secondary" onClick={() => { setForm({ candidatename: '', contactNumber: '', email_id: '' }); setFiles({ aadhar: null, pancard: null, image: null, resume: null }); setMessage(''); document.getElementById('signup-form')?.reset(); }}>Reset</button>
//           </div>

//           <p className="note">By registering you agree to our terms. We store filenames only.</p>
//         </form>
//       </div>
//     </div>
//   </div>
//   );
// }




// =========================
// FINAL Signup.jsx
// =========================

import React, { useState, useEffect } from "react";
import "./Signup.css";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({
    candidatename: "",
    contactNumber: "",
    email_id: "",
  });

  const [files, setFiles] = useState({
    aadhar: null,
    pancard: null,
    image: null,
    resume: null,
  });

  const navigate = useNavigate();

  const validateEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

  const validatePhone = (phone) =>
    /^[6-9]\d{9}$/.test(phone.trim());

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(form.email_id)) {
      alert("Please enter a valid email ID");
      return;
    }

    if (!validatePhone(form.contactNumber)) {
      alert("Please enter a valid 10-digit Indian phone number");
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    Object.entries(files).forEach(([k, v]) => formData.append(k, v));

    try {
      const res = await fetch( "https://sakyaedu-backend.onrender.com/api/signup", {            //https://sakyaedu-backend.onrender.com/api/signup //http://localhost:5000/signup
        method: "POST",  
        body: formData,
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data.success) {
        alert("Registration successful!");
        setForm({ candidatename: "", contactNumber: "", email_id: "" });
        setFiles({ aadhar: null, pancard: null, image: null, resume: null });
        e.target.reset();
      }
    } catch {
      alert("Signup failed. Please try again.");
    }
  };

  useEffect(() => {
    const fromDashboard = sessionStorage.getItem("fromDashboard");
    if (!fromDashboard) navigate("/", { replace: true });
    sessionStorage.removeItem("fromDashboard");
  }, [navigate]);

  return (
    <div className="page">
      <div className="signup-hero">
        <aside className="illustration">
          <h3 className="illus-title">Join the SakyaEduTech Webinar</h3>
          <p className="illus-text">
            Fast registration, expert speakers, and live Q&amp;A.
          </p>
          <ul className="features">
            <li>📜 Certificate</li>
            <li>🎤 Live Q&amp;A</li>
            <li>⏱️ 1 Hour Session</li>
          </ul>
        </aside>

        <div className="card">
          <h1 className="title">Webinar Registration</h1>
          <p className="subtitle">SakyaEduTech</p>

          <form id="signup-form" onSubmit={handleSubmit}>
            <div className="field">
              <label>Candidate Name</label>
              <input
                type="text"
                value={form.candidatename}
                placeholder="Enter the Name"
                onChange={(e) =>
                  setForm({ ...form, candidatename: e.target.value })
                }
                required
              />
            </div>

            <div className="field two">
              <div>
                <label>Contact Number</label>
                <input
                  type="tel"
                  maxLength="10"
                  value={form.contactNumber}
                  placeholder="Enter the Contact number"
                  onChange={(e) =>
                    setForm({ ...form, contactNumber: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label>Email ID</label>
                <input
                  type="email"
                  value={form.email_id}
                  placeholder="Enter email_id"
                  onChange={(e) =>
                    setForm({ ...form, email_id: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {[
              ["Aadhar Card (PDF)", "aadhar", "application/pdf"],
              ["PAN Card (PDF)", "pancard", "application/pdf"],
              ["Image (JPG/PNG)", "image", "image/*"],
              ["Resume (PDF)", "resume", "application/pdf"],
            ].map(([label, key, accept]) => (
              <div className="field" key={key}>
                <label>{label}</label>
                <div className="file-row">
                  <input
                    type="file"
                    accept={accept}
                    onChange={(e) =>
                      setFiles({ ...files, [key]: e.target.files[0] })
                    }
                    required
                  />
                  <div className="file-name">
                    {files[key]?.name || "No file chosen"}
                  </div>
                </div>
              </div>
            ))}

            <div className="actions">
              <button type="submit" className="btn-primary">
                Register Now
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setForm({ candidatename: "", contactNumber: "", email_id: "" });
                  setFiles({
                    aadhar: null,
                    pancard: null,
                    image: null,
                    resume: null,
                  });
                  document.getElementById("signup-form")?.reset();
                }}
              >
                Reset
              </button>
            </div>

            <p className="note">
              By registering, you agree to our terms and conditions.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
