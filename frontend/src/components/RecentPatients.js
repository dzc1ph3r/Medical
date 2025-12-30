import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function RecentPatients({ patients, selectedPatientId, onSelectPatient, }) {
    return (_jsxs("div", { style: {
            background: "#fff",
            borderRadius: 16,
            padding: 16,
            boxShadow: "0 8px 20px rgba(15, 23, 42, 0.08)",
            border: "1px solid #e2e8f0",
        }, children: [_jsxs("div", { style: { display: "flex", justifyContent: "space-between" }, children: [_jsx("h3", { style: { marginTop: 0 }, children: "Patients r\u00E9cents" }), onSelectPatient && (_jsx("button", { onClick: () => onSelectPatient(null), style: {
                            background: "transparent",
                            border: "none",
                            color: "#2563eb",
                            cursor: "pointer",
                            fontWeight: 600,
                        }, children: "Tous les patients" }))] }), patients.length === 0 && (_jsx("p", { style: { margin: 0, color: "#64748b" }, children: "Aucun patient r\u00E9cent pour le moment." })), _jsx("div", { style: { display: "grid", gap: 12 }, children: patients.map((patient) => {
                    const isSelected = selectedPatientId === patient._id;
                    return (_jsxs("div", { style: {
                            border: "1px solid #e2e8f0",
                            padding: 12,
                            borderRadius: 12,
                            background: isSelected ? "#eff6ff" : "#fff",
                            display: "grid",
                            gap: 6,
                        }, children: [_jsxs("div", { style: { display: "flex", justifyContent: "space-between" }, children: [_jsx("p", { style: { margin: 0, fontWeight: 600 }, children: patient.name }), patient.lastVisit && (_jsx("span", { style: { fontSize: 12, color: "#64748b" }, children: new Date(patient.lastVisit).toLocaleDateString("fr-FR") }))] }), patient.email && (_jsx("p", { style: { margin: 0, color: "#475569" }, children: patient.email })), onSelectPatient && (_jsx("button", { onClick: () => onSelectPatient(patient), style: {
                                    borderRadius: 999,
                                    border: "1px solid #2563eb",
                                    background: "#2563eb",
                                    color: "#fff",
                                    padding: "6px 12px",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    width: "fit-content",
                                }, children: "Acc\u00E9der aux dossiers" }))] }, patient._id));
                }) })] }));
}
