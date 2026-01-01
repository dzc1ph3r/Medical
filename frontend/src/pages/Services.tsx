import { Calendar, Search, Shield, Bell, CheckCircle } from "../components/icons";
import { Link } from "react-router-dom";

export default function Services() {
    const services = [
        {
            icon: Search,
            title: "Annuaire Médical",
            description: "Accédez à une base de données complète de médecins vérifiés, classés par spécialité et localisation.",
            features: ["Recherche avancée", "Profils détaillés", "Avis vérifiés"]
        },
        {
            icon: Calendar,
            title: "Prise de RDV en ligne",
            description: "Fini les files d'attente. Réservez votre consultation en quelques clics, 24h/24 et 7j/7.",
            features: ["Disponibilités en temps réel", "Modification facile", "Historique complet"]
        },
        {
            icon: Shield,
            title: "Dossier Médical Numérique",
            description: "Centralisez tous vos documents de santé dans un espace sécurisé et accessible partout.",
            features: ["Stockage sécurisé", "Partage contrôlé", "Support multi-formats"]
        },
        {
            icon: Bell,
            title: "Rappels Intelligents",
            description: "Ne manquez plus jamais un rendez-vous grâce à notre système de notifications automatisées.",
            features: ["SMS & Email", "Rappels personnalisables", "Alertes de suivi"]
        }
    ];

    return (
        <div className="animate-fade-in space-y-16">
            <div className="text-center max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold text-slate-900 mb-6">Nos Services</h1>
                <p className="text-lg text-slate-600">
                    Une suite complète d'outils pour gérer votre santé et simplifier la relation patient-médecin.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {services.map((service, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                            <service.icon className="w-7 h-7 text-blue-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">{service.title}</h3>
                        <p className="text-slate-600 mb-6">{service.description}</p>
                        <ul className="space-y-3">
                            {service.features.map((feature, fIdx) => (
                                <li key={fIdx} className="flex items-center text-slate-700">
                                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-3xl p-12 text-center text-white">
                <h2 className="text-3xl font-bold mb-6">Prêt à essayer ?</h2>
                <p className="text-blue-100 mb-8 max-w-xl mx-auto">
                    Rejoignez la communauté MediConnect dès aujourd'hui et prenez le contrôle de votre parcours de santé.
                </p>
                <Link to="/register" className="inline-block bg-white text-blue-600 px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-slate-50 transition-colors">
                    Créer un compte gratuit
                </Link>
            </div>
        </div>
    );
}
