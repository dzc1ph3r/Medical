import { Routes, Route, Navigate } from "react-router-dom";

import AppLayout from "./layouts/AppLayout";
import Doctors from "./pages/Doctors";
import DoctorProfile from "./pages/DoctorProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Forbidden from "./pages/Forbidden";
import NotFound from "./pages/NotFound";

import RoleRoute from "./components/RoleRoute";

export default function App() {
  return (
    <AppLayout>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Doctors />} />
        <Route path="/doctors/:id" element={<DoctorProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected by role */}
        <Route
          path="/patient/dashboard"
          element={
            <RoleRoute role="PATIENT">
              <PatientDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/doctor/dashboard"
          element={
            <RoleRoute role="DOCTOR">
              <DoctorDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <RoleRoute role="ADMIN">
              <AdminDashboard />
            </RoleRoute>
          }
        />

        {/* Errors */}
        <Route path="/403" element={<Forbidden />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </AppLayout>
  );
}
