import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Award,
  BookOpen,
  FolderOpen,
  FlaskConical,
  Plus,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    courses: 0,
    reports: 0,
    projects: 0,
    certificates: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [courses, reports, projects, certificates] = await Promise.all([
        supabase.from("courses").select("id", { count: "exact", head: true }),
        supabase
          .from("lab_reports")
          .select("id", { count: "exact", head: true }),
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase
          .from("certificates")
          .select("id", { count: "exact", head: true }),
      ]);
      setStats({
        courses: courses.count || 0,
        reports: reports.count || 0,
        projects: projects.count || 0,
        certificates: certificates.count || 0,
      });
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      label: "Mata Kuliah",
      value: stats.courses,
      icon: <BookOpen size={18} />,
      tone: "text-sky-200 bg-sky-400/10",
    },
    {
      label: "Laporan",
      value: stats.reports,
      icon: <FlaskConical size={18} />,
      tone: "text-emerald-200 bg-emerald-400/10",
    },
    {
      label: "Proyek",
      value: stats.projects,
      icon: <FolderOpen size={18} />,
      tone: "text-violet-200 bg-violet-400/10",
    },
    {
      label: "Sertifikat",
      value: stats.certificates,
      icon: <Award size={18} />,
      tone: "text-amber-200 bg-amber-400/10",
    },
  ];

  const actions = [
    { label: "Tambah Mata Kuliah", href: "/sidiq-admin/courses" },
    { label: "Buat Laporan", href: "/sidiq-admin/reports" },
    { label: "Tambah Proyek", href: "/sidiq-admin/projects" },
    { label: "Tambah Sertifikat", href: "/sidiq-admin/certificates" },
  ];

  return (
    <div className="p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-6xl"
      >
        <div className="mb-8 flex flex-col justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.03] p-6 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-sm font-semibold text-sky-200">
              Welcome back
            </p>
            <h1 className="font-display text-3xl font-extrabold text-white">
              {user?.email?.split("@")[0] ?? "Admin"}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-400">
              Kelola praktikum, proyek, dan sertifikat dari satu dashboard yang
              lebih rapi.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-sm font-semibold text-emerald-100">
            <TrendingUp size={16} />
            Live content
          </div>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {statCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bento-card p-5"
            >
              <div
                className={`mb-4 grid h-10 w-10 place-items-center rounded-lg ${card.tone}`}
              >
                {card.icon}
              </div>
              <p className="font-display text-3xl font-extrabold text-white">
                {card.value}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-400">
                {card.label}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="bento-card p-6">
          <div className="mb-5 flex items-center gap-2">
            <Plus size={17} className="text-sky-200" />
            <h2 className="font-display text-lg font-bold text-white">
              Quick Actions
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            {actions.map((action) => (
              <Link
                key={action.label}
                to={action.href}
                className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-center text-sm font-bold text-slate-300 transition-all hover:border-sky-300/40 hover:bg-sky-400/10 hover:text-white"
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
