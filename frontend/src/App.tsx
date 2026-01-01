import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import DoctorProfile from "./pages/DoctorProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Forbidden from "./pages/Forbidden";
import NotFound from "./pages/NotFound";
import Notifications from "./pages/Notifications";
import About from "./pages/About";
import Services from "./pages/Services";
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import RoleRoute from "./components/RoleRoute";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* Routes avec PublicLayout (pages publiques) */}
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Routes avec AppLayout (pages avec navbar) */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:id" element={<DoctorProfile />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/403" element={<Forbidden />} />
        <Route path="/404" element={<NotFound />} />
      </Route>

      {/* Dashboard Routes avec DashboardLayout */}
      <Route path="/patient/dashboard" element={
        <RoleRoute role="PATIENT">
          <DashboardLayout>
            <PatientDashboard />
          </DashboardLayout>
        </RoleRoute>
      } />

      <Route path="/doctor/dashboard" element={
        <RoleRoute role="DOCTOR">
          <DashboardLayout>
            <DoctorDashboard />
          </DashboardLayout>
        </RoleRoute>
      } />

      <Route path="/admin" element={
        <RoleRoute role="ADMIN">
          <DashboardLayout>
            <AdminDashboard />
          </DashboardLayout>
        </RoleRoute>
      } />

      {/* Page de notifications - accessible à tous les rôles connectés */}
      <Route path="/notifications" element={
        <ProtectedRoute>
          <DashboardLayout>
            <Notifications />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
