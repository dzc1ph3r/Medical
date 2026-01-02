import { useEffect, useMemo, useState } from "react";
import { createDoctor, getUsers, updateUser } from "../api/admin.api";
import { useAuth } from "../context/AuthContext";
import { specialties } from "../utils/specialties";
import { wilayas } from "../utils/wilayas";

type TabKey = "doctors" | "users";

export default function AdminDashboard() {
  const { token, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabKey>("doctors");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [city, setCity] = useState("");
  const [consultationFee, setConsultationFee] = useState("");
  const [gender, setGender] = useState<"" | "MALE" | "FEMALE">("");

  const loadUsers = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getUsers(token);
      setUsers(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Impossible de charger les utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "users") {
      loadUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, token]);

  const submitDoctor = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token) return;
    setError(null);
    setSuccess(null);

    try {
      await createDoctor(token, {
        name,
        email,
        password,
        specialty,
        city: city || undefined,
        consultationFee: consultationFee ? Number(consultationFee) : undefined,
        gender: gender || undefined,
      });
      setSuccess("Médecin créé avec succès.");
      setName("");
      setEmail("");
      setPassword("");
      setSpecialty("");
      setCity("");
      setConsultationFee("");
      setGender("");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Impossible de créer le médecin");
    }
  };

  const updateUserField = async (id: string, payload: any) => {
    if (!token) return;
    setError(null);
    setSuccess(null);
    try {
      await updateUser(token, id, payload);
      setSuccess("Profil utilisateur mis à jour.");
      await loadUsers();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Mise à jour échouée");
    }
  };

  const groupedUsers = useMemo(() => {
    const doctors = users.filter((u) => u.role === "DOCTOR");
    const patients = users.filter((u) => u.role === "PATIENT");
    const admins = users.filter((u) => u.role === "ADMIN");
    return { doctors, patients, admins };
  }, [users]);

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2>Administration</h2>
            <p>Gérez les comptes médecins, patients et administrateurs.</p>
          </div>
          <button onClick={() => logout?.()} className="button-link" style={{ color: "var(--danger-color, #ef4444)" }}>
            Se déconnecter
          </button>
        </div>
        <div className="tabs">
          <button
            className={`tab-button ${activeTab === "doctors" ? "is-active" : ""}`}
            onClick={() => setActiveTab("doctors")}
          >
            Créer médecin
          </button>
          <button
            className={`tab-button ${activeTab === "users" ? "is-active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            Gérer utilisateurs
          </button>
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}
      {success && <p className="form-success">{success}</p>}

      {activeTab === "doctors" && (
        <form onSubmit={submitDoctor} className="profile-card">
          <div className="form-field">
            <label>Nom</label>
            <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="form-field">
            <label>Email</label>
            <input
              className="form-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>Mot de passe</label>
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>Spécialité</label>
            <select
              className="form-input"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
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
            <label>Wilaya</label>
            <select className="form-input" value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="">Choisir une wilaya</option>
              {wilayas.map((item) => (
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
              onChange={(e) => setConsultationFee(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>Sexe</label>
            <select
              className="form-input"
              value={gender}
              onChange={(e) => setGender(e.target.value as "" | "MALE" | "FEMALE")}
            >
              <option value="">Non spécifié</option>
              <option value="MALE">Homme</option>
              <option value="FEMALE">Femme</option>
            </select>
          </div>

          <button className="button-primary" type="submit">
            Créer le médecin
          </button>
        </form>
      )}

      {activeTab === "users" && (
        <div className="tab-panel">
          {loading && <p>Chargement...</p>}
          {!loading && (
            <>
              {(["admins", "doctors", "patients"] as const).map((group) => (
                <div key={group} className="info-card">
                  <h3 style={{ margin: 0, textTransform: "capitalize" }}>{group}</h3>
                  <div className="card-grid" style={{ marginTop: 12 }}>
                    {groupedUsers[group].map((user) => (
                      <div key={user._id} className="info-card">
                        <p>
                          <b>{user.name}</b> — {user.email}
                        </p>
                        <div className="form-field">
                          <label>Rôle</label>
                          <select
                            className="form-input"
                            value={user.role}
                            onChange={(e) =>
                              updateUserField(user._id, { role: e.target.value })
                            }
                          >
                            <option value="PATIENT">Patient</option>
                            <option value="DOCTOR">Médecin</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                        </div>

                        {user.role === "DOCTOR" && (
                          <>
                            <div className="form-field">
                              <label>Spécialité</label>
                              <select
                                className="form-input"
                                value={user.specialty || ""}
                                onChange={(e) =>
                                  updateUserField(user._id, { specialty: e.target.value })
                                }
                              >
                                <option value="">Choisir</option>
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
                                value={user.consultationFee ?? ""}
                                onChange={(e) =>
                                  updateUserField(user._id, {
                                    consultationFee: e.target.value
                                      ? Number(e.target.value)
                                      : undefined,
                                  })
                                }
                              />
                            </div>
                          </>
                        )}

                        <div className="form-field">
                          <label>Wilaya</label>
                          <select
                            className="form-input"
                            value={user.city || ""}
                            onChange={(e) => updateUserField(user._id, { city: e.target.value })}
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
                            value={user.gender || ""}
                            onChange={(e) =>
                              updateUserField(user._id, { gender: e.target.value || undefined })
                            }
                          >
                            <option value="">Non spécifié</option>
                            <option value="MALE">Homme</option>
                            <option value="FEMALE">Femme</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
