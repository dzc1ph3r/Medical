import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
export default function NotFound() {
    return (_jsxs("div", { style: { padding: 24, textAlign: "center" }, children: [_jsx("h1", { children: "404" }), _jsx("p", { children: "Page introuvable." }), _jsx(Link, { to: "/", children: "Retour \u00E0 l\u2019accueil" })] }));
}
