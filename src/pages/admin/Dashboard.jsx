import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FlaskConical,
  FolderOpen,
  Award,
  BookOpen,
  TrendingUp,
} from "lucide-react";
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
      color: "text-blue-400",
    },
    {
      label: "Laporan",
      value: stats.reports,
      icon: <FlaskConical size={18} />,
      color: "text-sky-500",
    },
    {
      label: "Proyek",
      value: stats.projects,
      icon: <FolderOpen size={18} />,
      color: "text-purple-400",
    },
    {
      label: "Sertifikat",
      value: stats.certificates,
      icon: <Award size={18} />,
      color: "text-yellow-400",
    },
  ];

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-8">
          <p className="font-mono text-xs text-[#444] mb-1">Welcome back,</p>
          <h1 className="font-display text-2xl font-bold text-white">
            {user?.email?.split("@")[0] ?? "Admin"}
          </h1>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bento-card p-5"
            >
              <div className={`${card.color} mb-3`}>{card.icon}</div>
              <p className="font-mono text-2xl font-bold text-white">
                {card.value}
              </p>
              <p className="font-mono text-xs text-[#444] mt-1">{card.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="bento-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-sky-500" />
            <h2 className="font-mono text-sm text-white">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Tambah Mata Kuliah", href: "/sidiq-admin/courses" },
              { label: "Buat Laporan", href: "/sidiq-admin/reports" },
              { label: "Tambah Proyek", href: "/sidiq-admin/projects" },
              { label: "Tambah Sertifikat", href: "/sidiq-admin/certificates" },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                className="flex items-center justify-center text-center px-3 py-2.5 rounded-xl border border-[#111] font-mono text-xs text-[#666] hover:border-sky-500 hover:text-sky-500 transition-all"
              >
                {action.label}
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
