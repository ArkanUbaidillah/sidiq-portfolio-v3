import { NavLink, useNavigate } from "react-router-dom";
import {
  Award,
  BookOpen,
  FolderOpen,
  FlaskConical,
  LayoutDashboard,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const links = [
  {
    to: "/sidiq-admin/dashboard",
    icon: <LayoutDashboard size={16} />,
    label: "Dashboard",
  },
  {
    to: "/sidiq-admin/courses",
    icon: <BookOpen size={16} />,
    label: "Mata Kuliah",
  },
  {
    to: "/sidiq-admin/reports",
    icon: <FlaskConical size={16} />,
    label: "Laporan",
  },
  {
    to: "/sidiq-admin/projects",
    icon: <FolderOpen size={16} />,
    label: "Proyek",
  },
  {
    to: "/sidiq-admin/certificates",
    icon: <Award size={16} />,
    label: "Sertifikat",
  },
];

export default function AdminSidebar() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/sidiq-admin");
  };

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-white/10 bg-slate-950/70 backdrop-blur-xl lg:flex lg:flex-col">
      <div className="border-b border-white/10 p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg border border-sky-300/20 bg-sky-300/10 text-sky-200">
            <Sparkles size={18} />
          </span>
          <div>
            <p className="font-display text-sm font-bold text-white">
              Admin Studio
            </p>
            <p className="text-xs text-slate-500">sidiq.dev CMS</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3">
        <ul className="flex flex-col gap-1">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-sky-400 text-slate-950 shadow-lg shadow-sky-950/30"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                {link.icon}
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-white/10 p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-slate-400 transition-all hover:bg-rose-500/10 hover:text-rose-300"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
