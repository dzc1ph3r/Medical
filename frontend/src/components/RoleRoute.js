import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function RoleRoute({ role, children, }) {
    const { token, user, loadingMe } = useAuth();
    const location = useLocation();
    // ⏳ Attendre /me
    if (loadingMe)
        return _jsx("div", { children: "Chargement..." });
    // 🔐 Pas connecté → login
    if (!token) {
        return _jsx(Navigate, { to: "/login", replace: true, state: { from: location } });
    }
    // ⚠️ Token présent mais user absent
    if (!user) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    // ⛔ Mauvais rôle → 403
    if (user.role !== role) {
        return _jsx(Navigate, { to: "/403", replace: true });
    }
    return children;
}
