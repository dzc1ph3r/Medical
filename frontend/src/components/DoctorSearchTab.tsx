import { useEffect, useState } from "react";
import { getDoctors } from "../api/doctor.api";
import { createAppointment } from "../api/appointment.api";
import { useAuth } from "../context/AuthContext";
import { specialties } from "../utils/specialties";
import { wilayas } from "../utils/wilayas";

export default function DoctorSearchTab() {
    const [doctors, setDoctors] = useState<any[]>([]);
    const { token } = useAuth();
    const [specialty, setSpecialty] = useState("");
    const [city, setCity] = useState("");
    const [loading, setLoading] = useState(false);

    // Booking state
    const [bookingDoctor, setBookingDoctor] = useState<any>(null);
    const [dateTime, setDateTime] = useState("");
    const [bookingError, setBookingError] = useState<string | null>(null);
    const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
    const [bookingLoading, setBookingLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getDoctors({
            specialty: specialty || undefined,
            city: city || undefined,
        })
            .then((res) => setDoctors(res.data))
            .finally(() => setLoading(false));
    }, [specialty, city]);

    const handleBookingClick = (doctor: any) => {
        setBookingDoctor(doctor);
        setBookingError(null);
        setBookingSuccess(null);
        setDateTime("");
    };

    const submitAppointment = async (event: React.FormEvent) => {
        event.preventDefault();
        setBookingError(null);
        setBookingSuccess(null);

        if (!token) {
            setBookingError("Veuillez vous connecter.");
            return;
        }

        if (!dateTime) {
            setBookingError("Veuillez choisir une date et une heure.");
            return;
        }

        setBookingLoading(true);
        try {
            await createAppointment(token, {
                doctorId: bookingDoctor._id,
                date: new Date(dateTime).toISOString(),
            });
            setBookingSuccess("Votre demande de rendez-vous a été envoyée !");
            setDateTime("");
            // Optionally Close modal after delay
            setTimeout(() => setBookingDoctor(null), 2000);
        } catch (err: any) {
            setBookingError(
                err?.response?.data?.message || "Impossible de réserver ce rendez-vous."
            );
        } finally {
            setBookingLoading(false);
        }
    };

    return (
        <div className="doctor-search-tab">
            <div className="filters-card" style={{ marginBottom: '2rem' }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-field">
                        <label className="text-sm font-medium text-slate-700">Spécialité</label>
                        <select
                            className="form-input"
                            value={specialty}
                            onChange={(e) => setSpecialty(e.target.value)}
                        >
                            <option value="">Toutes les spécialités</option>
                            {specialties.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-field">
                        <label className="text-sm font-medium text-slate-700">Wilaya</label>
                        <select
                            className="form-input"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        >
                            <option value="">Toutes les wilayas</option>
                            {wilayas.map((w) => (
                                <option key={w} value={w}>{w}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10">Chargement des médecins...</div>
            ) : (
                <div className="card-grid">
                    {doctors.length === 0 ? (
                        <p className="col-span-full text-center py-10 muted">Aucun médecin trouvé pour ces critères.</p>
                    ) : (
                        doctors.map((doc) => (
                            <div key={doc._id} className="info-card doctor-card">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900">{doc.name}</h3>
                                        <p className="text-blue-600 font-medium">{doc.specialty || "Généraliste"}</p>
                                        <p className="text-sm text-slate-500">{doc.city}</p>
                                    </div>
                                    <span className="badge bg-blue-50 text-blue-700">
                                        {doc.consultationFee ? `${doc.consultationFee} DA` : "À consulter"}
                                    </span>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                                    <button
                                        className="button-primary text-sm px-4 py-2"
                                        onClick={() => handleBookingClick(doc)}
                                    >
                                        Prendre RDV
                                    </button>
                                    <a href={`/doctors/${doc._id}`} className="text-sm text-slate-500 hover:text-blue-600">
                                        Profil complet
                                    </a>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Simplified Booking Modal */}
            {bookingDoctor && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-scale-in">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900">Prendre rendez-vous</h3>
                            <button
                                onClick={() => setBookingDoctor(null)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                ✕
                            </button>
                        </div>

                        <p className="mb-4 text-slate-600">
                            Avec le <strong>Dr. {bookingDoctor.name}</strong> ({bookingDoctor.specialty})
                        </p>

                        <form onSubmit={submitAppointment} className="space-y-4">
                            <div className="form-field">
                                <label className="text-sm font-medium text-slate-700">Date et heure souhaitées</label>
                                <input
                                    className="form-input"
                                    type="datetime-local"
                                    value={dateTime}
                                    onChange={(e) => setDateTime(e.target.value)}
                                    required
                                />
                            </div>

                            {bookingError && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{bookingError}</p>}
                            {bookingSuccess && <p className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">{bookingSuccess}</p>}

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setBookingDoctor(null)}
                                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={bookingLoading}
                                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:opacity-50 transition-all"
                                >
                                    {bookingLoading ? "Envoi..." : "Confirmer"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
