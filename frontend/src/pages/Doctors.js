import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { getDoctors } from "../api/doctor.api";
import { useAuth } from "../context/AuthContext";
import { specialties } from "../utils/specialties";
import { wilayas } from "../utils/wilayas";
export default function Doctors() {
    const [doctors, setDoctors] = useState([]);
    const { user } = useAuth();
    const [specialty, setSpecialty] = useState("");
    const [city, setCity] = useState("");
    if ((user === null || user === void 0 ? void 0 : user.role) === "DOCTOR") {
        return _jsx(Navigate, { to: "/doctor/dashboard", replace: true });
    }
    const hasFilters = useMemo(() => specialty || city, [specialty, city]);
    useEffect(() => {
        getDoctors({
            specialty: specialty || undefined,
            city: city || undefined,
        }).then((res) => setDoctors(res.data));
    }, [specialty, city]);
    return (_jsxs("div", { className: "doctors-page", children: [_jsxs("section", { className: "hero", children: [_jsxs("div", { children: [_jsx("p", { className: "hero__eyebrow", children: "Trouvez votre sp\u00E9cialiste" }), _jsx("h1", { children: "Rechercher un m\u00E9decin partout en Alg\u00E9rie" }), _jsx("p", { className: "hero__subtitle", children: "Filtrez par sp\u00E9cialit\u00E9 et localisation pour r\u00E9server rapidement." })] }), _jsxs("div", { className: "hero__stats", children: [_jsxs("div", { children: [_jsx("strong", { children: doctors.length }), _jsx("span", { children: "M\u00E9decins disponibles" })] }), _jsxs("div", { children: [_jsx("strong", { children: hasFilters ? "Filtrés" : "Tous" }), _jsx("span", { children: "R\u00E9sultats" })] })] })] }), _jsxs("section", { className: "filters-card", children: [_jsxs("div", { className: "form-field", children: [_jsx("label", { children: "Sp\u00E9cialit\u00E9" }), _jsxs("select", { className: "form-input", value: specialty, onChange: (event) => setSpecialty(event.target.value), children: [_jsx("option", { value: "", children: "Toutes les sp\u00E9cialit\u00E9s" }), specialties.map((item) => (_jsx("option", { value: item, children: item }, item)))] })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { children: "Wilaya" }), _jsxs("select", { className: "form-input", value: city, onChange: (event) => setCity(event.target.value), children: [_jsx("option", { value: "", children: "Toutes les wilayas" }), wilayas.map((item) => (_jsx("option", { value: item, children: item }, item)))] })] })] }), _jsx("section", { className: "card-grid", children: doctors.map((doc) => (_jsxs("div", { className: "doctor-card", children: [_jsxs("div", { children: [_jsx("h3", { children: doc.name }), _jsx("p", { className: "muted", children: doc.specialty || "Spécialité non renseignée" }), _jsx("p", { className: "muted", children: doc.city || "Ville non renseignée" }), doc.gender && (_jsx("p", { className: "muted", children: doc.gender === "MALE" ? "Homme" : "Femme" }))] }), _jsxs("div", { className: "doctor-card__footer", children: [_jsx("span", { className: "badge", children: doc.consultationFee !== undefined && doc.consultationFee !== null
                                        ? `${doc.consultationFee} DA`
                                        : "Tarif à confirmer" }), _jsx("a", { className: "button-link", href: `/doctors/${doc._id}`, children: "Voir profil" })] })] }, doc._id))) })] }));
}
