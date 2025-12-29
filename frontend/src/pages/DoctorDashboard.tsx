import { useEffect, useMemo, useState } from "react";
import Calendar from "../components/Calendar";
import RecentPatients from "../components/RecentPatients";
import { useAuth } from "../context/AuthContext";
import { getMyDoctorAppointments } from "../api/appointment.api";
import { getDoctorMedicalRecords } from "../api/medicalRecord.api";
import type { Appointment } from "../types/appointment";
import type { MedicalRecord } from "../types/medicalRecord";
import type { RecentPatient } from "../components/RecentPatients";

const getPatientLabel = (patient: Appointment["patient"]) => {
  if (typeof patient === "string") return "Patient";
  return patient.name;
};

const getPatientId = (patient: Appointment["patient"]) =>
  typeof patient === "string" ? patient : patient._id;

export default function DoctorDashboard() {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<RecentPatient | null>(null);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [appointmentsRes, recordsRes] = await Promise.all([
        getMyDoctorAppointments(token),
        getDoctorMedicalRecords(token),
      ]);
      setAppointments(appointmentsRes.data);
      setRecords(recordsRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (!token) return <div>Connecte-toi en tant que médecin.</div>;

  const now = new Date();
  const upcomingAppointments = useMemo(
    () =>
      [...appointments]
        .filter((appointment) => new Date(appointment.date).getTime() >= now.getTime())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5),
    [appointments, now]
  );

  const recentPatients = useMemo(() => {
    const seen = new Set<string>();
    const sorted = [...appointments].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return sorted.reduce<RecentPatient[]>((acc, appointment) => {
      const patient = appointment.patient;
      const patientId = getPatientId(patient);
      if (seen.has(patientId)) return acc;
      seen.add(patientId);
      const patientInfo: RecentPatient =
        typeof patient === "string"
          ? { _id: patientId, name: "Patient", lastVisit: appointment.date }
          : { ...patient, lastVisit: appointment.date };
      acc.push(patientInfo);
      return acc;
    }, []);
  }, [appointments]);

  const filteredRecords = selectedPatient
    ? records.filter((record) =>
        typeof record.patient === "string"
          ? record.patient === selectedPatient._id
          : record.patient._id === selectedPatient._id
      )
    : records;

  const stats = [
    {
      title: "Rendez-vous à venir",
      value: appointments.filter(
        (appointment) => new Date(appointment.date).getTime() >= now.getTime()
      ).length,
      hint: "Créneaux confirmés ou en attente",
    },
    {
      title: "Patients suivis",
      value: recentPatients.length,
      hint: "Patients vus récemment",
    },
    {
      title: "Dossiers disponibles",
      value: records.length,
      hint: "Documents médicaux déposés",
    },
  ];

  return (
    <div style={{ padding: 24, background: "#f8fafc", minHeight: "100vh" }}>
      <header style={{ marginBottom: 24 }}>
        <h2 style={{ marginBottom: 6 }}>Tableau de bord médecin</h2>
        <p style={{ color: "#475569", marginTop: 0 }}>
          Gérez vos rendez-vous, vos patients récents et les dossiers médicaux.
        </p>
      </header>

      <section
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          marginBottom: 24,
        }}
      >
        {stats.map((card) => (
          <div
            key={card.title}
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 16,
              boxShadow: "0 8px 20px rgba(15, 23, 42, 0.08)",
              border: "1px solid #e2e8f0",
            }}
          >
            <p style={{ margin: 0, color: "#64748b", fontWeight: 600 }}>{card.title}</p>
            <p style={{ fontSize: 28, margin: "8px 0", fontWeight: 700 }}>{card.value}</p>
            <p style={{ margin: 0, color: "#94a3b8" }}>{card.hint}</p>
          </div>
        ))}
      </section>

      {loading && <p>Chargement...</p>}

      <section
        style={{
          display: "grid",
          gap: 20,
          gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)",
          alignItems: "start",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 16,
            boxShadow: "0 8px 20px rgba(15, 23, 42, 0.08)",
            border: "1px solid #e2e8f0",
          }}
        >
          <Calendar />
        </div>

        <div style={{ display: "grid", gap: 16 }}>
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 16,
              boxShadow: "0 8px 20px rgba(15, 23, 42, 0.08)",
              border: "1px solid #e2e8f0",
            }}
          >
            <h3 style={{ marginTop: 0 }}>Prochains rendez-vous</h3>
            {upcomingAppointments.length === 0 ? (
              <p style={{ margin: 0, color: "#64748b" }}>
                Aucun rendez-vous à venir.
              </p>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment._id}
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: 12,
                      padding: 12,
                      display: "grid",
                      gap: 4,
                    }}
                  >
                    <p style={{ margin: 0, fontWeight: 600 }}>
                      {getPatientLabel(appointment.patient)}
                    </p>
                    <p style={{ margin: 0, color: "#475569" }}>
                      {new Date(appointment.date).toLocaleString("fr-FR")}
                    </p>
                    <span
                      style={{
                        fontSize: 12,
                        color: "#2563eb",
                        fontWeight: 600,
                        textTransform: "capitalize",
                      }}
                    >
                      {appointment.status.toLowerCase()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <RecentPatients
            patients={recentPatients}
            selectedPatientId={selectedPatient?._id}
            onSelectPatient={setSelectedPatient}
          />
        </div>
      </section>

      <section
        id="medical-records"
        style={{
          marginTop: 32,
          background: "#fff",
          borderRadius: 16,
          padding: 16,
          boxShadow: "0 8px 20px rgba(15, 23, 42, 0.08)",
          border: "1px solid #e2e8f0",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <div>
            <h3 style={{ marginTop: 0 }}>Dossiers médicaux</h3>
            <p style={{ margin: 0, color: "#64748b" }}>
              {selectedPatient
                ? `Filtré sur ${selectedPatient.name}`
                : "Accédez rapidement aux documents déposés."}
            </p>
          </div>
          {selectedPatient && (
            <button
              onClick={() => setSelectedPatient(null)}
              style={{
                background: "transparent",
                border: "1px solid #cbd5f5",
                color: "#2563eb",
                padding: "6px 12px",
                borderRadius: 999,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Réinitialiser
            </button>
          )}
        </div>

        {filteredRecords.length === 0 ? (
          <p style={{ margin: 0, color: "#64748b" }}>
            Aucun dossier médical disponible.
          </p>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {filteredRecords.map((record) => {
              const patientName =
                typeof record.patient === "string" ? "Patient" : record.patient.name;
              const downloadUrl = record.file?.storedName
                ? `http://localhost:5000/uploads/medical-records/${record.file.storedName}`
                : "#";
              return (
                <div
                  key={record._id}
                  style={{
                    border: "1px solid #e2e8f0",
                    padding: 16,
                    borderRadius: 12,
                    display: "grid",
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <p style={{ margin: 0, fontWeight: 600 }}>{patientName}</p>
                      <p style={{ margin: 0, color: "#64748b" }}>
                        {new Date(record.createdAt).toLocaleString("fr-FR")}
                      </p>
                    </div>
                    <a
                      href={downloadUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        padding: "6px 14px",
                        borderRadius: 999,
                        background: "#2563eb",
                        color: "#fff",
                        textDecoration: "none",
                        fontWeight: 600,
                      }}
                    >
                      Télécharger
                    </a>
                  </div>
                  {record.diagnosis && (
                    <p style={{ margin: 0 }}>
                      <strong>Diagnostic:</strong> {record.diagnosis}
                    </p>
                  )}
                  {record.notes && (
                    <p style={{ margin: 0, color: "#475569" }}>{record.notes}</p>
                  )}
                  <p style={{ margin: 0, color: "#94a3b8" }}>
                    Fichier: {record.file?.originalName || "Document"}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
