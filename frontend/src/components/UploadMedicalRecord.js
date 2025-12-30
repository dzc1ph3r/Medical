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
import { useMemo, useState } from "react";
const buildDoctorLabel = (doctor) => doctor.specialty ? `${doctor.name} (${doctor.specialty})` : doctor.name;
export default function UploadMedicalRecord({ token, doctors, onUploadSuccess }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [doctorId, setDoctorId] = useState("");
    const [notes, setNotes] = useState("");
    const [status, setStatus] = useState("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const doctorOptions = useMemo(() => doctors, [doctors]);
    const resetStatus = () => {
        setStatus("idle");
        setErrorMessage("");
    };
    const handleFile = (file) => {
        setSelectedFile(file);
        resetStatus();
    };
    const handleDrop = (event) => {
        var _a;
        event.preventDefault();
        setDragActive(false);
        const file = (_a = event.dataTransfer.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file)
            handleFile(file);
    };
    const handleSubmit = () => __awaiter(this, void 0, void 0, function* () {
        if (!selectedFile || !doctorId) {
            setStatus("error");
            setErrorMessage("Ajoutez un fichier et sélectionnez un médecin.");
            return;
        }
        try {
            setStatus("uploading");
            const formData = new FormData();
            formData.append("file", selectedFile);
            formData.append("doctorId", doctorId);
            if (notes)
                formData.append("notes", notes);
            const response = yield fetch("http://localhost:5000/api/medical-records", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });
            if (!response.ok) {
                throw new Error("Upload failed");
            }
            setStatus("success");
            setSelectedFile(null);
            setNotes("");
            onUploadSuccess === null || onUploadSuccess === void 0 ? void 0 : onUploadSuccess();
        }
        catch (error) {
            setStatus("error");
            setErrorMessage("Impossible d'envoyer le dossier. Réessaie.");
        }
    });
    return (_jsxs("section", { style: {
            border: "1px solid #e5e7eb",
            borderRadius: 16,
            padding: 20,
            background: "#fff",
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)"
        }, children: [_jsx("h3", { style: { marginTop: 0 }, children: "Envoyer un dossier m\u00E9dical" }), _jsx("p", { style: { color: "#475569", marginTop: 4 }, children: "Glisse-d\u00E9pose un document ou s\u00E9lectionne un fichier pour le partager avec ton m\u00E9decin." }), _jsxs("div", { onDragOver: (event) => {
                    event.preventDefault();
                    setDragActive(true);
                }, onDragLeave: () => setDragActive(false), onDrop: handleDrop, style: {
                    border: `2px dashed ${dragActive ? "#3b82f6" : "#cbd5f5"}`,
                    borderRadius: 12,
                    padding: "24px 16px",
                    textAlign: "center",
                    background: dragActive ? "rgba(59, 130, 246, 0.08)" : "#f8fafc"
                }, children: [_jsx("input", { id: "medical-upload", type: "file", onChange: (event) => {
                            var _a;
                            const file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
                            if (file)
                                handleFile(file);
                        }, style: { display: "none" } }), _jsxs("label", { htmlFor: "medical-upload", style: { cursor: "pointer" }, children: [_jsx("strong", { style: { color: "#1d4ed8" }, children: "Clique pour choisir" }), " ou d\u00E9pose le fichier ici"] }), selectedFile && (_jsx("p", { style: { marginTop: 12, color: "#0f172a" }, children: selectedFile.name }))] }), _jsxs("div", { style: {
                    display: "grid",
                    gap: 12,
                    marginTop: 16,
                    gridTemplateColumns: "minmax(180px, 1fr) 2fr"
                }, children: [_jsxs("label", { style: { display: "flex", flexDirection: "column", gap: 6 }, children: [_jsx("span", { style: { fontWeight: 600 }, children: "M\u00E9decin cible" }), _jsxs("select", { value: doctorId, onChange: (event) => {
                                    setDoctorId(event.target.value);
                                    resetStatus();
                                }, style: {
                                    padding: "10px 12px",
                                    borderRadius: 8,
                                    border: "1px solid #cbd5f5"
                                }, children: [_jsx("option", { value: "", children: "S\u00E9lectionne un m\u00E9decin" }), doctorOptions.map((doctor) => (_jsx("option", { value: doctor.id, children: buildDoctorLabel(doctor) }, doctor.id)))] })] }), _jsxs("label", { style: { display: "flex", flexDirection: "column", gap: 6 }, children: [_jsx("span", { style: { fontWeight: 600 }, children: "Notes (optionnel)" }), _jsx("textarea", { value: notes, onChange: (event) => {
                                    setNotes(event.target.value);
                                    resetStatus();
                                }, rows: 3, placeholder: "R\u00E9sum\u00E9 ou contexte du document", style: {
                                    padding: "10px 12px",
                                    borderRadius: 8,
                                    border: "1px solid #cbd5f5",
                                    resize: "vertical"
                                } })] })] }), status === "error" && (_jsx("p", { style: { color: "#b91c1c", marginTop: 12 }, children: errorMessage })), status === "success" && (_jsx("p", { style: { color: "#15803d", marginTop: 12 }, children: "Dossier envoy\u00E9 avec succ\u00E8s." })), _jsx("button", { type: "button", onClick: handleSubmit, disabled: status === "uploading", style: {
                    marginTop: 16,
                    padding: "12px 18px",
                    borderRadius: 10,
                    border: "none",
                    background: status === "uploading" ? "#94a3b8" : "#2563eb",
                    color: "#fff",
                    fontWeight: 600,
                    cursor: status === "uploading" ? "not-allowed" : "pointer"
                }, children: status === "uploading" ? "Envoi en cours..." : "Envoyer le dossier" })] }));
}
