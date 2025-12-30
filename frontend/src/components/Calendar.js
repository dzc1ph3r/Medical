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
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { fr } from "date-fns/locale/fr";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useAuth } from "../context/AuthContext";
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
    const [appointments, setAppointments] = useState([]);
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState("week");
    const [date, setDate] = useState(new Date());
    const [year, setYear] = useState(new Date().getFullYear());
    const load = () => __awaiter(this, void 0, void 0, function* () {
        if (!token)
            return;
        setLoading(true);
        try {
            const res = yield getMyDoctorAppointments(token);
            setAppointments(res.data);
        }
        finally {
            setLoading(false);
        }
    });
    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);
    useEffect(() => {
        setYear(date.getFullYear());
    }, [date]);
    const events = useMemo(() => appointments.map((a) => ({
        id: a._id,
        title: `${typeof a.patient === "string" ? "Patient" : a.patient.name} (${a.status})`,
        start: new Date(a.date),
        end: new Date(new Date(a.date).getTime() + 30 * 60000),
        resource: a,
    })), [appointments]);
    const yearOptions = useMemo(() => {
        const current = new Date().getFullYear();
        return Array.from({ length: 7 }, (_, idx) => current - 3 + idx);
    }, []);
    const yearAppointments = useMemo(() => appointments.filter((appointment) => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate.getFullYear() === year;
    }), [appointments, year]);
    const accept = () => __awaiter(this, void 0, void 0, function* () {
        if (!token || !selected)
            return;
        yield updateAppointmentStatus(token, selected._id, "ACCEPTED");
        setSelected(null);
        yield load();
    });
    const cancel = () => __awaiter(this, void 0, void 0, function* () {
        if (!token || !selected)
            return;
        const reason = prompt("Raison de l'annulation ?") || "";
        yield updateAppointmentStatus(token, selected._id, "CANCELLED", reason);
        setSelected(null);
        yield load();
    });
    const resched = () => __awaiter(this, void 0, void 0, function* () {
        if (!token || !selected)
            return;
        const iso = prompt("Nouvelle date ISO (ex: 2026-01-15T10:00:00.000Z) ?");
        if (!iso)
            return;
        yield rescheduleAppointment(token, selected._id, iso);
        setSelected(null);
        yield load();
    });
    if (!token)
        return _jsx("div", { children: "Connecte-toi en tant que m\u00E9decin." });
    return (_jsxs("div", { style: { padding: 16 }, children: [_jsx("h2", { children: "Calendrier des rendez-vous" }), loading && _jsx("p", { children: "Chargement..." }), _jsxs("div", { style: { display: "flex", gap: 12, alignItems: "center", marginTop: 12 }, children: [_jsx("label", { htmlFor: "calendar-year", children: "Ann\u00E9e" }), _jsx("select", { id: "calendar-year", value: year, onChange: (event) => {
                            const nextYear = Number(event.target.value);
                            setYear(nextYear);
                            setDate(new Date(nextYear, date.getMonth(), 1));
                        }, children: yearOptions.map((option) => (_jsx("option", { value: option, children: option }, option))) })] }), _jsx(BigCalendar, { localizer: localizer, events: events, view: view, onView: (next) => setView(next), date: date, onNavigate: (next) => setDate(next), startAccessor: "start", endAccessor: "end", style: { height: 600, marginTop: 12 }, onSelectEvent: (e) => setSelected(e.resource), views: ["month", "week", "day", "agenda"] }), _jsxs("div", { style: { marginTop: 16 }, children: [_jsxs("h3", { children: ["Rendez-vous en ", year] }), yearAppointments.length === 0 && _jsx("p", { children: "Aucun rendez-vous cette ann\u00E9e." }), yearAppointments.length > 0 && (_jsx("div", { style: { display: "grid", gap: 8 }, children: yearAppointments.map((appointment) => (_jsxs("div", { style: { border: "1px solid #e2e8f0", padding: 12 }, children: [_jsxs("p", { children: [_jsx("b", { children: "Date:" }), " ", new Date(appointment.date).toLocaleString("fr-FR")] }), _jsxs("p", { children: [_jsx("b", { children: "Patient:" }), " ", typeof appointment.patient === "string"
                                            ? appointment.patient
                                            : appointment.patient.name] }), _jsxs("p", { children: [_jsx("b", { children: "Status:" }), " ", appointment.status] })] }, appointment._id))) }))] }), selected && (_jsxs("div", { style: { marginTop: 12, border: "1px solid #ddd", padding: 12, borderRadius: 8 }, children: [_jsx("h3", { children: "RDV s\u00E9lectionn\u00E9" }), _jsxs("p", { children: [_jsx("b", { children: "Patient:" }), " ", typeof selected.patient === "string" ? selected.patient : selected.patient.name, typeof selected.patient === "string" || !selected.patient.email
                                ? null
                                : ` — ${selected.patient.email}`] }), _jsxs("p", { children: [_jsx("b", { children: "Date:" }), " ", new Date(selected.date).toLocaleString("fr-FR")] }), _jsxs("p", { children: [_jsx("b", { children: "Status:" }), " ", selected.status] }), selected.cancelReason && _jsxs("p", { children: [_jsx("b", { children: "Raison:" }), " ", selected.cancelReason] }), _jsxs("div", { style: { display: "flex", gap: 8, marginTop: 8 }, children: [_jsx("button", { onClick: accept, disabled: selected.status === "ACCEPTED", children: "Accepter" }), _jsx("button", { onClick: resched, children: "Reporter" }), _jsx("button", { onClick: cancel, disabled: selected.status === "CANCELLED", children: "Annuler" })] })] }))] }));
}
