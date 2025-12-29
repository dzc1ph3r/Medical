import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getDoctors } from "../api/doctor.api";
import { useAuth } from "../context/AuthContext";

export default function Doctors() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const { user } = useAuth();

  if (user?.role === "DOCTOR") {
    return <Navigate to="/doctor/dashboard" replace />;
  }

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
