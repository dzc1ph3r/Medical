import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDoctorById } from "../api/doctor.api";

export default function DoctorProfile() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    getDoctorById(id).then(res => setDoctor(res.data));
  }, [id]);

  if (!doctor) return <p>Chargement...</p>;

  return (
    <div className="profile-page">
      <div className="profile-summary">
        <div>
          <h2>{doctor.name}</h2>
          <p className="muted">{doctor.specialty || "Spécialité non renseignée"}</p>
          <p className="muted">{doctor.city || "Ville non renseignée"}</p>
        </div>

        <div className="profile-meta">
          <span className="badge">
            {doctor.consultationFee !== undefined && doctor.consultationFee !== null
              ? `${doctor.consultationFee} DA`
              : "Tarif à confirmer"}
          </span>
          <button className="button-primary">Prendre rendez-vous</button>
        </div>
      </div>
    </div>
  );
}
