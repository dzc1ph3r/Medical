import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyAppointments } from "../api/appointment.api";
import { updateMe, updatePassword } from "../api/user.api";
import {
  deleteMedicalRecord,
  getMedicalRecordFile,
  getMyMedicalRecords,
  uploadMedicalRecord,
} from "../api/medicalRecord.api";
import { wilayas } from "../utils/wilayas";
import type { Appointment, PersonRef } from "../types/appointment";
import type { MedicalRecord } from "../types/medicalRecord";

const getDoctorLabel = (doctor: Appointment["doctor"]) => {
  if (typeof doctor === "string") return doctor;
  const specialty = (doctor as PersonRef).specialty;
  return specialty ? `${doctor.name} (${specialty})` : doctor.name;
};

export default function PatientDashboard() {
  const { token, user, refreshMe } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"appointments" | "documents" | "profile">(
    "appointments"
  );
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [name, setName] = useState(user?.name ?? "");
  const [city, setCity] = useState(user?.city ?? "");
  const [gender, setGender] = useState<"" | "MALE" | "FEMALE">(user?.gender ?? "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [recordLoading, setRecordLoading] = useState(false);
  const [recordError, setRecordError] = useState<string | null>(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [recordNotes, setRecordNotes] = useState("");
  const [recordFile, setRecordFile] = useState<File | null>(null);
  const [recordSuccess, setRecordSuccess] = useState<string | null>(null);
  const [recordPreviewUrl, setRecordPreviewUrl] = useState<string | null>(null);
  const [recordPreviewError, setRecordPreviewError] = useState<string | null>(null);

  const profileDirty = useMemo(
    () =>
      name !== (user?.name ?? "") ||
      city !== (user?.city ?? "") ||
      gender !== (user?.gender ?? ""),
    [name, city, gender, user]
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
    setGender(user?.gender ?? "");
  }, [user]);

  useEffect(() => {
    return () => {
      if (recordPreviewUrl) URL.revokeObjectURL(recordPreviewUrl);
    };
  }, [recordPreviewUrl]);

  const loadRecords = async () => {
    if (!token) return;
    setRecordLoading(true);
    try {
      const res = await getMyMedicalRecords(token);
      setRecords(res.data);
    } catch (err: any) {
      setRecordError(err?.response?.data?.message || "Impossible de charger vos documents");
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

  const submitProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token) return;
    setSavingProfile(true);
    setProfileError(null);

    try {
      await updateMe(token, { name, city, gender: gender ? gender : undefined });
      await refreshMe();
    } catch (err: any) {
      setProfileError(err?.response?.data?.message || "Impossible de mettre à jour le profil");
    } finally {
      setSavingProfile(false);
    }
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

  const submitRecord = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token) return;
    setRecordError(null);
    setRecordSuccess(null);

    if (!selectedDoctorId || !recordFile) {
      setRecordError("Veuillez choisir un médecin et un fichier.");
      return;
    }

    try {
      await uploadMedicalRecord(token, {
        doctorId: selectedDoctorId,
        notes: recordNotes || undefined,
        file: recordFile,
      });
      setRecordSuccess("Document envoyé au médecin.");
      setRecordFile(null);
      setRecordNotes("");
      await loadRecords();
    } catch (err: any) {
      setRecordError(err?.response?.data?.message || "Impossible d'envoyer le document");
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
            className={`tab-button ${activeTab === "documents" ? "is-active" : ""}`}
            onClick={() => setActiveTab("documents")}
          >
            Documents
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

      {activeTab === "documents" && (
        <div className="tab-panel">
          <form onSubmit={submitRecord} className="profile-card">
            <div className="form-field">
              <label>Médecin</label>
              <select
                className="form-input"
                value={selectedDoctorId}
                onChange={(event) => setSelectedDoctorId(event.target.value)}
              >
                <option value="">Choisir un médecin</option>
                {appointments.map((appointment) => {
                  const doctor =
                    typeof appointment.doctor === "string" ? null : appointment.doctor;
                  if (!doctor) return null;
                  return (
                    <option key={doctor._id} value={doctor._id}>
                      {doctor.name}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="form-field">
              <label>Fichier (PDF, PNG, JPG)</label>
              <input
                className="form-input"
                type="file"
                accept=".pdf,image/*"
                onChange={(event) => setRecordFile(event.target.files?.[0] ?? null)}
              />
            </div>

            <div className="form-field">
              <label>Notes</label>
              <textarea
                className="form-input"
                rows={3}
                value={recordNotes}
                onChange={(event) => setRecordNotes(event.target.value)}
              />
            </div>

            {recordError && <p className="form-error">{recordError}</p>}
            {recordSuccess && <p className="form-success">{recordSuccess}</p>}

            <button className="button-primary" type="submit">
              Envoyer le document
            </button>
          </form>

          <div className="card-grid">
            {recordLoading && <p>Chargement...</p>}
            {!recordLoading &&
              records.map((record) => (
                <div key={record._id} className="info-card">
                  <p>
                    <b>Document:</b> {record.originalName}
                  </p>
                  <p>
                    <b>Médecin:</b> {record.doctor?.name || "Non renseigné"}
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
              <label>Wilaya</label>
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
                onChange={(event) =>
                  setGender(event.target.value as "" | "MALE" | "FEMALE")
                }
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
