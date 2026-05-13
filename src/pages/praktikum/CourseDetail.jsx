import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Calendar } from "lucide-react";
import { supabase } from "../../lib/supabase";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

const sortReportsByWeek = (items) =>
  [...items].sort((a, b) => (a.week_number ?? 0) - (b.week_number ?? 0));

export default function CourseDetail() {
  const { courseSlug } = useParams();
  const [course, setCourse] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: courseData } = await supabase
        .from("courses")
        .select("*")
        .eq("slug", courseSlug)
        .single();

      if (courseData) {
        setCourse(courseData);
        const { data: reportsData } = await supabase
          .from("lab_reports")
          .select("*")
          .eq("course_id", courseData.id);
        setReports(sortReportsByWeek(reportsData || []));
      }
      setLoading(false);
    };
    fetchData();
  }, [courseSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="font-mono text-sky-500 animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="font-mono text-[#444] mb-4">
            Mata kuliah tidak ditemukan.
          </p>
          <Link
            to="/"
            className="font-mono text-xs text-sky-500 hover:underline"
          >
            ← Kembali ke Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 pt-28 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            to="/#praktikum"
            className="flex items-center gap-2 font-mono text-xs text-[#444] hover:text-sky-500 transition-colors mb-8"
          >
            <ArrowLeft size={14} /> Kembali
          </Link>

          <div className="bento-card p-6 mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                <BookOpen size={18} className="text-sky-500" />
              </div>
              <div>
                <h1 className="font-display text-xl font-bold text-white">
                  {course.name}
                </h1>
                <p className="font-mono text-xs text-[#444]">
                  {reports.length} laporan tersedia
                </p>
              </div>
            </div>
            {course.description && (
              <p className="text-[#666] text-sm">{course.description}</p>
            )}
          </div>

          <div className="space-y-3">
            {reports.length === 0 ? (
              <div className="bento-card p-10 text-center">
                <p className="font-mono text-sm text-[#444]">
                  Belum ada laporan untuk mata kuliah ini.
                </p>
              </div>
            ) : (
              reports.map((report, i) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    to={`/praktikum/${courseSlug}/${report.slug}`}
                    className="bento-card p-4 flex items-center justify-between group block"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-xs text-sky-500 w-14 shrink-0">
                        Week {report.week_number ?? "-"}
                      </span>
                      <div>
                        <p className="font-display font-medium text-white group-hover:text-sky-500 transition-colors">
                          {report.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Calendar size={11} className="text-[#333]" />
                          <p className="font-mono text-xs text-[#333]">
                            {report.created_at
                              ? new Date(report.created_at).toLocaleDateString(
                                  "id-ID",
                                )
                              : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                    <ArrowLeft
                      size={14}
                      className="text-[#333] group-hover:text-sky-500 rotate-180 group-hover:translate-x-1 transition-all"
                    />
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
