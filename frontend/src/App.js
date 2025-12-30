import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsx(AppLayout, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Doctors, {}) }), _jsx(Route, { path: "/doctors/:id", element: _jsx(DoctorProfile, {}) }), _jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/register", element: _jsx(Register, {}) }), _jsx(Route, { path: "/patient/dashboard", element: _jsx(RoleRoute, { role: "PATIENT", children: _jsx(PatientDashboard, {}) }) }), _jsx(Route, { path: "/doctor/dashboard", element: _jsx(RoleRoute, { role: "DOCTOR", children: _jsx(DoctorDashboard, {}) }) }), _jsx(Route, { path: "/admin", element: _jsx(RoleRoute, { role: "ADMIN", children: _jsx(AdminDashboard, {}) }) }), _jsx(Route, { path: "/403", element: _jsx(Forbidden, {}) }), _jsx(Route, { path: "/404", element: _jsx(NotFound, {}) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/404", replace: true }) })] }) }));
}
