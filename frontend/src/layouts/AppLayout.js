import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Navbar from "../components/Navbar";
export default function AppLayout({ children }) {
    return (_jsxs("div", { className: "app-shell bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-50", children: [_jsx(Navbar, {}), _jsx("main", { className: "app-main", children: children })] }));
}
