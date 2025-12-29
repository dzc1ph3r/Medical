import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { getDoctors } from "../api/doctor.api";
import { useAuth } from "../context/AuthContext";
import { specialties } from "../utils/specialties";
import { wilayas } from "../utils/wilayas";

export default function Doctors() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const { user } = useAuth();
  const [specialty, setSpecialty] = useState("");
  const [city, setCity] = useState("");

  if (user?.role === "DOCTOR") {
    return <Navigate to="/doctor/dashboard" replace />;
  }

  const hasFilters = useMemo(() => specialty || city, [specialty, city]);

  useEffect(() => {
    getDoctors({
      specialty: specialty || undefined,
      city: city || undefined,
    }).then((res) => setDoctors(res.data));
  }, [specialty, city]);

  return (
    <div className="doctors-page">
      <section className="hero">
        <div>
          <p className="hero__eyebrow">Trouvez votre spécialiste</p>
          <h1>Rechercher un médecin partout en Algérie</h1>
          <p className="hero__subtitle">
            Filtrez par spécialité et localisation pour réserver rapidement.
          </p>
        </div>
        <div className="hero__stats">
          <div>
            <strong>{doctors.length}</strong>
            <span>Médecins disponibles</span>
          </div>
          <div>
            <strong>{hasFilters ? "Filtrés" : "Tous"}</strong>
            <span>Résultats</span>
          </div>
        </div>
      </section>

      <section className="filters-card">
        <div className="form-field">
          <label>Spécialité</label>
          <select
            className="form-input"
            value={specialty}
            onChange={(event) => setSpecialty(event.target.value)}
          >
            <option value="">Toutes les spécialités</option>
            {specialties.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label>Wilaya</label>
          <select
            className="form-input"
            value={city}
            onChange={(event) => setCity(event.target.value)}
          >
            <option value="">Toutes les wilayas</option>
            {wilayas.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="card-grid">
        {doctors.map((doc) => (
          <div key={doc._id} className="doctor-card">
            <div>
              <h3>{doc.name}</h3>
              <p className="muted">{doc.specialty || "Spécialité non renseignée"}</p>
              <p className="muted">{doc.city || "Ville non renseignée"}</p>
              {doc.gender && (
                <p className="muted">
                  {doc.gender === "MALE" ? "Homme" : "Femme"}
                </p>
              )}
            </div>

            <div className="doctor-card__footer">
              <span className="badge">
                {doc.consultationFee !== undefined && doc.consultationFee !== null
                  ? `${doc.consultationFee} DA`
                  : "Tarif à confirmer"}
              </span>
              <a className="button-link" href={`/doctors/${doc._id}`}>
                Voir profil
              </a>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
