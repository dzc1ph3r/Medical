import { useEffect, useMemo, useState } from "react";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { fr } from "date-fns/locale/fr";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { useAuth } from "../context/AuthContext";
import type { Appointment } from "../types/appointment";
import { getMyDoctorAppointments, updateAppointmentStatus, rescheduleAppointment } from "../api/appointment.api";

const locales = { fr };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

export default function Calendar() {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await getMyDoctorAppointments(token);
      setAppointments(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const events = useMemo(
    () =>
      appointments.map((a) => ({
        id: a._id,
        title: `${typeof a.patient === "string" ? "Patient" : a.patient.name} (${a.status})`,
        start: new Date(a.date),
        end: new Date(new Date(a.date).getTime() + 30 * 60000),
        resource: a,
      })),
    [appointments]
  );

  const accept = async () => {
    if (!token || !selected) return;
    await updateAppointmentStatus(token, selected._id, "ACCEPTED");
    setSelected(null);
    await load();
  };

  const cancel = async () => {
    if (!token || !selected) return;
    const reason = prompt("Raison de l'annulation ?") || "";
    await updateAppointmentStatus(token, selected._id, "CANCELLED", reason);
    setSelected(null);
    await load();
  };

  const resched = async () => {
    if (!token || !selected) return;
    const iso = prompt("Nouvelle date ISO (ex: 2026-01-15T10:00:00.000Z) ?");
    if (!iso) return;
    await rescheduleAppointment(token, selected._id, iso);
    setSelected(null);
    await load();
  };

  if (!token) return <div>Connecte-toi en tant que médecin.</div>;

  return (
    <div style={{ padding: 16 }}>
      <h2>Calendrier des rendez-vous</h2>
      {loading && <p>Chargement...</p>}

      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600, marginTop: 12 }}
        onSelectEvent={(e: any) => setSelected(e.resource as Appointment)}
      />

      {selected && (
        <div style={{ marginTop: 12, border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
          <h3>RDV sélectionné</h3>
          <p>
            <b>Patient:</b>{" "}
            {typeof selected.patient === "string" ? selected.patient : selected.patient.name}
            {typeof selected.patient === "string" || !selected.patient.email
              ? null
              : ` — ${selected.patient.email}`}
          </p>
          <p><b>Date:</b> {new Date(selected.date).toLocaleString("fr-FR")}</p>
          <p><b>Status:</b> {selected.status}</p>
          {selected.cancelReason && <p><b>Raison:</b> {selected.cancelReason}</p>}

          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button onClick={accept} disabled={selected.status === "ACCEPTED"}>Accepter</button>
            <button onClick={resched}>Reporter</button>
            <button onClick={cancel} disabled={selected.status === "CANCELLED"}>Annuler</button>
          </div>
        </div>
      )}
    </div>
  );
}
