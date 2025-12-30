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
import Calendar from "../components/Calendar";
import { updateMe, updatePassword } from "../api/user.api";
import { deleteMedicalRecord, getDoctorMedicalRecords, getMedicalRecordFile, } from "../api/medicalRecord.api";
import { getMyDoctorAppointments, rescheduleAppointment, updateAppointmentStatus, } from "../api/appointment.api";
import { useAuth } from "../context/AuthContext";
import { specialties } from "../utils/specialties";
import { wilayas } from "../utils/wilayas";
export default function DoctorDashboard() {
    var _a, _b, _c, _d;
    const { token, user, refreshMe } = useAuth();
    const [activeTab, setActiveTab] = useState("calendar");
    const [savingProfile, setSavingProfile] = useState(false);
    const [profileError, setProfileError] = useState(null);
    const [records, setRecords] = useState([]);
    const [recordLoading, setRecordLoading] = useState(false);
    const [recordError, setRecordError] = useState(null);
    const [recordPreviewUrl, setRecordPreviewUrl] = useState(null);
    const [recordPreviewError, setRecordPreviewError] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [appointmentLoading, setAppointmentLoading] = useState(false);
    const [appointmentError, setAppointmentError] = useState(null);
    const [appointmentSuccess, setAppointmentSuccess] = useState(null);
    const [rescheduleTarget, setRescheduleTarget] = useState(null);
    const [rescheduleDate, setRescheduleDate] = useState("");
    const [rescheduleError, setRescheduleError] = useState(null);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [passwordMessage, setPasswordMessage] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [name, setName] = useState((_a = user === null || user === void 0 ? void 0 : user.name) !== null && _a !== void 0 ? _a : "");
    const [city, setCity] = useState((_b = user === null || user === void 0 ? void 0 : user.city) !== null && _b !== void 0 ? _b : "");
    const [specialty, setSpecialty] = useState((_c = user === null || user === void 0 ? void 0 : user.specialty) !== null && _c !== void 0 ? _c : "");
    const [gender, setGender] = useState((_d = user === null || user === void 0 ? void 0 : user.gender) !== null && _d !== void 0 ? _d : "");
    const [consultationFee, setConsultationFee] = useState((user === null || user === void 0 ? void 0 : user.consultationFee) !== undefined ? String(user.consultationFee) : "");
    const profileDirty = useMemo(() => {
        var _a, _b, _c;
        return name !== ((_a = user === null || user === void 0 ? void 0 : user.name) !== null && _a !== void 0 ? _a : "") ||
            city !== ((_b = user === null || user === void 0 ? void 0 : user.city) !== null && _b !== void 0 ? _b : "") ||
            specialty !== ((_c = user === null || user === void 0 ? void 0 : user.specialty) !== null && _c !== void 0 ? _c : "") ||
            consultationFee !==
                ((user === null || user === void 0 ? void 0 : user.consultationFee) !== undefined ? String(user.consultationFee) : "");
    }, [name, city, specialty, consultationFee, gender, user]);
    useEffect(() => {
        var _a, _b, _c, _d;
        setName((_a = user === null || user === void 0 ? void 0 : user.name) !== null && _a !== void 0 ? _a : "");
        setCity((_b = user === null || user === void 0 ? void 0 : user.city) !== null && _b !== void 0 ? _b : "");
        setSpecialty((_c = user === null || user === void 0 ? void 0 : user.specialty) !== null && _c !== void 0 ? _c : "");
        setConsultationFee((user === null || user === void 0 ? void 0 : user.consultationFee) !== undefined ? String(user.consultationFee) : "");
        setGender((_d = user === null || user === void 0 ? void 0 : user.gender) !== null && _d !== void 0 ? _d : "");
    }, [user]);
    const submitProfile = (event) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        event.preventDefault();
        if (!token)
            return;
        setSavingProfile(true);
        setProfileError(null);
        try {
            yield updateMe(token, {
                name,
                city,
                specialty,
                consultationFee: consultationFee ? Number(consultationFee) : undefined,
                gender: gender || undefined,
            });
            yield refreshMe();
        }
        catch (err) {
            setProfileError(((_b = (_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || "Impossible de mettre à jour le profil");
        }
        finally {
            setSavingProfile(false);
        }
    });
    const loadRecords = () => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        if (!token)
            return;
        setRecordLoading(true);
        try {
            const res = yield getDoctorMedicalRecords(token);
            setRecords(res.data);
        }
        catch (err) {
            setRecordError(((_b = (_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || "Impossible de charger les documents");
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
    useEffect(() => {
        return () => {
            if (recordPreviewUrl)
                URL.revokeObjectURL(recordPreviewUrl);
        };
    }, [recordPreviewUrl]);
    const loadAppointments = () => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        if (!token)
            return;
        setAppointmentLoading(true);
        try {
            const res = yield getMyDoctorAppointments(token);
            setAppointments(res.data);
        }
        catch (err) {
            setAppointmentError(((_b = (_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || "Impossible de charger les rendez-vous");
        }
        finally {
            setAppointmentLoading(false);
        }
    });
    useEffect(() => {
        if (activeTab === "appointments") {
            loadAppointments();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, token]);
    const acceptAppointment = (appointmentId) => __awaiter(this, void 0, void 0, function* () {
        if (!token)
            return;
        setAppointmentSuccess(null);
        setAppointmentError(null);
        yield updateAppointmentStatus(token, appointmentId, "ACCEPTED");
        setAppointmentSuccess("Rendez-vous accepté avec succès.");
        yield loadAppointments();
    });
    const cancelAppointment = (appointmentId) => __awaiter(this, void 0, void 0, function* () {
        if (!token)
            return;
        setAppointmentSuccess(null);
        setAppointmentError(null);
        const reason = prompt("Raison de l'annulation ?") || "";
        yield updateAppointmentStatus(token, appointmentId, "CANCELLED", reason);
        setAppointmentSuccess("Rendez-vous annulé avec succès.");
        yield loadAppointments();
    });
    const reschedule = (appointmentId) => __awaiter(this, void 0, void 0, function* () {
        if (!token)
            return;
        setAppointmentSuccess(null);
        setAppointmentError(null);
        setRescheduleError(null);
        if (!rescheduleDate) {
            setRescheduleError("Veuillez choisir une nouvelle date.");
            return;
        }
        yield rescheduleAppointment(token, appointmentId, new Date(rescheduleDate).toISOString());
        setAppointmentSuccess("Rendez-vous reporté avec succès.");
        setRescheduleTarget(null);
        setRescheduleDate("");
        yield loadAppointments();
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
    return (_jsxs("div", { className: "dashboard", children: [_jsxs("div", { className: "dashboard__header", children: [_jsxs("div", { children: [_jsx("h2", { children: "Tableau de bord m\u00E9decin" }), _jsx("p", { children: "Suivez vos rendez-vous et mettez \u00E0 jour votre profil." })] }), _jsxs("div", { className: "tabs", children: [_jsx("button", { className: `tab-button ${activeTab === "calendar" ? "is-active" : ""}`, onClick: () => setActiveTab("calendar"), children: "Calendrier" }), _jsx("button", { className: `tab-button ${activeTab === "appointments" ? "is-active" : ""}`, onClick: () => setActiveTab("appointments"), children: "Rendez-vous" }), _jsx("button", { className: `tab-button ${activeTab === "documents" ? "is-active" : ""}`, onClick: () => setActiveTab("documents"), children: "Patients & dossiers" }), _jsx("button", { className: `tab-button ${activeTab === "profile" ? "is-active" : ""}`, onClick: () => setActiveTab("profile"), children: "Profil" })] })] }), activeTab === "calendar" && (_jsx("div", { className: "tab-panel", children: _jsx(Calendar, {}) })), activeTab === "appointments" && (_jsxs("div", { className: "tab-panel", children: [appointmentLoading && _jsx("p", { children: "Chargement..." }), appointmentError && _jsx("p", { className: "form-error", children: appointmentError }), appointmentSuccess && _jsx("p", { className: "form-success", children: appointmentSuccess }), _jsx("div", { className: "card-grid", children: appointments.map((appointment) => (_jsxs("div", { className: "info-card appointment-card", children: [_jsxs("p", { children: [_jsx("b", { children: "Patient:" }), " ", typeof appointment.patient === "string"
                                            ? appointment.patient
                                            : appointment.patient.name] }), _jsxs("p", { children: [_jsx("b", { children: "Date:" }), " ", new Date(appointment.date).toLocaleString("fr-FR")] }), _jsxs("p", { children: [_jsx("b", { children: "Status:" }), " ", appointment.status] }), _jsxs("div", { className: "appointment-actions", children: [_jsxs("button", { className: "action-button action-button--accept", onClick: () => acceptAppointment(appointment._id), disabled: appointment.status !== "PENDING", children: [_jsx("span", { className: "action-icon", "aria-hidden": true, children: "\u2713" }), "Accepter"] }), _jsxs("button", { className: "action-button action-button--reschedule", onClick: () => {
                                                setRescheduleTarget(appointment);
                                                setRescheduleDate("");
                                                setRescheduleError(null);
                                            }, disabled: appointment.status !== "PENDING", children: [_jsx("span", { className: "action-icon", "aria-hidden": true, children: "\u21BB" }), "Reporter"] }), _jsxs("button", { className: "action-button action-button--cancel", onClick: () => cancelAppointment(appointment._id), disabled: appointment.status !== "PENDING", children: [_jsx("span", { className: "action-icon", "aria-hidden": true, children: "\u2715" }), "Annuler"] })] })] }, appointment._id))) })] })), rescheduleTarget && (_jsx("div", { className: "modal-backdrop", role: "dialog", "aria-modal": "true", children: _jsxs("div", { className: "modal-card", children: [_jsx("h3", { children: "Reporter le rendez-vous" }), _jsxs("p", { className: "muted", children: ["Patient:", " ", typeof rescheduleTarget.patient === "string"
                                    ? rescheduleTarget.patient
                                    : rescheduleTarget.patient.name] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { children: "Nouvelle date" }), _jsx("input", { className: "form-input", type: "datetime-local", value: rescheduleDate, onChange: (event) => setRescheduleDate(event.target.value) })] }), rescheduleError && _jsx("p", { className: "form-error", children: rescheduleError }), _jsxs("div", { className: "modal-actions", children: [_jsx("button", { className: "action-button action-button--reschedule", onClick: () => reschedule(rescheduleTarget._id), children: "Confirmer" }), _jsx("button", { className: "action-button", onClick: () => {
                                        setRescheduleTarget(null);
                                        setRescheduleDate("");
                                        setRescheduleError(null);
                                    }, children: "Annuler" })] })] }) })), activeTab === "documents" && (_jsxs("div", { className: "tab-panel", children: [_jsx("h3", { children: "Patients et dossiers m\u00E9dicaux" }), recordLoading && _jsx("p", { children: "Chargement..." }), recordError && _jsx("p", { className: "form-error", children: recordError }), _jsx("div", { className: "card-grid", children: records.map((record) => {
                            var _a;
                            return (_jsxs("div", { className: "info-card", children: [_jsxs("p", { children: [_jsx("b", { children: "Patient:" }), " ", ((_a = record.patient) === null || _a === void 0 ? void 0 : _a.name) || "Non renseigné"] }), _jsxs("p", { children: [_jsx("b", { children: "Document:" }), " ", record.originalName] }), _jsxs("div", { style: { display: "flex", gap: 12 }, children: [_jsx("button", { className: "button-link", type: "button", onClick: () => openRecord(record._id), children: "Ouvrir" }), _jsx("button", { className: "button-link", type: "button", onClick: () => removeRecord(record._id), children: "Supprimer" })] })] }, record._id));
                        }) }), recordPreviewUrl && (_jsxs("div", { className: "preview-panel", children: [_jsxs("div", { className: "preview-header", children: [_jsx("h4", { children: "Pr\u00E9visualisation du document" }), _jsx("button", { type: "button", onClick: () => setRecordPreviewUrl(null), children: "Fermer" })] }), _jsx("iframe", { title: "document", src: recordPreviewUrl, className: "preview-frame" })] })), recordPreviewError && _jsx("p", { className: "form-error", children: recordPreviewError })] })), activeTab === "profile" && (_jsxs("div", { className: "tab-panel", children: [_jsxs("form", { onSubmit: submitProfile, className: "profile-card", children: [_jsxs("div", { className: "form-field", children: [_jsx("label", { children: "Nom" }), _jsx("input", { className: "form-input", value: name, onChange: (event) => setName(event.target.value) })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { children: "Sp\u00E9cialit\u00E9" }), _jsxs("select", { className: "form-input", value: specialty, onChange: (event) => setSpecialty(event.target.value), children: [_jsx("option", { value: "", children: "Choisir une sp\u00E9cialit\u00E9" }), specialties.map((item) => (_jsx("option", { value: item, children: item }, item)))] })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { children: "Tarif consultation (DA)" }), _jsx("input", { className: "form-input", type: "number", min: "0", value: consultationFee, onChange: (event) => setConsultationFee(event.target.value) })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { children: "Ville" }), _jsxs("select", { className: "form-input", value: city, onChange: (event) => setCity(event.target.value), children: [_jsx("option", { value: "", children: "Choisir une wilaya" }), wilayas.map((item) => (_jsx("option", { value: item, children: item }, item)))] })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { children: "Sexe" }), _jsxs("select", { className: "form-input", value: gender, onChange: (event) => setGender(event.target.value), children: [_jsx("option", { value: "", children: "Non sp\u00E9cifi\u00E9" }), _jsx("option", { value: "MALE", children: "Homme" }), _jsx("option", { value: "FEMALE", children: "Femme" })] })] }), profileError && _jsx("p", { className: "form-error", children: profileError }), _jsx("button", { className: "button-primary", type: "submit", disabled: savingProfile || !profileDirty, children: savingProfile ? "Sauvegarde..." : "Enregistrer" })] }), _jsxs("form", { onSubmit: submitPassword, className: "profile-card", children: [_jsxs("div", { className: "form-field", children: [_jsx("label", { children: "Mot de passe actuel" }), _jsx("input", { className: "form-input", type: "password", value: currentPassword, onChange: (event) => setCurrentPassword(event.target.value) })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { children: "Nouveau mot de passe" }), _jsx("input", { className: "form-input", type: "password", value: newPassword, onChange: (event) => setNewPassword(event.target.value) })] }), passwordError && _jsx("p", { className: "form-error", children: passwordError }), passwordMessage && _jsx("p", { className: "form-success", children: passwordMessage }), _jsx("button", { className: "button-primary", type: "submit", disabled: passwordLoading || !currentPassword || !newPassword, children: passwordLoading ? "Mise à jour..." : "Changer le mot de passe" })] })] }))] }));
}
