import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDoctorById } from "../api/doctor.api";

export default function DoctorProfile() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState<any>(null);

  useEffect(() => {
    getDoctorById(id!)
      .then(res => setDoctor(res.data));
  }, []);

  if (!doctor) return <p>Chargement...</p>;

  return (
    <div>
      <h2>{doctor.name}</h2>
      <p>Spécialité : {doctor.specialty}</p>
      <p>Ville : {doctor.city}</p>
    </div>
  );
}
