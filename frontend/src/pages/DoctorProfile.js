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
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDoctorById } from "../api/doctor.api";
import { createAppointment } from "../api/appointment.api";
import { useAuth } from "../context/AuthContext";
export default function DoctorProfile() {
    const { id } = useParams();
    const [doctor, setDoctor] = useState(null);
    const { token } = useAuth();
    const [dateTime, setDateTime] = useState("");
    const [bookingError, setBookingError] = useState(null);
    const [bookingSuccess, setBookingSuccess] = useState(null);
    const [bookingLoading, setBookingLoading] = useState(false);
    useEffect(() => {
        if (!id)
            return;
        getDoctorById(id).then(res => setDoctor(res.data));
    }, [id]);
    if (!doctor)
        return _jsx("p", { children: "Chargement..." });
    const submitAppointment = (event) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        event.preventDefault();
        setBookingError(null);
        setBookingSuccess(null);
        if (!token) {
            setBookingError("Veuillez vous connecter en tant que patient.");
            return;
        }
        if (!dateTime) {
            setBookingError("Veuillez choisir une date et une heure.");
            return;
        }
        setBookingLoading(true);
        try {
            yield createAppointment(token, {
                doctorId: doctor._id,
                date: new Date(dateTime).toISOString(),
            });
            setBookingSuccess("Votre demande de rendez-vous a été envoyée.");
            setDateTime("");
        }
        catch (err) {
            setBookingError(((_b = (_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || "Impossible de réserver ce rendez-vous.");
        }
        finally {
            setBookingLoading(false);
        }
    });
    return (_jsx("div", { className: "profile-page", children: _jsxs("div", { className: "profile-summary", children: [_jsxs("div", { children: [_jsx("h2", { children: doctor.name }), _jsx("p", { className: "muted", children: doctor.specialty || "Spécialité non renseignée" }), _jsx("p", { className: "muted", children: doctor.city || "Ville non renseignée" }), doctor.gender && (_jsx("p", { className: "muted", children: doctor.gender === "MALE" ? "Homme" : "Femme" }))] }), _jsxs("div", { className: "profile-meta", children: [_jsx("span", { className: "badge", children: doctor.consultationFee !== undefined && doctor.consultationFee !== null
                                ? `${doctor.consultationFee} DA`
                                : "Tarif à confirmer" }), _jsxs("form", { onSubmit: submitAppointment, className: "booking-form", children: [_jsx("label", { children: "Date et heure" }), _jsx("input", { className: "form-input", type: "datetime-local", value: dateTime, onChange: (event) => setDateTime(event.target.value) }), bookingError && _jsx("p", { className: "form-error", children: bookingError }), bookingSuccess && _jsx("p", { className: "form-success", children: bookingSuccess }), _jsx("button", { className: "button-primary", type: "submit", disabled: bookingLoading, children: bookingLoading ? "Envoi..." : "Prendre rendez-vous" })] })] })] }) }));
}
