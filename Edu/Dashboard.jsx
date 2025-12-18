import React from "react";
import { Calendar, Clock, Video, BookOpen, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const goToSignup = () => {
    sessionStorage.setItem("fromDashboard", "true");
    navigate("/signup");
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-card">

        {/* Header */}
        <div className="dashboard-header">
          <img
            src="/logo-placeholder.png"
            alt="Company Logo"
            className="company-logo"
          />

          <h1 className="dashboard-title">SakyaEduTech Webinar</h1>
          <p className="dashboard-subtitle">
            Career Guidance & Advanced Technical Learning
          </p>
        </div>

        {/* Info Grid */}
        <div className="info-grid">
          <Info icon={<Building2 />} label="Organization" value="SakyaEduTech" />
          <Info icon={<BookOpen />} label="Topic" value="SAP FICO" />
          <Info icon={<Calendar />} label="Date" value="20 December 2025" />
          <Info icon={<Clock />} label="Time" value="6:00 PM – 7:00 PM" />
        </div>

        {/* Mode */}
        <div className="mode">
          <Video size={18} />
          <span>Live Online Webinar</span>
        </div>

        {/* CTA */}
        <button className="register-btn" onClick={goToSignup}>
          Register Now
        </button>
      </div>
    </div>
  );
}

function Info({ icon, label, value }) {
  return (
    <div className="info-item">
      <span className="info-icon">{icon}</span>
      <div>
        <div className="info-label">{label}</div>
        <div className="info-value">{value}</div>
      </div>
    </div>
  );
}
