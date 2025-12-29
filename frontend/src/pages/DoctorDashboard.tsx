import { useEffect, useMemo, useState } from "react";
import Calendar from "../components/Calendar";
import { updateMe } from "../api/user.api";
import { useAuth } from "../context/AuthContext";

export default function DoctorDashboard() {
  const { token, user, refreshMe } = useAuth();
  const [activeTab, setActiveTab] = useState<"calendar" | "profile">("calendar");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [name, setName] = useState(user?.name ?? "");
  const [city, setCity] = useState(user?.city ?? "");
  const [specialty, setSpecialty] = useState(user?.specialty ?? "");

  const profileDirty = useMemo(
    () =>
      name !== (user?.name ?? "") ||
      city !== (user?.city ?? "") ||
      specialty !== (user?.specialty ?? ""),
    [name, city, specialty, user]
  );

  useEffect(() => {
    setName(user?.name ?? "");
    setCity(user?.city ?? "");
    setSpecialty(user?.specialty ?? "");
  }, [user]);

  const submitProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token) return;
    setSavingProfile(true);
    setProfileError(null);

    try {
      await updateMe(token, { name, city, specialty });
      await refreshMe();
    } catch (err: any) {
      setProfileError(err?.response?.data?.message || "Impossible de mettre à jour le profil");
    } finally {
      setSavingProfile(false);
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
              <input
                className="form-input"
                value={specialty}
                onChange={(event) => setSpecialty(event.target.value)}
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
