import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{ padding: 24, textAlign: "center" }}>
      <h1>404</h1>
      <p>Page introuvable.</p>
      <Link to="/">Retour à l’accueil</Link>
    </div>
  );
}