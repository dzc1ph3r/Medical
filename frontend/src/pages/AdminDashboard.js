var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { createDoctor, getUsers, updateUser } from "../api/admin.api";
import { useAuth } from "../context/AuthContext";
import { specialties } from "../utils/specialties";
import { wilayas } from "../utils/wilayas";
export default function AdminDashboard() {
    const { token } = useAuth();
    const [activeTab, setActiveTab] = useState("doctors");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [specialty, setSpecialty] = useState("");
    const [city, setCity] = useState("");
    const [consultationFee, setConsultationFee] = useState("");
    const [gender, setGender] = useState("");
    const loadUsers = () => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        if (!token)
            return;
        setLoading(true);
        setError(null);
        try {
            const res = yield getUsers(token);
            setUsers(res.data);
        }
        catch (err) {
            setError(((_b = (_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || "Impossible de charger les utilisateurs");
        }
        finally {
            setLoading(false);
        }
    });
    useEffect(() => {
        if (activeTab === "users") {
            loadUsers();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, token]);
    const submitDoctor = (event) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        event.preventDefault();
        if (!token)
            return;
        setError(null);
        setSuccess(null);
        try {
            yield createDoctor(token, {
                name,
                email,
                password,
                specialty,
                city: city || undefined,
                consultationFee: consultationFee ? Number(consultationFee) : undefined,
                gender: gender || undefined,
            });
            setSuccess("Médecin créé avec succès.");
            setName("");
            setEmail("");
            setPassword("");
            setSpecialty("");
            setCity("");
            setConsultationFee("");
            setGender("");
        }
        catch (err) {
            setError(((_b = (_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || "Impossible de créer le médecin");
        }
    });
    const updateUserField = (id, payload) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        if (!token)
            return;
        setError(null);
        setSuccess(null);
        try {
            yield updateUser(token, id, payload);
            setSuccess("Profil utilisateur mis à jour.");
            yield loadUsers();
        }
        catch (err) {
            setError(((_b = (_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || "Mise à jour échouée");
        }
    });
    const groupedUsers = useMemo(() => {
        const doctors = users.filter((u) => u.role === "DOCTOR");
        const patients = users.filter((u) => u.role === "PATIENT");
        const admins = users.filter((u) => u.role === "ADMIN");
        return { doctors, patients, admins };
    }, [users]);
    return (_jsxs("div", { className: "dashboard", children: [_jsxs("div", { className: "dashboard__header", children: [_jsxs("div", { children: [_jsx("h2", { children: "Administration" }), _jsx("p", { children: "G\u00E9rez les comptes m\u00E9decins, patients et administrateurs." })] }), _jsxs("div", { className: "tabs", children: [_jsx("button", { className: `tab-button ${activeTab === "doctors" ? "is-active" : ""}`, onClick: () => setActiveTab("doctors"), children: "Cr\u00E9er m\u00E9decin" }), _jsx("button", { className: `tab-button ${activeTab === "users" ? "is-active" : ""}`, onClick: () => setActiveTab("users"), children: "G\u00E9rer utilisateurs" })] })] }), error && _jsx("p", { className: "form-error", children: error }), success && _jsx("p", { className: "form-success", children: success }), activeTab === "doctors" && (_jsxs("form", { onSubmit: submitDoctor, className: "profile-card", children: [_jsxs("div", { className: "form-field", children: [_jsx("label", { children: "Nom" }), _jsx("input", { className: "form-input", value: name, onChange: (e) => setName(e.target.value) })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { children: "Email" }), _jsx("input", { className: "form-input", type: "email", value: email, onChange: (e) => setEmail(e.target.value) })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { children: "Mot de passe" }), _jsx("input", { className: "form-input", type: "password", value: password, onChange: (e) => setPassword(e.target.value) })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { children: "Sp\u00E9cialit\u00E9" }), _jsxs("select", { className: "form-input", value: specialty, onChange: (e) => setSpecialty(e.target.value), children: [_jsx("option", { value: "", children: "Choisir une sp\u00E9cialit\u00E9" }), specialties.map((item) => (_jsx("option", { value: item, children: item }, item)))] })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { children: "Wilaya" }), _jsxs("select", { className: "form-input", value: city, onChange: (e) => setCity(e.target.value), children: [_jsx("option", { value: "", children: "Choisir une wilaya" }), wilayas.map((item) => (_jsx("option", { value: item, children: item }, item)))] })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { children: "Tarif consultation (DA)" }), _jsx("input", { className: "form-input", type: "number", min: "0", value: consultationFee, onChange: (e) => setConsultationFee(e.target.value) })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { children: "Sexe" }), _jsxs("select", { className: "form-input", value: gender, onChange: (e) => setGender(e.target.value), children: [_jsx("option", { value: "", children: "Non sp\u00E9cifi\u00E9" }), _jsx("option", { value: "MALE", children: "Homme" }), _jsx("option", { value: "FEMALE", children: "Femme" })] })] }), _jsx("button", { className: "button-primary", type: "submit", children: "Cr\u00E9er le m\u00E9decin" })] })), activeTab === "users" && (_jsxs("div", { className: "tab-panel", children: [loading && _jsx("p", { children: "Chargement..." }), !loading && (_jsx(_Fragment, { children: ["admins", "doctors", "patients"].map((group) => (_jsxs("div", { className: "info-card", children: [_jsx("h3", { style: { margin: 0, textTransform: "capitalize" }, children: group }), _jsx("div", { className: "card-grid", style: { marginTop: 12 }, children: groupedUsers[group].map((user) => {
                                        var _a;
                                        return (_jsxs("div", { className: "info-card", children: [_jsxs("p", { children: [_jsx("b", { children: user.name }), " \u2014 ", user.email] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { children: "R\u00F4le" }), _jsxs("select", { className: "form-input", value: user.role, onChange: (e) => updateUserField(user._id, { role: e.target.value }), children: [_jsx("option", { value: "PATIENT", children: "Patient" }), _jsx("option", { value: "DOCTOR", children: "M\u00E9decin" }), _jsx("option", { value: "ADMIN", children: "Admin" })] })] }), user.role === "DOCTOR" && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "form-field", children: [_jsx("label", { children: "Sp\u00E9cialit\u00E9" }), _jsxs("select", { className: "form-input", value: user.specialty || "", onChange: (e) => updateUserField(user._id, { specialty: e.target.value }), children: [_jsx("option", { value: "", children: "Choisir" }), specialties.map((item) => (_jsx("option", { value: item, children: item }, item)))] })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { children: "Tarif consultation (DA)" }), _jsx("input", { className: "form-input", type: "number", min: "0", value: (_a = user.consultationFee) !== null && _a !== void 0 ? _a : "", onChange: (e) => updateUserField(user._id, {
                                                                        consultationFee: e.target.value
                                                                            ? Number(e.target.value)
                                                                            : undefined,
                                                                    }) })] })] })), _jsxs("div", { className: "form-field", children: [_jsx("label", { children: "Wilaya" }), _jsxs("select", { className: "form-input", value: user.city || "", onChange: (e) => updateUserField(user._id, { city: e.target.value }), children: [_jsx("option", { value: "", children: "Choisir une wilaya" }), wilayas.map((item) => (_jsx("option", { value: item, children: item }, item)))] })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { children: "Sexe" }), _jsxs("select", { className: "form-input", value: user.gender || "", onChange: (e) => updateUserField(user._id, { gender: e.target.value || undefined }), children: [_jsx("option", { value: "", children: "Non sp\u00E9cifi\u00E9" }), _jsx("option", { value: "MALE", children: "Homme" }), _jsx("option", { value: "FEMALE", children: "Femme" })] })] })] }, user._id));
                                    }) })] }, group))) }))] }))] }));
}
