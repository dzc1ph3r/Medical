var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { login as loginApi } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";
export default function Login() {
    const navigate = useNavigate();
    const { setToken, refreshMe, user } = useAuth();
    // ✅ Si déjà connecté, redirige selon le rôle
    if ((user === null || user === void 0 ? void 0 : user.role) === "DOCTOR")
        return _jsx(Navigate, { to: "/doctor/dashboard", replace: true });
    if ((user === null || user === void 0 ? void 0 : user.role) === "PATIENT")
        return _jsx(Navigate, { to: "/patient/dashboard", replace: true });
    if ((user === null || user === void 0 ? void 0 : user.role) === "ADMIN")
        return _jsx(Navigate, { to: "/admin", replace: true });
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const onSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        e.preventDefault();
        setError(null);
        if (!email.trim() || !password.trim()) {
            setError("Veuillez renseigner votre email et mot de passe.");
            return;
        }
        if (password.trim().length < 6) {
            setError("Le mot de passe doit contenir au moins 6 caractères.");
            return;
        }
        setLoading(true);
        try {
            const res = yield loginApi(email, password);
            const token = res.data.token;
            const loggedUser = res.data.user;
            // 1) Sauvegarder le token
            setToken(token);
            // 2) Charger /me (sécurité)
            yield refreshMe();
            // 3) Redirection par rôle
            if (loggedUser.role === "DOCTOR") {
                navigate("/doctor/dashboard", { replace: true });
            }
            else if (loggedUser.role === "PATIENT") {
                navigate("/patient/dashboard", { replace: true });
            }
            else {
                navigate("/admin", { replace: true });
            }
        }
        catch (err) {
            setError(((_b = (_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || "Login failed");
        }
        finally {
            setLoading(false);
        }
    });
    return (_jsx("div", { className: "auth-page", children: _jsxs("div", { className: "auth-card", children: [_jsxs("div", { className: "auth-card__header", children: [_jsx("h2", { children: "Connexion" }), _jsx("p", { children: "Acc\u00E8de \u00E0 ton tableau de bord patient ou m\u00E9decin." })] }), _jsxs("form", { onSubmit: onSubmit, className: "auth-form", children: [_jsxs("div", { className: "form-field", children: [_jsx("label", { children: "Email" }), _jsx("input", { className: "form-input", type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { children: "Mot de passe" }), _jsx("input", { className: "form-input", type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true })] }), error && _jsx("p", { className: "form-error", children: error }), _jsx("button", { type: "submit", disabled: loading, className: "button-primary", children: loading ? "Connexion..." : "Se connecter" })] }), _jsxs("p", { className: "auth-footer", children: ["Pas encore de compte ? ", _jsx(Link, { to: "/register", children: "Cr\u00E9er un compte" })] })] }) }));
}
