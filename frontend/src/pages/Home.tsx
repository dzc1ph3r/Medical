import { Link } from "react-router-dom";
import {
  Search,
  Calendar,
  Shield,
  Upload,
  Bell,
  MapPin,
  Clock,
  Stethoscope,
  Users,
  FileText,
  ArrowRight,
  Star,
  CheckCircle
} from "../components/icons";

export default function Home() {
  const features = [
    {
      icon: Search,
      title: "Recherche intelligente",
      description: "Filtrez par spécialité, wilaya et tarifs pour trouver le bon médecin.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Calendar,
      title: "Suivi des rendez-vous",
      description: "Les médecins peuvent accepter, reporter ou annuler avec notifications.",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: Shield,
      title: "Dossiers médicaux sécurisés",
      description: "Téléversez vos analyses et gardez un historique accessible à votre médecin.",
      color: "from-purple-500 to-violet-500"
    },
    {
      icon: Bell,
      title: "Notifications instantanées",
      description: "Recevez des rappels et confirmations en temps réel.",
      color: "from-amber-500 to-orange-500"
    },
    {
      icon: Upload,
      title: "Partage de documents",
      description: "Partagez facilement vos résultats d'analyse avec vos médecins.",
      color: "from-rose-500 to-pink-500"
    },
    {
      icon: MapPin,
      title: "Médécins locaux",
      description: "Trouvez des professionnels de santé près de chez vous en Algérie.",
      color: "from-indigo-500 to-blue-500"
    }
  ];

  const stats = [
    { value: "500+", label: "Médecins qualifiés", icon: Users },
    { value: "10k+", label: "Patients satisfaits", icon: Users },
    { value: "48", label: "Wilayas couvertes", icon: MapPin },
    { value: "24/7", label: "Support disponible", icon: Clock }
  ];

  const benefits = [
    "Prise de rendez-vous en ligne",
    "Notifications instantanées",
    "Partage de documents médicaux",
    "Calendrier personnel",
    "Historique des consultations",
    "Avis et évaluations"
  ];

  return (
    <div className="home animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-white to-emerald-50 border border-slate-200/50 shadow-xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        </div>
        
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div>
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-emerald-100 border border-blue-200 mb-6">
                  <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                    Plateforme médicale en Algérie
                  </span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                  Prenez rendez-vous avec les{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                    meilleurs médecins
                  </span>
                  , en toute simplicité.
                </h1>
                
                <p className="text-lg text-slate-600 mb-8 max-w-2xl">
                  Recherchez par spécialité et wilaya, partagez vos documents médicaux et
                  suivez vos rendez-vous en temps réel.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-10">
                  <Link 
                    to="/doctors" 
                    className="group inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-emerald-500 rounded-xl hover:from-blue-700 hover:to-emerald-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Trouver un médecin
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                  
                  <Link 
                    to="/register" 
                    className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-slate-700 bg-white border-2 border-slate-300 rounded-xl hover:border-blue-500 hover:text-blue-600 shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <Users className="w-5 h-5 mr-2" />
                    Créer un compte gratuit
                  </Link>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-white shadow-sm border border-slate-200 flex items-center justify-center">
                        <stat.icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-slate-900">{stat.value}</div>
                        <div className="text-sm text-slate-600">{stat.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Right Content - Feature Card */}
              <div className="relative">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-xl p-8 transform lg:translate-y-4">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center mr-4">
                      <Stethoscope className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Ce que vous pouvez faire</h3>
                      <p className="text-slate-600 text-sm">Découvrez toutes nos fonctionnalités</p>
                    </div>
                  </div>
                  
                  <ul className="space-y-4">
                    {benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-slate-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-8 pt-6 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-emerald-100 flex items-center justify-center mr-3">
                          <Star className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-slate-900">4.8/5</div>
                          <div className="text-sm text-slate-600">Satisfaction patients</div>
                        </div>
                      </div>
                      <Link 
                        to="/testimonials" 
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        Voir les avis →
                      </Link>
                    </div>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl opacity-10 blur-xl"></div>
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl opacity-10 blur-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="mt-16 lg:mt-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Pourquoi choisir{" "}
            <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              MediConnect
            </span>
            ?
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            La plateforme médicale complète qui simplifie votre parcours de santé
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 hover:-translate-y-2"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {feature.title}
              </h3>
              
              <p className="text-slate-600 mb-6">
                {feature.description}
              </p>
              
              <Link 
                to="/features" 
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm group/learn"
              >
                En savoir plus
                <ArrowRight className="w-4 h-4 ml-1 group-hover/learn:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          ))}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="mt-16 lg:mt-24">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-emerald-600"></div>
          
          {/* Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
          </div>
          
          <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Prêt à prendre en main votre santé ?
              </h2>
              
              <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                Rejoignez des milliers d'Algériens qui font confiance à MediConnect
                pour leurs besoins médicaux.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/register" 
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-blue-600 bg-white rounded-xl hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Commencer gratuitement
                </Link>
                
                <Link 
                  to="/contact" 
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-300"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Voir une démo
                </Link>
              </div>
              
              <p className="text-sm text-blue-200 mt-6">
                Aucune carte bancaire requise • Essai gratuit de 30 jours
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="mt-16 lg:mt-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Trois étapes simples pour prendre rendez-vous avec un médecin
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Recherchez un médecin",
              description: "Filtrez par spécialité, wilaya et disponibilité",
              icon: Search
            },
            {
              step: "02",
              title: "Prenez rendez-vous",
              description: "Choisissez un créneau et confirmez votre rendez-vous",
              icon: Calendar
            },
            {
              step: "03",
              title: "Consultez et suivez",
              description: "Recevez des notifications et accédez à vos documents",
              icon: Shield
            }
          ].map((item, index) => (
            <div key={index} className="relative">
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-emerald-100 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                    {item.step}
                  </span>
                </div>
                
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center mx-auto mb-6">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {item.title}
                </h3>
                
                <p className="text-slate-600">
                  {item.description}
                </p>
              </div>
              
              {/* Connector lines between steps */}
              {index < 2 && (
                <div className="hidden md:block absolute top-1/2 right-0 w-8 h-0.5 bg-gradient-to-r from-blue-200 to-emerald-200 transform translate-x-4 -translate-y-1/2"></div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
