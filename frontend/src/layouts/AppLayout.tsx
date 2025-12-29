import Navbar from "../components/Navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-50">
      <Navbar />
      <main className="app-main">{children}</main>
    </div>
  );
}
