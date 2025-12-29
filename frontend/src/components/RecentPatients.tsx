import type { PersonRef } from "../types/appointment";

export type RecentPatient = PersonRef & { lastVisit?: string };

type RecentPatientsProps = {
  patients: RecentPatient[];
  selectedPatientId?: string | null;
  onSelectPatient?: (patient: RecentPatient | null) => void;
};

export default function RecentPatients({
  patients,
  selectedPatientId,
  onSelectPatient,
}: RecentPatientsProps) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        padding: 16,
        boxShadow: "0 8px 20px rgba(15, 23, 42, 0.08)",
        border: "1px solid #e2e8f0",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3 style={{ marginTop: 0 }}>Patients récents</h3>
        {onSelectPatient && (
          <button
            onClick={() => onSelectPatient(null)}
            style={{
              background: "transparent",
              border: "none",
              color: "#2563eb",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Tous les patients
          </button>
        )}
      </div>
      {patients.length === 0 && (
        <p style={{ margin: 0, color: "#64748b" }}>
          Aucun patient récent pour le moment.
        </p>
      )}
      <div style={{ display: "grid", gap: 12 }}>
        {patients.map((patient) => {
          const isSelected = selectedPatientId === patient._id;
          return (
            <div
              key={patient._id}
              style={{
                border: "1px solid #e2e8f0",
                padding: 12,
                borderRadius: 12,
                background: isSelected ? "#eff6ff" : "#fff",
                display: "grid",
                gap: 6,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p style={{ margin: 0, fontWeight: 600 }}>{patient.name}</p>
                {patient.lastVisit && (
                  <span style={{ fontSize: 12, color: "#64748b" }}>
                    {new Date(patient.lastVisit).toLocaleDateString("fr-FR")}
                  </span>
                )}
              </div>
              {patient.email && (
                <p style={{ margin: 0, color: "#475569" }}>{patient.email}</p>
              )}
              {onSelectPatient && (
                <button
                  onClick={() => onSelectPatient(patient)}
                  style={{
                    borderRadius: 999,
                    border: "1px solid #2563eb",
                    background: "#2563eb",
                    color: "#fff",
                    padding: "6px 12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    width: "fit-content",
                  }}
                >
                  Accéder aux dossiers
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
