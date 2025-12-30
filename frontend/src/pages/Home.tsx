import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home">
      <section className="home-hero">
        <div>
          <p className="home-hero__tag">Plateforme médicale en Algérie</p>
          <h1>
            Prenez rendez-vous avec les meilleurs médecins, en toute simplicité.
          </h1>
          <p className="home-hero__subtitle">
            Recherchez par spécialité et wilaya, partagez vos documents médicaux et
            suivez vos rendez-vous en temps réel.
          </p>
          <div className="home-hero__actions">
            <Link to="/doctors" className="button-primary">
              Trouver un médecin
            </Link>
            <Link to="/register" className="button-secondary">
              Créer un compte
            </Link>
          </div>
        </div>
        <div className="home-hero__card">
          <h3>Ce que vous pouvez faire</h3>
          <ul>
            <li>Réserver un rendez-vous en ligne</li>
            <li>Recevoir des notifications instantanées</li>
            <li>Partager vos documents médicaux</li>
            <li>Consulter votre calendrier</li>
          </ul>
        </div>
      </section>

      <section className="home-features">
        <div className="info-card">
          <h3>Recherche intelligente</h3>
          <p>
            Filtrez par spécialité, wilaya et tarifs pour trouver le bon médecin.
          </p>
        </div>
        <div className="info-card">
          <h3>Suivi des rendez-vous</h3>
          <p>
            Les médecins peuvent accepter, reporter ou annuler avec notifications.
          </p>
        </div>
        <div className="info-card">
          <h3>Dossiers médicaux sécurisés</h3>
          <p>
            Téléversez vos analyses et gardez un historique accessible à votre médecin.
          </p>
        </div>
      </section>
    </div>
  );
}
