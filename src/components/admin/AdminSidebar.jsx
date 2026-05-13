import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  FolderOpen,
  Award,
  LogOut,
  Terminal,
  FlaskConical,
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
    <aside className="w-56 shrink-0 min-h-screen bg-[#000] border-r border-[#111] flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-[#111]">
        <div className="flex items-center gap-2">
          <Terminal size={16} className="text-sky-500" />
          <span className="font-mono text-sm font-bold text-sky-500">
            Admin CMS
          </span>
        </div>
        <p className="font-mono text-xs text-[#333] mt-0.5">sidiq.dev</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3">
        <ul className="flex flex-col gap-1">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-mono text-xs transition-all duration-200 ${
                    isActive
                      ? "bg-sky-500/10 text-sky-500 border border-sky-500/20"
                      : "text-[#444] hover:text-white hover:bg-[#0a0a0a]"
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

      {/* Logout */}
      <div className="p-3 border-t border-[#111]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-mono text-xs text-[#444] hover:text-red-500 hover:bg-red-500/5 transition-all"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
