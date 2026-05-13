import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Calendar, ChevronRight } from "lucide-react";
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
      <div className="min-h-screen">
        <Navbar />
        <main className="mx-auto max-w-4xl px-4 pb-20 pt-28">
          <div className="mb-8 h-6 w-32 animate-pulse rounded-lg bg-white/10" />
          <div className="mb-8 h-36 animate-pulse rounded-lg bg-white/10" />
          <div className="space-y-3">
            <div className="h-20 animate-pulse rounded-lg bg-white/10" />
            <div className="h-20 animate-pulse rounded-lg bg-white/10" />
          </div>
        </main>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="mx-auto flex min-h-[70vh] max-w-4xl items-center justify-center px-4">
          <div className="bento-card p-8 text-center">
            <p className="mb-4 text-sm font-semibold text-slate-400">
              Mata kuliah tidak ditemukan.
            </p>
            <Link to="/" className="text-sm font-bold text-sky-200">
              Kembali ke Home
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 pb-20 pt-28">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            to="/#praktikum"
            className="mb-8 flex items-center gap-2 text-sm font-semibold text-slate-400 transition-colors hover:text-white"
          >
            <ArrowLeft size={14} /> Kembali
          </Link>

          <div className="bento-card mb-8 p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-sky-400/10 text-sky-200">
                <BookOpen size={19} />
              </div>
              <div>
                <h1 className="font-display text-2xl font-extrabold text-white">
                  {course.name}
                </h1>
                <p className="text-sm font-semibold text-slate-500">
                  {reports.length} laporan tersedia
                </p>
              </div>
            </div>
            {course.description && (
              <p className="text-sm leading-relaxed text-slate-400">
                {course.description}
              </p>
            )}
          </div>

          <div className="space-y-3">
            {reports.length === 0 ? (
              <div className="bento-card p-10 text-center">
                <p className="text-sm font-semibold text-slate-400">
                  Belum ada laporan untuk mata kuliah ini.
                </p>
              </div>
            ) : (
              reports.map((report, i) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    to={`/praktikum/${courseSlug}/${report.slug}`}
                    className="bento-card flex items-center justify-between p-4 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-16 shrink-0 rounded-lg bg-sky-400/10 px-3 py-2 text-center text-xs font-bold text-sky-200">
                        W{report.week_number ?? "-"}
                      </span>
                      <div>
                        <p className="font-display font-bold text-white transition-colors group-hover:text-sky-200">
                          {report.title}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <Calendar size={12} className="text-slate-600" />
                          <p className="text-xs font-semibold text-slate-500">
                            {report.created_at
                              ? new Date(report.created_at).toLocaleDateString(
                                  "id-ID",
                                )
                              : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                    <ChevronRight
                      size={17}
                      className="text-slate-500 transition-all group-hover:translate-x-1 group-hover:text-sky-200"
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
