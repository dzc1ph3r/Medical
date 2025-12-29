import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyAppointments } from "../api/appointment.api";
import type { Appointment, PersonRef } from "../types/appointment";

const getDoctorLabel = (doctor: Appointment["doctor"]) => {
  if (typeof doctor === "string") return doctor;
  const specialty = (doctor as PersonRef).specialty;
  return specialty ? `${doctor.name} (${specialty})` : doctor.name;
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

  return (
    <div style={{ padding: 16 }}>
      <h2>Mes rendez-vous</h2>
      <p>
        Besoin d'un nouveau rendez-vous ? <Link to="/">Chercher un médecin</Link>.
      </p>

      {loading && <p>Chargement...</p>}

      {!loading && appointments.length === 0 && (
        <p>Aucun rendez-vous pour le moment.</p>
      )}

      <div style={{ display: "grid", gap: 12 }}>
        {appointments.map((appointment) => (
          <div
            key={appointment._id}
            style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}
          >
            <p>
              <b>Médecin:</b> {getDoctorLabel(appointment.doctor)}
            </p>
            <p>
              <b>Date:</b> {new Date(appointment.date).toLocaleString("fr-FR")}
            </p>
            <p>
              <b>Status:</b> {appointment.status}
            </p>
            {appointment.cancelReason && (
              <p>
                <b>Raison:</b> {appointment.cancelReason}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
