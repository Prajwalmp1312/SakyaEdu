

/**************************** */

@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Poppins:wght@600;700;800&display=swap");

:root {
  --primary: #4f46e5;
  --secondary: #06b6d4;
  --accent: #9333ea;
  --dark: #020617;
  --card-bg: rgba(255, 255, 255, 0.96);
  --text-dark: #020617;
  --text-muted: #475569;
  --radius-lg: 22px;
  --radius-md: 14px;
}


*{
  margin: 0;
  padding: 0;
}
/* Page */
.page {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 24px;
  font-family: "Inter", system-ui;
  background:
    radial-gradient(circle at top left, #6366f1, transparent 40%),
    radial-gradient(circle at bottom right, #22d3ee, transparent 40%),
    linear-gradient(180deg, #020617, #020617);
}

/* Layout */
.signup-hero {
  max-width: 1100px;
  width: 90%;
  display: grid;
  grid-template-columns: 1fr 560px;
  gap: 48px;
  align-items: center;
}

/* Illustration */
.illustration {
  padding: 48px;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: #fff;
}

.illus-title {
  font-family: "Poppins";
  font-size: 34px;
  font-weight: 800;
  margin-bottom: 14px;
}

.illus-text {
  font-size: 18px;
  line-height: 1.7;
  margin-bottom: 26px;
}

.features {
  display: flex;
  gap: 18px;
  font-weight: 700;
}

/* Card */
.card {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 40px 36px;
  box-shadow: 0 35px 80px rgba(0, 0, 0, 0.35);
}

.title {
  font-family: "Poppins";
  font-size: 28px;
  font-weight: 800;
  text-align: center;
}

.subtitle {
  text-align: center;
  color: var(--text-muted);
  margin-bottom: 28px;
}

/* Form */
.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

.field.two {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

label {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 6px;
}

input {
  width: 100%;
  padding: 14px 16px;
  border-radius: var(--radius-md);
  border: 1px solid #c7d2fe;
  font-size: 15px;
  font-weight: 600;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.2);
}

/* File row */
.file-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.file-row input[type="file"] {
  max-width: 160px;
}

.file-name {
  flex: 1;
  padding: 10px 14px;
  background: #eef2ff;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 600;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* Buttons */
.actions {
  display: flex;
  gap: 12px;
  margin-top: 18px;
}

.btn-primary {
  flex: 1;
  padding: 16px;
  border-radius: var(--radius-md);
  background: linear-gradient(90deg, var(--primary), var(--accent));
  color: #fff;
  font-weight: 800;
  font-size: 16px;
  border: none;
  cursor: pointer;
}

.btn-secondary {
  padding: 14px 18px;
  border-radius: var(--radius-md);
  border: 1px solid #c7d2fe;
  background: transparent;
  font-weight: 600;
}

/* Note */
.note {
  text-align: center;
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 10px;
}

/* Responsive */
@media (max-width: 900px) {
  .signup-hero {
    grid-template-columns: 1fr;
  }
  .field.two {
    grid-template-columns: 1fr;
  }
}