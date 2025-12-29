import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyAppointments } from "../api/appointment.api";
import { updateMe } from "../api/user.api";
import type { Appointment, PersonRef } from "../types/appointment";

const getDoctorLabel = (doctor: Appointment["doctor"]) => {
  if (typeof doctor === "string") return doctor;
  const specialty = (doctor as PersonRef).specialty;
  return specialty ? `${doctor.name} (${specialty})` : doctor.name;
};

export default function PatientDashboard() {
  const { token, user, refreshMe } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"appointments" | "profile">("appointments");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [name, setName] = useState(user?.name ?? "");
  const [city, setCity] = useState(user?.city ?? "");

  const profileDirty = useMemo(
    () => name !== (user?.name ?? "") || city !== (user?.city ?? ""),
    [name, city, user]
  );

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

  useEffect(() => {
    setName(user?.name ?? "");
    setCity(user?.city ?? "");
  }, [user]);

  const submitProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token) return;
    setSavingProfile(true);
    setProfileError(null);

    try {
      await updateMe(token, { name, city });
      await refreshMe();
    } catch (err: any) {
      setProfileError(err?.response?.data?.message || "Impossible de mettre à jour le profil");
    } finally {
      setSavingProfile(false);
    }
  };

  if (!token) return <div>Connecte-toi en tant que patient.</div>;

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div>
          <h2>Tableau de bord patient</h2>
          <p>Gère tes rendez-vous et ton profil personnel.</p>
        </div>
        <div className="tabs">
          <button
            className={`tab-button ${activeTab === "appointments" ? "is-active" : ""}`}
            onClick={() => setActiveTab("appointments")}
          >
            Rendez-vous
          </button>
          <button
            className={`tab-button ${activeTab === "profile" ? "is-active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Profil
          </button>
        </div>
      </div>

      {activeTab === "appointments" && (
        <div className="tab-panel">
          <p className="muted">
            Besoin d'un nouveau rendez-vous ?{" "}
            <Link to="/">Chercher un médecin</Link>.
          </p>

          {loading && <p>Chargement...</p>}

          {!loading && appointments.length === 0 && (
            <p>Aucun rendez-vous pour le moment.</p>
          )}

          <div className="card-grid">
            {appointments.map((appointment) => (
              <div key={appointment._id} className="info-card">
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
      )}

      {activeTab === "profile" && (
        <div className="tab-panel">
          <form onSubmit={submitProfile} className="profile-card">
            <div className="form-field">
              <label>Nom</label>
              <input
                className="form-input"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>

            <div className="form-field">
              <label>Ville</label>
              <input
                className="form-input"
                value={city}
                onChange={(event) => setCity(event.target.value)}
              />
            </div>

            {profileError && <p className="form-error">{profileError}</p>}

            <button
              className="button-primary"
              type="submit"
              disabled={savingProfile || !profileDirty}
            >
              {savingProfile ? "Sauvegarde..." : "Enregistrer"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
