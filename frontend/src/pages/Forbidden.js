import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function Forbidden() {
    const { user } = useAuth();
    return (_jsxs("div", { style: {
            minHeight: "70vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: 24,
        }, children: [_jsx("h1", { style: { fontSize: 48 }, children: "403" }), _jsx("h2", { children: "Acc\u00E8s interdit" }), _jsx("p", { style: { maxWidth: 420, marginTop: 12 }, children: "Vous n\u2019avez pas les permissions n\u00E9cessaires pour acc\u00E9der \u00E0 cette page." }), user && (_jsxs("p", { style: { marginTop: 8, opacity: 0.8 }, children: ["Connect\u00E9 en tant que ", _jsx("b", { children: user.role })] })), _jsxs("div", { style: { marginTop: 20, display: "flex", gap: 12 }, children: [_jsx(Link, { to: "/", style: { textDecoration: "underline" }, children: "Retour \u00E0 l\u2019accueil" }), (user === null || user === void 0 ? void 0 : user.role) === "DOCTOR" && (_jsx(Link, { to: "/doctor/dashboard", children: "Dashboard m\u00E9decin" })), (user === null || user === void 0 ? void 0 : user.role) === "PATIENT" && (_jsx(Link, { to: "/patient/dashboard", children: "Dashboard patient" }))] })] }));
}
