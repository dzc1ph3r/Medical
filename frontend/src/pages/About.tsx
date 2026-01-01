import { Shield, Users, Heart, Award } from "../components/icons";

export default function About() {
    const stats = [
        { label: "Années d'expérience", value: "10+" },
        { label: "Médecins partenaires", value: "500+" },
        { label: "Patients satisfaits", value: "10k+" },
        { label: "Couverture nationale", value: "48 W" }
    ];

    return (
        <div className="animate-fade-in space-y-20">
            {/* Hero Section */}
            <section className="text-center max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold text-slate-900 mb-6">
                    Notre mission : <span className="text-blue-600">Simplifier l'accès aux soins</span>
                </h1>
                <p className="text-lg text-slate-600 leading-relaxed">
                    MediConnect est né d'une volonté simple : rapprocher les patients des professionnels de santé en Algérie grâce à une technologie accessible, sécurisée et humaine.
                </p>
            </section>

            {/* Stats Section */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
                        <div className="text-slate-600 text-sm">{stat.label}</div>
                    </div>
                ))}
            </section>

            {/* Values Section */}
            <section className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-100">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                        <Shield className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Confiance & Sécurité</h3>
                    <p className="text-slate-600">
                        La protection de vos données médicales est notre priorité absolue. Nous utilisons les standards de cryptage les plus élevés.
                    </p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-100">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                        <Heart className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Humain avant tout</h3>
                    <p className="text-slate-600">
                        La technologie au service de l'humain. Notre support est disponible pour vous accompagner à chaque étape.
                    </p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-100">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                        <Award className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Excellence</h3>
                    <p className="text-slate-600">
                        Nous sélectionnons rigoureusement nos partenaires pour garantir des soins de qualité supérieure.
                    </p>
                </div>
            </section>

            {/* Team Section */}
            <section className="bg-slate-50 rounded-3xl p-12 text-center">
                <h2 className="text-3xl font-bold text-slate-900 mb-12">L'équipe fondatrice</h2>
                <div className="grid md:grid-cols-3 gap-8 justify-items-center">
                    {/* Placeholder for team members */}
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="group">
                            <div className="w-32 h-32 bg-slate-200 rounded-full mb-4 mx-auto overflow-hidden">
                                <Users className="w-full h-full p-6 text-slate-400" />
                            </div>
                            <h4 className="font-bold text-slate-900">Membre {i}</h4>
                            <p className="text-blue-600 text-sm">Cofondateur</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
