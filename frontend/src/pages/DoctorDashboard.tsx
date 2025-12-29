import { useEffect, useMemo, useState } from "react";
import Calendar from "../components/Calendar";
import { updateMe, updatePassword } from "../api/user.api";
import { getDoctorMedicalRecords } from "../api/medicalRecord.api";
import { useAuth } from "../context/AuthContext";
import { specialties } from "../utils/specialties";
import { wilayas } from "../utils/wilayas";
import type { MedicalRecord } from "../types/medicalRecord";

export default function DoctorDashboard() {
  const { token, user, refreshMe } = useAuth();
  const [activeTab, setActiveTab] = useState<"calendar" | "documents" | "profile">("calendar");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [recordLoading, setRecordLoading] = useState(false);
  const [recordError, setRecordError] = useState<string | null>(null);
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
            className={`tab-button ${activeTab === "documents" ? "is-active" : ""}`}
            onClick={() => setActiveTab("documents")}
          >
            Dossiers
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

      {activeTab === "documents" && (
        <div className="tab-panel">
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
                <a className="button-link" href={record.fileUrl} target="_blank" rel="noreferrer">
                  Ouvrir
                </a>
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
