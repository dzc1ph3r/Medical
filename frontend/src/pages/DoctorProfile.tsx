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
    <div>
      <h2>{doctor.name}</h2>
      <p>Spécialité : {doctor.specialty}</p>
      <p>Ville : {doctor.city}</p>
    </div>
  );
}
