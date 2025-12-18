import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import Signup from "./Signup";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
