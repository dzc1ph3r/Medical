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
import { Link, Navigate, useNavigate } from "react-router-dom";
import { register as registerApi } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";
import { wilayas } from "../utils/wilayas";
export default function Register() {
    const navigate = useNavigate();
    const { setToken, refreshMe, user } = useAuth();
    if ((user === null || user === void 0 ? void 0 : user.role) === "DOCTOR")
        return _jsx(Navigate, { to: "/doctor/dashboard", replace: true });
    if ((user === null || user === void 0 ? void 0 : user.role) === "PATIENT")
        return _jsx(Navigate, { to: "/patient/dashboard", replace: true });
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [city, setCity] = useState("");
    const [gender, setGender] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const onSubmit = (event) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        event.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const payload = {
                name,
                email,
                password,
                role: "PATIENT",
                gender: gender || undefined,
                city: city || undefined,
            };
            const res = yield registerApi(payload);
            const token = res.data.token;
            const loggedUser = res.data.user;
            setToken(token);
            yield refreshMe();
            if (loggedUser.role === "DOCTOR") {
                navigate("/doctor/dashboard", { replace: true });
            }
            else {
                navigate("/patient/dashboard", { replace: true });
            }
        }
        catch (err) {
            setError(((_b = (_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || "Inscription impossible");
        }
        finally {
            setLoading(false);
        }
    });
    return (_jsx("div", { className: "auth-page", children: _jsxs("div", { className: "auth-card", children: [_jsxs("div", { className: "auth-card__header", children: [_jsx("h2", { children: "Cr\u00E9er un compte" }), _jsx("p", { children: "Rejoins MedCare pour g\u00E9rer tes rendez-vous facilement." })] }), _jsxs("form", { onSubmit: onSubmit, className: "auth-form", children: [_jsxs("div", { className: "form-field", children: [_jsx("label", { children: "Nom" }), _jsx("input", { className: "form-input", value: name, onChange: (e) => setName(e.target.value), required: true })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { children: "Email" }), _jsx("input", { className: "form-input", type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { children: "Mot de passe" }), _jsx("input", { className: "form-input", type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { children: "Wilaya" }), _jsxs("select", { className: "form-input", value: city, onChange: (e) => setCity(e.target.value), children: [_jsx("option", { value: "", children: "Choisir une wilaya" }), wilayas.map((item) => (_jsx("option", { value: item, children: item }, item)))] })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { children: "Sexe" }), _jsxs("select", { className: "form-input", value: gender, onChange: (e) => setGender(e.target.value), children: [_jsx("option", { value: "", children: "Non sp\u00E9cifi\u00E9" }), _jsx("option", { value: "MALE", children: "Homme" }), _jsx("option", { value: "FEMALE", children: "Femme" })] })] }), error && _jsx("p", { className: "form-error", children: error }), _jsx("button", { type: "submit", disabled: loading, className: "button-primary", children: loading ? "Création..." : "Créer le compte" })] }), _jsxs("p", { className: "auth-footer", children: ["D\u00E9j\u00E0 un compte ? ", _jsx(Link, { to: "/login", children: "Se connecter" })] }), _jsx("p", { className: "auth-footer", style: { marginTop: 8 }, children: "Les comptes m\u00E9decins sont cr\u00E9\u00E9s par l\u2019administrateur." })] }) }));
}
