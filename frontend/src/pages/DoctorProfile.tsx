import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDoctorById } from "../api/doctor.api";
import { createAppointment } from "../api/appointment.api";
import { useAuth } from "../context/AuthContext";

export default function DoctorProfile() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState<any>(null);
  const { token } = useAuth();
  const [dateTime, setDateTime] = useState("");
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    getDoctorById(id).then(res => setDoctor(res.data));
  }, [id]);

  if (!doctor) return <p>Chargement...</p>;

  const submitAppointment = async (event: React.FormEvent) => {
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
      await createAppointment(token, {
        doctorId: doctor._id,
        date: new Date(dateTime).toISOString(),
      });
      setBookingSuccess("Votre demande de rendez-vous a été envoyée.");
      setDateTime("");
    } catch (err: any) {
      setBookingError(err?.response?.data?.message || "Impossible de réserver ce rendez-vous.");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-summary">
        <div>
          <h2>{doctor.name}</h2>
          <p className="muted">{doctor.specialty || "Spécialité non renseignée"}</p>
          <p className="muted">{doctor.city || "Ville non renseignée"}</p>
          {doctor.gender && (
            <p className="muted">{doctor.gender === "MALE" ? "Homme" : "Femme"}</p>
          )}
        </div>

        <div className="profile-meta">
          <span className="badge">
            {doctor.consultationFee !== undefined && doctor.consultationFee !== null
              ? `${doctor.consultationFee} DA`
              : "Tarif à confirmer"}
          </span>
          {!token ? (
            <p className="muted">Connectez-vous pour prendre un rendez-vous.</p>
          ) : (
            <form onSubmit={submitAppointment} className="booking-form">
              <label>Date et heure</label>
              <input
                className="form-input"
                type="datetime-local"
                value={dateTime}
                onChange={(event) => setDateTime(event.target.value)}
              />
              {bookingError && <p className="form-error">{bookingError}</p>}
              {bookingSuccess && <p className="form-success">{bookingSuccess}</p>}
              <button className="button-primary" type="submit" disabled={bookingLoading}>
                {bookingLoading ? "Envoi..." : "Prendre rendez-vous"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
