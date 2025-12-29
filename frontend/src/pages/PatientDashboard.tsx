import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyAppointments } from "../api/appointment.api";
import type { Appointment, PersonRef } from "../types/appointment";
import UploadMedicalRecord from "../components/UploadMedicalRecord";

const getDoctorLabel = (doctor: Appointment["doctor"]) => {
  if (typeof doctor === "string") return doctor;
  const specialty = (doctor as PersonRef).specialty;
  return specialty ? `${doctor.name} (${specialty})` : doctor.name;
};

const statusConfig: Record<
  Appointment["status"],
  { label: string; color: string; background: string }
> = {
  PENDING: {
    label: "En attente",
    color: "#b45309",
    background: "rgba(251, 191, 36, 0.2)"
  },
  ACCEPTED: {
    label: "Confirmé",
    color: "#15803d",
    background: "rgba(34, 197, 94, 0.18)"
  },
  CANCELLED: {
    label: "Annulé",
    color: "#b91c1c",
    background: "rgba(248, 113, 113, 0.2)"
  }
};

export default function PatientDashboard() {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  const loadAppointments = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await getMyAppointments(token);
      setAppointments(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (!token) return <div>Connecte-toi en tant que patient.</div>;

  const now = new Date();
  const sortedAppointments = [...appointments].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const upcomingAppointments = sortedAppointments.filter(
    (appointment) => new Date(appointment.date).getTime() >= now.getTime()
  );
  const pastAppointments = sortedAppointments.filter(
    (appointment) => new Date(appointment.date).getTime() < now.getTime()
  );

  const acceptedCount = appointments.filter((item) => item.status === "ACCEPTED").length;
  const pendingCount = appointments.filter((item) => item.status === "PENDING").length;
  const cancelledCount = appointments.filter((item) => item.status === "CANCELLED").length;

  const doctorOptions = Array.from(
    new Map(
      appointments
        .filter((appointment) => typeof appointment.doctor !== "string")
        .map((appointment) => appointment.doctor as PersonRef)
        .map((doctor) => [doctor._id, doctor])
    ).values()
  ).map((doctor) => ({
    id: doctor._id,
    name: doctor.name,
    specialty: doctor.specialty
  }));

  return (
    <div style={{ padding: 24, background: "#f8fafc", minHeight: "100vh" }}>
      <header style={{ marginBottom: 24 }}>
        <h2 style={{ marginBottom: 6 }}>Tableau de bord patient</h2>
        <p style={{ color: "#475569", marginTop: 0 }}>
          Besoin d'un nouveau rendez-vous ? <Link to="/">Chercher un médecin</Link>.
        </p>
      </header>

      <section
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          marginBottom: 24
        }}
      >
        {[
          {
            title: "Rendez-vous à venir",
            value: upcomingAppointments.length,
            hint: "Prochains créneaux programmés"
          },
          {
            title: "Confirmés",
            value: acceptedCount,
            hint: "Rendez-vous validés par le médecin"
          },
          {
            title: "En attente",
            value: pendingCount,
            hint: "Demandes en attente de réponse"
          },
          {
            title: "Annulés",
            value: cancelledCount,
            hint: "Historique des annulations"
          }
        ].map((card) => (
          <div
            key={card.title}
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 16,
              boxShadow: "0 8px 20px rgba(15, 23, 42, 0.08)",
              border: "1px solid #e2e8f0"
            }}
          >
            <p style={{ margin: 0, color: "#64748b", fontWeight: 600 }}>
              {card.title}
            </p>
            <p style={{ fontSize: 28, margin: "8px 0", fontWeight: 700 }}>
              {card.value}
            </p>
            <p style={{ margin: 0, color: "#94a3b8" }}>{card.hint}</p>
          </div>
        ))}
      </section>

      <UploadMedicalRecord
        token={token}
        doctors={doctorOptions}
        onUploadSuccess={loadAppointments}
      />

      {loading && <p>Chargement...</p>}

      {!loading && appointments.length === 0 && (
        <p style={{ marginTop: 24 }}>Aucun rendez-vous pour le moment.</p>
      )}

      {appointments.length > 0 && (
        <section style={{ marginTop: 32 }}>
          <h3>Prochains rendez-vous</h3>
          <div style={{ display: "grid", gap: 12 }}>
            {upcomingAppointments.map((appointment) => {
              const statusStyle = statusConfig[appointment.status];
              return (
                <div
                  key={appointment._id}
                  style={{
                    border: "1px solid #e2e8f0",
                    padding: 16,
                    borderRadius: 12,
                    background: "#fff",
                    display: "grid",
                    gap: 8
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <p style={{ margin: 0, fontWeight: 600 }}>
                      {getDoctorLabel(appointment.doctor)}
                    </p>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 700,
                        color: statusStyle.color,
                        background: statusStyle.background
                      }}
                    >
                      {statusStyle.label}
                    </span>
                  </div>
                  <p style={{ margin: 0, color: "#475569" }}>
                    {new Date(appointment.date).toLocaleString("fr-FR")}
                  </p>
                  {appointment.cancelReason && (
                    <p style={{ margin: 0, color: "#b91c1c" }}>
                      Raison: {appointment.cancelReason}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {pastAppointments.length > 0 && (
        <section style={{ marginTop: 32 }}>
          <h3>Historique récent</h3>
          <div style={{ display: "grid", gap: 12 }}>
            {pastAppointments.slice(0, 5).map((appointment) => {
              const statusStyle = statusConfig[appointment.status];
              return (
                <div
                  key={appointment._id}
                  style={{
                    border: "1px solid #e2e8f0",
                    padding: 16,
                    borderRadius: 12,
                    background: "#fff",
                    display: "grid",
                    gap: 8
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <p style={{ margin: 0, fontWeight: 600 }}>
                      {getDoctorLabel(appointment.doctor)}
                    </p>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 700,
                        color: statusStyle.color,
                        background: statusStyle.background
                      }}
                    >
                      {statusStyle.label}
                    </span>
                  </div>
                  <p style={{ margin: 0, color: "#475569" }}>
                    {new Date(appointment.date).toLocaleString("fr-FR")}
                  </p>
                  {appointment.cancelReason && (
                    <p style={{ margin: 0, color: "#b91c1c" }}>
                      Raison: {appointment.cancelReason}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
