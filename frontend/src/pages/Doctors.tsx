import { useEffect, useState } from "react";
import { getDoctors } from "../api/doctor.api";

export default function Doctors() {
  const [doctors, setDoctors] = useState<any[]>([]);

  useEffect(() => {
    getDoctors({ specialty: "Cardio", city: "Paris" })
      .then(res => setDoctors(res.data));
  }, []);

  return (
    <div>
      {doctors.map(doc => (
        <div key={doc._id}>
          <h3>{doc.name}</h3>
          <p>{doc.specialty} - {doc.city}</p>
          <a href={`/doctors/${doc._id}`}>Afficher plus</a>
        </div>
      ))}
    </div>
  );
}
