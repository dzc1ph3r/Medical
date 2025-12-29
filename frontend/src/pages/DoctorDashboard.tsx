import { useEffect, useMemo, useState } from "react";
import Calendar from "../components/Calendar";
import { updateMe, updatePassword } from "../api/user.api";
import {
  deleteMedicalRecord,
  getDoctorMedicalRecords,
  getMedicalRecordFile,
} from "../api/medicalRecord.api";
import {
  getMyDoctorAppointments,
  rescheduleAppointment,
  updateAppointmentStatus,
} from "../api/appointment.api";
import { useAuth } from "../context/AuthContext";
import { specialties } from "../utils/specialties";
import { wilayas } from "../utils/wilayas";
import type { MedicalRecord } from "../types/medicalRecord";
import type { Appointment } from "../types/appointment";

export default function DoctorDashboard() {
  const { token, user, refreshMe } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "calendar" | "appointments" | "documents" | "profile"
  >("calendar");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [recordLoading, setRecordLoading] = useState(false);
  const [recordError, setRecordError] = useState<string | null>(null);
  const [recordPreviewUrl, setRecordPreviewUrl] = useState<string | null>(null);
  const [recordPreviewError, setRecordPreviewError] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [appointmentLoading, setAppointmentLoading] = useState(false);
  const [appointmentError, setAppointmentError] = useState<string | null>(null);
  const [appointmentSuccess, setAppointmentSuccess] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [name, setName] = useState(user?.name ?? "");
  const [city, setCity] = useState(user?.city ?? "");
  const [specialty, setSpecialty] = useState(user?.specialty ?? "");
  const [gender, setGender] = useState(user?.gender ?? "");
  const [consultationFee, setConsultationFee] = useState(
    user?.consultationFee !== undefined ? String(user.consultationFee) : ""
  );

  const profileDirty = useMemo(
    () =>
      name !== (user?.name ?? "") ||
      city !== (user?.city ?? "") ||
      specialty !== (user?.specialty ?? "") ||
      consultationFee !==
        (user?.consultationFee !== undefined ? String(user.consultationFee) : ""),
    [name, city, specialty, consultationFee, gender, user]
  );

  useEffect(() => {
    setName(user?.name ?? "");
    setCity(user?.city ?? "");
    setSpecialty(user?.specialty ?? "");
    setConsultationFee(
      user?.consultationFee !== undefined ? String(user.consultationFee) : ""
    );
    setGender(user?.gender ?? "");
  }, [user]);

  const submitProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token) return;
    setSavingProfile(true);
    setProfileError(null);

    try {
      await updateMe(token, {
        name,
        city,
        specialty,
        consultationFee: consultationFee ? Number(consultationFee) : undefined,
        gender: gender || undefined,
      });
      await refreshMe();
    } catch (err: any) {
      setProfileError(err?.response?.data?.message || "Impossible de mettre à jour le profil");
    } finally {
      setSavingProfile(false);
    }
  };

  const loadRecords = async () => {
    if (!token) return;
    setRecordLoading(true);
    try {
      const res = await getDoctorMedicalRecords(token);
      setRecords(res.data);
    } catch (err: any) {
      setRecordError(err?.response?.data?.message || "Impossible de charger les documents");
    } finally {
      setRecordLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "documents") {
      loadRecords();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, token]);

  useEffect(() => {
    return () => {
      if (recordPreviewUrl) URL.revokeObjectURL(recordPreviewUrl);
    };
  }, [recordPreviewUrl]);

  const loadAppointments = async () => {
    if (!token) return;
    setAppointmentLoading(true);
    try {
      const res = await getMyDoctorAppointments(token);
      setAppointments(res.data);
    } catch (err: any) {
      setAppointmentError(err?.response?.data?.message || "Impossible de charger les rendez-vous");
    } finally {
      setAppointmentLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "appointments") {
      loadAppointments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, token]);

  const acceptAppointment = async (appointmentId: string) => {
    if (!token) return;
    setAppointmentSuccess(null);
    setAppointmentError(null);
    await updateAppointmentStatus(token, appointmentId, "ACCEPTED");
    setAppointmentSuccess("Rendez-vous accepté avec succès.");
    await loadAppointments();
  };

  const cancelAppointment = async (appointmentId: string) => {
    if (!token) return;
    setAppointmentSuccess(null);
    setAppointmentError(null);
    const reason = prompt("Raison de l'annulation ?") || "";
    await updateAppointmentStatus(token, appointmentId, "CANCELLED", reason);
    setAppointmentSuccess("Rendez-vous annulé avec succès.");
    await loadAppointments();
  };

  const reschedule = async (appointmentId: string) => {
    if (!token) return;
    setAppointmentSuccess(null);
    setAppointmentError(null);
    const iso = prompt("Nouvelle date ISO (ex: 2026-01-15T10:00:00.000Z) ?");
    if (!iso) return;
    await rescheduleAppointment(token, appointmentId, iso);
    setAppointmentSuccess("Rendez-vous reporté avec succès.");
    await loadAppointments();
  };

  const submitPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token) return;
    setPasswordLoading(true);
    setPasswordError(null);
    setPasswordMessage(null);

    try {
      await updatePassword(token, { currentPassword, newPassword });
      setPasswordMessage("Mot de passe mis à jour.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      setPasswordError(err?.response?.data?.message || "Impossible de changer le mot de passe");
    } finally {
      setPasswordLoading(false);
    }
  };

  const openRecord = async (recordId: string) => {
    if (!token) return;
    setRecordPreviewError(null);
    try {
      const blob = await getMedicalRecordFile(token, recordId);
      const url = URL.createObjectURL(blob);
      if (recordPreviewUrl) URL.revokeObjectURL(recordPreviewUrl);
      setRecordPreviewUrl(url);
    } catch (err: any) {
      setRecordPreviewError(
        err?.response?.data?.message || "Impossible d'ouvrir le document"
      );
    }
  };

  const removeRecord = async (recordId: string) => {
    if (!token) return;
    if (!confirm("Supprimer ce document ?")) return;
    try {
      await deleteMedicalRecord(token, recordId);
      await loadRecords();
    } catch (err: any) {
      setRecordError(err?.response?.data?.message || "Suppression impossible");
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div>
          <h2>Tableau de bord médecin</h2>
          <p>Suivez vos rendez-vous et mettez à jour votre profil.</p>
        </div>
        <div className="tabs">
          <button
            className={`tab-button ${activeTab === "calendar" ? "is-active" : ""}`}
            onClick={() => setActiveTab("calendar")}
          >
            Calendrier
          </button>
          <button
            className={`tab-button ${activeTab === "appointments" ? "is-active" : ""}`}
            onClick={() => setActiveTab("appointments")}
          >
            Rendez-vous
          </button>
          <button
            className={`tab-button ${activeTab === "documents" ? "is-active" : ""}`}
            onClick={() => setActiveTab("documents")}
          >
            Patients & dossiers
          </button>
          <button
            className={`tab-button ${activeTab === "profile" ? "is-active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Profil
          </button>
        </div>
      </div>

      {activeTab === "calendar" && (
        <div className="tab-panel">
          <Calendar />
        </div>
      )}

      {activeTab === "appointments" && (
        <div className="tab-panel">
          {appointmentLoading && <p>Chargement...</p>}
          {appointmentError && <p className="form-error">{appointmentError}</p>}
          {appointmentSuccess && <p className="form-success">{appointmentSuccess}</p>}
          <div className="card-grid">
            {appointments.map((appointment) => (
              <div key={appointment._id} className="info-card appointment-card">
                <p>
                  <b>Patient:</b>{" "}
                  {typeof appointment.patient === "string"
                    ? appointment.patient
                    : appointment.patient.name}
                </p>
                <p>
                  <b>Date:</b> {new Date(appointment.date).toLocaleString("fr-FR")}
                </p>
                <p>
                  <b>Status:</b> {appointment.status}
                </p>
                <div className="appointment-actions">
                  <button
                    className="action-button action-button--accept"
                    onClick={() => acceptAppointment(appointment._id)}
                    disabled={appointment.status === "ACCEPTED"}
                  >
                    <span className="action-icon" aria-hidden>
                      ✓
                    </span>
                    Accepter
                  </button>
                  <button
                    className="action-button action-button--reschedule"
                    onClick={() => reschedule(appointment._id)}
                  >
                    <span className="action-icon" aria-hidden>
                      ↻
                    </span>
                    Reporter
                  </button>
                  <button
                    className="action-button action-button--cancel"
                    onClick={() => cancelAppointment(appointment._id)}
                    disabled={appointment.status === "CANCELLED"}
                  >
                    <span className="action-icon" aria-hidden>
                      ✕
                    </span>
                    Annuler
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "documents" && (
        <div className="tab-panel">
          <h3>Patients et dossiers médicaux</h3>
          {recordLoading && <p>Chargement...</p>}
          {recordError && <p className="form-error">{recordError}</p>}
          <div className="card-grid">
            {records.map((record) => (
              <div key={record._id} className="info-card">
                <p>
                  <b>Patient:</b> {record.patient?.name || "Non renseigné"}
                </p>
                <p>
                  <b>Document:</b> {record.originalName}
                </p>
                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    className="button-link"
                    type="button"
                    onClick={() => openRecord(record._id)}
                  >
                    Ouvrir
                  </button>
                  <button
                    className="button-link"
                    type="button"
                    onClick={() => removeRecord(record._id)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>

          {recordPreviewUrl && (
            <div className="preview-panel">
              <div className="preview-header">
                <h4>Prévisualisation du document</h4>
                <button type="button" onClick={() => setRecordPreviewUrl(null)}>
                  Fermer
                </button>
              </div>
              <iframe title="document" src={recordPreviewUrl} className="preview-frame" />
            </div>
          )}
          {recordPreviewError && <p className="form-error">{recordPreviewError}</p>}
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
              <label>Spécialité</label>
              <select
                className="form-input"
                value={specialty}
                onChange={(event) => setSpecialty(event.target.value)}
              >
                <option value="">Choisir une spécialité</option>
                {specialties.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label>Tarif consultation (DA)</label>
              <input
                className="form-input"
                type="number"
                min="0"
                value={consultationFee}
                onChange={(event) => setConsultationFee(event.target.value)}
              />
            </div>

            <div className="form-field">
              <label>Ville</label>
              <select
                className="form-input"
                value={city}
                onChange={(event) => setCity(event.target.value)}
              >
                <option value="">Choisir une wilaya</option>
                {wilayas.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label>Sexe</label>
              <select
                className="form-input"
                value={gender}
                onChange={(event) => setGender(event.target.value)}
              >
                <option value="">Non spécifié</option>
                <option value="MALE">Homme</option>
                <option value="FEMALE">Femme</option>
              </select>
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

          <form onSubmit={submitPassword} className="profile-card">
            <div className="form-field">
              <label>Mot de passe actuel</label>
              <input
                className="form-input"
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
              />
            </div>

            <div className="form-field">
              <label>Nouveau mot de passe</label>
              <input
                className="form-input"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
              />
            </div>

            {passwordError && <p className="form-error">{passwordError}</p>}
            {passwordMessage && <p className="form-success">{passwordMessage}</p>}

            <button
              className="button-primary"
              type="submit"
              disabled={passwordLoading || !currentPassword || !newPassword}
            >
              {passwordLoading ? "Mise à jour..." : "Changer le mot de passe"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
