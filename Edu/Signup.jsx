// =========================
// FINAL Signup.jsx
// =========================

import React, { useState, useEffect } from "react";
import "./Signup.css";
import { useNavigate } from "react-router-dom";

export default function Signup() {

  console.log("FRONTEND BUILD 19-DEC");
  
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

  const API_BASE = "https://sakyaedu-backend.onrender.com";

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
      const res = await fetch("${API_BASE}/signup", {
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
