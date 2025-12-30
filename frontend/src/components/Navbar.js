import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const onLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };
    const dashboardPath = (user === null || user === void 0 ? void 0 : user.role) === "DOCTOR" ? "/doctor/dashboard" : "/patient/dashboard";
    return (_jsxs("header", { className: "navbar bg-white/80 backdrop-blur", children: [_jsxs("div", { className: "navbar__left", children: [_jsxs(Link, { to: "/", className: "navbar__brand flex items-center gap-2", children: [_jsx("span", { className: "logo-icon", children: _jsxs("svg", { width: "28", height: "28", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": "true", children: [_jsx("path", { d: "M12 2C7.03 2 3 6.03 3 11c0 4.5 3.14 8.26 7.39 8.94L12 22l1.61-2.06C17.86 19.26 21 15.5 21 11c0-4.97-4.03-9-9-9z", fill: "#38bdf8" }), _jsx("path", { d: "M9 10.5h2.5V8h2v2.5H16v2h-2.5V15h-2v-2.5H9v-2z", fill: "#0f172a" })] }) }), "MedCare"] }), _jsxs("nav", { className: "navbar__links", children: [(user === null || user === void 0 ? void 0 : user.role) !== "DOCTOR" && _jsx(Link, { to: "/", children: "M\u00E9decins" }), (user === null || user === void 0 ? void 0 : user.role) === "PATIENT" && _jsx(Link, { to: "/patient/dashboard", children: "Mes RDV" }), (user === null || user === void 0 ? void 0 : user.role) === "DOCTOR" && _jsx(Link, { to: "/doctor/dashboard", children: "Calendrier" }), (user === null || user === void 0 ? void 0 : user.role) === "ADMIN" && _jsx(Link, { to: "/admin", children: "Admin" })] })] }), _jsx("div", { className: "navbar__actions", children: !user ? (_jsxs(_Fragment, { children: [_jsx(Link, { to: "/login", style: { textDecoration: "none", color: "#334155" }, children: "Connexion" }), _jsx(Link, { to: "/register", style: { textDecoration: "none", color: "#334155" }, children: "Inscription" })] })) : (_jsxs(_Fragment, { children: [_jsxs("span", { className: "navbar__user", children: [user.name, " \u2014 ", _jsx("b", { children: user.role })] }), _jsx("button", { onClick: onLogout, style: {
                                padding: "6px 12px",
                                borderRadius: 8,
                                border: "1px solid #e2e8f0",
                                background: "#f8fafc",
                                cursor: "pointer",
                            }, children: "D\u00E9connexion" })] })) })] }));
}
