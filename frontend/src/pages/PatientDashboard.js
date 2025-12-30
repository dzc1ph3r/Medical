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
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyAppointments } from "../api/appointment.api";
import { updateMe, updatePassword } from "../api/user.api";
import { deleteMedicalRecord, getMedicalRecordFile, getMyMedicalRecords, uploadMedicalRecord, } from "../api/medicalRecord.api";
import { wilayas } from "../utils/wilayas";
const getDoctorLabel = (doctor) => {
    if (typeof doctor === "string")
        return doctor;
    const specialty = doctor.specialty;
    return specialty ? `${doctor.name} (${specialty})` : doctor.name;
};
export default function PatientDashboard() {
    var _a, _b, _c;
    const { token, user, refreshMe } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("appointments");
    const [savingProfile, setSavingProfile] = useState(false);
    const [profileError, setProfileError] = useState(null);
    const [name, setName] = useState((_a = user === null || user === void 0 ? void 0 : user.name) !== null && _a !== void 0 ? _a : "");
    const [city, setCity] = useState((_b = user === null || user === void 0 ? void 0 : user.city) !== null && _b !== void 0 ? _b : "");
    const [gender, setGender] = useState((_c = user === null || user === void 0 ? void 0 : user.gender) !== null && _c !== void 0 ? _c : "");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [passwordMessage, setPasswordMessage] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [records, setRecords] = useState([]);
    const [recordLoading, setRecordLoading] = useState(false);
    const [recordError, setRecordError] = useState(null);
    const [selectedDoctorId, setSelectedDoctorId] = useState("");
    const [recordNotes, setRecordNotes] = useState("");
    const [recordFile, setRecordFile] = useState(null);
    const [recordSuccess, setRecordSuccess] = useState(null);
    const [recordPreviewUrl, setRecordPreviewUrl] = useState(null);
    const [recordPreviewError, setRecordPreviewError] = useState(null);
    const profileDirty = useMemo(() => {
        var _a, _b, _c;
        return name !== ((_a = user === null || user === void 0 ? void 0 : user.name) !== null && _a !== void 0 ? _a : "") ||
            city !== ((_b = user === null || user === void 0 ? void 0 : user.city) !== null && _b !== void 0 ? _b : "") ||
            gender !== ((_c = user === null || user === void 0 ? void 0 : user.gender) !== null && _c !== void 0 ? _c : "");
    }, [name, city, gender, user]);
    const loadAppointments = () => __awaiter(this, void 0, void 0, function* () {
        if (!token)
            return;
        setLoading(true);
        try {
            const res = yield getMyAppointments(token);
            setAppointments(res.data);
        }
        finally {
            setLoading(false);
        }
    });
    useEffect(() => {
        loadAppointments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);
    useEffect(() => {
        var _a, _b, _c;
        setName((_a = user === null || user === void 0 ? void 0 : user.name) !== null && _a !== void 0 ? _a : "");
        setCity((_b = user === null || user === void 0 ? void 0 : user.city) !== null && _b !== void 0 ? _b : "");
        setGender((_c = user === null || user === void 0 ? void 0 : user.gender) !== null && _c !== void 0 ? _c : "");
    }, [user]);
    useEffect(() => {
        return () => {
            if (recordPreviewUrl)
                URL.revokeObjectURL(recordPreviewUrl);
        };
    }, [recordPreviewUrl]);
    const loadRecords = () => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        if (!token)
            return;
        setRecordLoading(true);
        try {
            const res = yield getMyMedicalRecords(token);
            setRecords(res.data);
        }
        catch (err) {
            setRecordError(((_b = (_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || "Impossible de charger vos documents");
        }
        finally {
            setRecordLoading(false);
        }
    });
    useEffect(() => {
        if (activeTab === "documents") {
            loadRecords();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, token]);
    const submitProfile = (event) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        event.preventDefault();
        if (!token)
            return;
        setSavingProfile(true);
        setProfileError(null);
        try {
            yield updateMe(token, { name, city, gender: gender || undefined });
            yield refreshMe();
        }
        catch (err) {
            setProfileError(((_b = (_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || "Impossible de mettre à jour le profil");
        }
        finally {
            setSavingProfile(false);
        }
    });
    const submitPassword = (event) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        event.preventDefault();
        if (!token)
            return;
        setPasswordLoading(true);
        setPasswordError(null);
        setPasswordMessage(null);
        try {
            yield updatePassword(token, { currentPassword, newPassword });
            setPasswordMessage("Mot de passe mis à jour.");
            setCurrentPassword("");
            setNewPassword("");
        }
        catch (err) {
            setPasswordError(((_b = (_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || "Impossible de changer le mot de passe");
        }
        finally {
            setPasswordLoading(false);
        }
    });
    const submitRecord = (event) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        event.preventDefault();
        if (!token)
            return;
        setRecordError(null);
        setRecordSuccess(null);
        if (!selectedDoctorId || !recordFile) {
            setRecordError("Veuillez choisir un médecin et un fichier.");
            return;
        }
        try {
            yield uploadMedicalRecord(token, {
                doctorId: selectedDoctorId,
                notes: recordNotes || undefined,
                file: recordFile,
            });
            setRecordSuccess("Document envoyé au médecin.");
            setRecordFile(null);
            setRecordNotes("");
            yield loadRecords();
        }
        catch (err) {
            setRecordError(((_b = (_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || "Impossible d'envoyer le document");
        }
    });
    const openRecord = (recordId) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        if (!token)
            return;
        setRecordPreviewError(null);
        try {
            const blob = yield getMedicalRecordFile(token, recordId);
            const url = URL.createObjectURL(blob);
            if (recordPreviewUrl)
                URL.revokeObjectURL(recordPreviewUrl);
            setRecordPreviewUrl(url);
        }
        catch (err) {
            setRecordPreviewError(((_b = (_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || "Impossible d'ouvrir le document");
        }
    });
    const removeRecord = (recordId) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        if (!token)
            return;
        if (!confirm("Supprimer ce document ?"))
            return;
        try {
            yield deleteMedicalRecord(token, recordId);
            yield loadRecords();
        }
        catch (err) {
            setRecordError(((_b = (_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || "Suppression impossible");
        }
    });
    if (!token)
        return _jsx("div", { children: "Connecte-toi en tant que patient." });
    return (_jsxs("div", { className: "dashboard", children: [_jsxs("div", { className: "dashboard__header", children: [_jsxs("div", { children: [_jsx("h2", { children: "Tableau de bord patient" }), _jsx("p", { children: "G\u00E8re tes rendez-vous et ton profil personnel." })] }), _jsxs("div", { className: "tabs", children: [_jsx("button", { className: `tab-button ${activeTab === "appointments" ? "is-active" : ""}`, onClick: () => setActiveTab("appointments"), children: "Rendez-vous" }), _jsx("button", { className: `tab-button ${activeTab === "documents" ? "is-active" : ""}`, onClick: () => setActiveTab("documents"), children: "Documents" }), _jsx("button", { className: `tab-button ${activeTab === "profile" ? "is-active" : ""}`, onClick: () => setActiveTab("profile"), children: "Profil" })] })] }), activeTab === "appointments" && (_jsxs("div", { className: "tab-panel", children: [_jsxs("p", { className: "muted", children: ["Besoin d'un nouveau rendez-vous ?", " ", _jsx(Link, { to: "/", children: "Chercher un m\u00E9decin" }), "."] }), loading && _jsx("p", { children: "Chargement..." }), !loading && appointments.length === 0 && (_jsx("p", { children: "Aucun rendez-vous pour le moment." })), _jsx("div", { className: "card-grid", children: appointments.map((appointment) => (_jsxs("div", { className: "info-card", children: [_jsxs("p", { children: [_jsx("b", { children: "M\u00E9decin:" }), " ", getDoctorLabel(appointment.doctor)] }), _jsxs("p", { children: [_jsx("b", { children: "Date:" }), " ", new Date(appointment.date).toLocaleString("fr-FR")] }), _jsxs("p", { children: [_jsx("b", { children: "Status:" }), " ", appointment.status] }), appointment.cancelReason && (_jsxs("p", { children: [_jsx("b", { children: "Raison:" }), " ", appointment.cancelReason] }))] }, appointment._id))) })] })), activeTab === "documents" && (_jsxs("div", { className: "tab-panel", children: [_jsxs("form", { onSubmit: submitRecord, className: "profile-card", children: [_jsxs("div", { className: "form-field", children: [_jsx("label", { children: "M\u00E9decin" }), _jsxs("select", { className: "form-input", value: selectedDoctorId, onChange: (event) => setSelectedDoctorId(event.target.value), children: [_jsx("option", { value: "", children: "Choisir un m\u00E9decin" }), appointments.map((appointment) => {
                                                const doctor = typeof appointment.doctor === "string" ? null : appointment.doctor;
                                                if (!doctor)
                                                    return null;
                                                return (_jsx("option", { value: doctor._id, children: doctor.name }, doctor._id));
                                            })] })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { children: "Fichier (PDF, PNG, JPG)" }), _jsx("input", { className: "form-input", type: "file", accept: ".pdf,image/*", onChange: (event) => { var _a, _b; return setRecordFile((_b = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : null); } })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { children: "Notes" }), _jsx("textarea", { className: "form-input", rows: 3, value: recordNotes, onChange: (event) => setRecordNotes(event.target.value) })] }), recordError && _jsx("p", { className: "form-error", children: recordError }), recordSuccess && _jsx("p", { className: "form-success", children: recordSuccess }), _jsx("button", { className: "button-primary", type: "submit", children: "Envoyer le document" })] }), _jsxs("div", { className: "card-grid", children: [recordLoading && _jsx("p", { children: "Chargement..." }), !recordLoading &&
                                records.map((record) => {
                                    var _a;
                                    return (_jsxs("div", { className: "info-card", children: [_jsxs("p", { children: [_jsx("b", { children: "Document:" }), " ", record.originalName] }), _jsxs("p", { children: [_jsx("b", { children: "M\u00E9decin:" }), " ", ((_a = record.doctor) === null || _a === void 0 ? void 0 : _a.name) || "Non renseigné"] }), _jsxs("div", { style: { display: "flex", gap: 12 }, children: [_jsx("button", { className: "button-link", type: "button", onClick: () => openRecord(record._id), children: "Ouvrir" }), _jsx("button", { className: "button-link", type: "button", onClick: () => removeRecord(record._id), children: "Supprimer" })] })] }, record._id));
                                })] }), recordPreviewUrl && (_jsxs("div", { className: "preview-panel", children: [_jsxs("div", { className: "preview-header", children: [_jsx("h4", { children: "Pr\u00E9visualisation du document" }), _jsx("button", { type: "button", onClick: () => setRecordPreviewUrl(null), children: "Fermer" })] }), _jsx("iframe", { title: "document", src: recordPreviewUrl, className: "preview-frame" })] })), recordPreviewError && _jsx("p", { className: "form-error", children: recordPreviewError })] })), activeTab === "profile" && (_jsxs("div", { className: "tab-panel", children: [_jsxs("form", { onSubmit: submitProfile, className: "profile-card", children: [_jsxs("div", { className: "form-field", children: [_jsx("label", { children: "Nom" }), _jsx("input", { className: "form-input", value: name, onChange: (event) => setName(event.target.value) })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { children: "Wilaya" }), _jsxs("select", { className: "form-input", value: city, onChange: (event) => setCity(event.target.value), children: [_jsx("option", { value: "", children: "Choisir une wilaya" }), wilayas.map((item) => (_jsx("option", { value: item, children: item }, item)))] })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { children: "Sexe" }), _jsxs("select", { className: "form-input", value: gender, onChange: (event) => setGender(event.target.value), children: [_jsx("option", { value: "", children: "Non sp\u00E9cifi\u00E9" }), _jsx("option", { value: "MALE", children: "Homme" }), _jsx("option", { value: "FEMALE", children: "Femme" })] })] }), profileError && _jsx("p", { className: "form-error", children: profileError }), _jsx("button", { className: "button-primary", type: "submit", disabled: savingProfile || !profileDirty, children: savingProfile ? "Sauvegarde..." : "Enregistrer" })] }), _jsxs("form", { onSubmit: submitPassword, className: "profile-card", children: [_jsxs("div", { className: "form-field", children: [_jsx("label", { children: "Mot de passe actuel" }), _jsx("input", { className: "form-input", type: "password", value: currentPassword, onChange: (event) => setCurrentPassword(event.target.value) })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { children: "Nouveau mot de passe" }), _jsx("input", { className: "form-input", type: "password", value: newPassword, onChange: (event) => setNewPassword(event.target.value) })] }), passwordError && _jsx("p", { className: "form-error", children: passwordError }), passwordMessage && _jsx("p", { className: "form-success", children: passwordMessage }), _jsx("button", { className: "button-primary", type: "submit", disabled: passwordLoading || !currentPassword || !newPassword, children: passwordLoading ? "Mise à jour..." : "Changer le mot de passe" })] })] }))] }));
}
