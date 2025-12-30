import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function ProtectedRoute({ children }) {
    const { token, loadingMe } = useAuth();
    const location = useLocation();
    // ✅ Attendre la vérification /me avant de décider
    if (loadingMe)
        return _jsx("div", { children: "Chargement..." });
    // ✅ Si pas connecté, on redirige vers login (en gardant la page demandée)
    if (!token) {
        return _jsx(Navigate, { to: "/login", replace: true, state: { from: location } });
    }
    return children;
}
