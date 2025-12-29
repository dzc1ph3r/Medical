import { useEffect, useMemo, useState } from "react";
import { Calendar as BigCalendar, dateFnsLocalizer, View } from "react-big-calendar";
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
  const [view, setView] = useState<View>("week");
  const [date, setDate] = useState<Date>(new Date());
  const [year, setYear] = useState<number>(new Date().getFullYear());

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

  useEffect(() => {
    setYear(date.getFullYear());
  }, [date]);

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

  const yearOptions = useMemo(() => {
    const current = new Date().getFullYear();
    return Array.from({ length: 7 }, (_, idx) => current - 3 + idx);
  }, []);

  const yearAppointments = useMemo(
    () =>
      appointments.filter((appointment) => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate.getFullYear() === year;
      }),
    [appointments, year]
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

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 12 }}>
        <label htmlFor="calendar-year">Année</label>
        <select
          id="calendar-year"
          value={year}
          onChange={(event) => {
            const nextYear = Number(event.target.value);
            setYear(nextYear);
            setDate(new Date(nextYear, date.getMonth(), 1));
          }}
        >
          {yearOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <BigCalendar
        localizer={localizer}
        events={events}
        view={view}
        onView={(next) => setView(next)}
        date={date}
        onNavigate={(next) => setDate(next)}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600, marginTop: 12 }}
        onSelectEvent={(e: any) => setSelected(e.resource as Appointment)}
        views={["month", "week", "day", "agenda"]}
      />

      <div style={{ marginTop: 16 }}>
        <h3>Rendez-vous en {year}</h3>
        {yearAppointments.length === 0 && <p>Aucun rendez-vous cette année.</p>}
        {yearAppointments.length > 0 && (
          <div style={{ display: "grid", gap: 8 }}>
            {yearAppointments.map((appointment) => (
              <div key={appointment._id} style={{ border: "1px solid #e2e8f0", padding: 12 }}>
                <p>
                  <b>Date:</b> {new Date(appointment.date).toLocaleString("fr-FR")}
                </p>
                <p>
                  <b>Patient:</b>{" "}
                  {typeof appointment.patient === "string"
                    ? appointment.patient
                    : appointment.patient.name}
                </p>
                <p>
                  <b>Status:</b> {appointment.status}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

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
