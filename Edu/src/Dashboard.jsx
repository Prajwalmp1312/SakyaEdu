// import React from "react";
// import { Calendar, Clock, Video, BookOpen, Building2 } from "lucide-react";
// import { Link, useNavigate, Outlet } from 'react-router-dom'
// import pic from './Pic/WhatsApp Image 2025-12-10 at 5.33.56 PM.jpeg'




// export default function Dashboard() {
//     const navigate = useNavigate();

//     const goToSignup = () => {
//     sessionStorage.setItem("fromDashboard", "true");
//     navigate("/signup");
//   };

//   return (
//     <> 
//     <div style={styles.container}>
//       <div style={styles.card}>
//     <img src={pic} alt=""  height={100} width={200}/>
//         <h1 style={styles.title}>SakyaEduTech Webinar</h1>
//         <p style={styles.subtitle}>Career Guidance & Technical Learning</p>

//         <div style={styles.grid}>
//           <Info icon={<Building2 />} label="Organization" value="SakyaEduTech" />
//           <Info icon={<BookOpen />} label="Topic" value="SAP EICO" />
//           <Info icon={<Calendar />} label="Date" value="20th December 2025 (Saturday)" />
//           <Info icon={<Clock />} label="Time" value="6:00 PM – 7:00 PM" />
//         </div>

//         <div style={styles.mode}>
//           <Video /> <span>Live Online Webinar</span>
//         </div>

//         <button style={styles.button} onClick={goToSignup}>
//       Register Now
//     </button> 

//        {/* <button
//         className="register-btn"
//         onClick={() => navigate("/signup")}
//       >
//         Register Now
//       </button> */}
//       </div>
//     </div> 
//     <Outlet />
//     </>
//   );
// }

// function Info({ icon, label, value }) {
//   return (
//     <div style={styles.info}>
//       <span style={styles.icon}>{icon}</span>
//       <div>
//         <div style={styles.label}>{label}</div>
//         <div style={styles.value}>{value}</div>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   container: {
//     minHeight: "100vh",
//     background: "#f5f7fb",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   card: {
//     background: "#fff",
//     padding: "32px",
//     borderRadius: "16px",
//     width: "100%",
//     maxWidth: "600px",
//     boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
//     textAlign: "center",
//   },
//   title: { fontSize: "28px", fontWeight: "bold" },
//   subtitle: { color: "#666", marginBottom: "24px" },
//   grid: {
//     display: "grid",
//     gridTemplateColumns: "1fr 1fr",
//     gap: "16px",
//     textAlign: "left",
//   },
//   info: { display: "flex", gap: "10px", alignItems: "center" },
//   icon: { color: "#2563eb" },
//   label: { fontSize: "12px", color: "#888" },
//   value: { fontWeight: "600" },
//   mode: {
//     marginTop: "20px",
//     display: "flex",
//     justifyContent: "center",
//     gap: "8px",
//     fontWeight: "500",
//   },
//   button: {
//     marginTop: "24px",
//     padding: "12px 24px",
//     background: "linear-gradient(90deg,var(--accent),var(--accent-2))",  //#2563eb
//     color: "white",
//     border: "none",
//     borderRadius: "12px",
//     fontSize: "16px",
//     cursor: "pointer",
//     width:"100%",
//     transition: "transform .12s ease",
//     boxShadow:"box-shadow .12s ease",
//   },
// };


/*************************
 * 
 */


import React from "react";
import { Calendar, Clock, Video, BookOpen, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import pic from './Pic/WhatsApp Image 2025-12-10 at 5.33.56 PM.jpeg'

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
            src={pic}
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
