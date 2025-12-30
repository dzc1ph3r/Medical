import axios from "axios";
const API = "http://localhost:5000/api";
// N'exporte pas à nouveau le type Appointment ici car il est déjà importé depuis types/appointment.ts
// Exports des fonctions API
export const getMyDoctorAppointments = (token) => axios.get(`${API}/appointments/doctor/me`, {
    headers: { Authorization: `Bearer ${token}` },
});
export const getMyAppointments = (token) => axios.get(`${API}/appointments/me`, {
    headers: { Authorization: `Bearer ${token}` },
});
export const createAppointment = (token, payload) => axios.post(`${API}/appointments`, payload, {
    headers: { Authorization: `Bearer ${token}` },
});
export const updateAppointmentStatus = (token, id, status, cancelReason) => axios.patch(`${API}/appointments/${id}/status`, { status, cancelReason }, { headers: { Authorization: `Bearer ${token}` } });
export const rescheduleAppointment = (token, id, date) => axios.patch(`${API}/appointments/${id}/reschedule`, { date }, { headers: { Authorization: `Bearer ${token}` } });
