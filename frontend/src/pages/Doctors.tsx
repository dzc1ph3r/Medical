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
    getDoctors({})
      .then(res => setDoctors(res.data));
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    getDoctors({
      specialty: specialty.trim() || undefined,
      wilaya: wilaya || undefined,
    }).then(res => setDoctors(res.data));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="specialty">Spécialité</label>
          <input
            id="specialty"
            name="specialty"
            value={specialty}
            onChange={event => setSpecialty(event.target.value)}
            placeholder="Cardio, Dermatologie..."
          />
        </div>
        <div>
          <label htmlFor="wilaya">Wilaya</label>
          <select
            id="wilaya"
            name="wilaya"
            value={wilaya}
            onChange={event => setWilaya(event.target.value)}
          >
            <option value="">Toutes les wilayas</option>
            {WILAYAS.map(item => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Filtrer</button>
      </form>
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
