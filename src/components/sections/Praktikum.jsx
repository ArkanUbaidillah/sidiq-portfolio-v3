import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, ChevronRight, FlaskConical } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function Praktikum() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("courses")
      .select("*, lab_reports(count)")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setCourses(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <section id="praktikum" className="py-24 px-4 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <p className="font-mono text-xs text-sky-500 uppercase tracking-widest mb-2">
          03. Praktikum
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-bold">
          Lab Reports
        </h2>
        <p className="text-[#555] text-sm mt-2 font-mono">
          Laporan praktikum mingguan per mata kuliah
        </p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bento-card h-32 animate-pulse" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="bento-card p-12 text-center">
          <FlaskConical size={32} className="text-[#333] mx-auto mb-3" />
          <p className="font-mono text-sm text-[#444]">
            Mata kuliah akan ditampilkan di sini.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                to={`/praktikum/${course.slug}`}
                className="bento-card p-5 flex items-center justify-between group block hover:no-underline"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                    <BookOpen size={16} className="text-sky-500" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-white group-hover:text-sky-500 transition-colors">
                      {course.name}
                    </p>
                    <p className="font-mono text-xs text-[#444] mt-0.5">
                      {course.lab_reports?.[0]?.count ?? 0} laporan
                    </p>
                  </div>
                </div>
                <ChevronRight
                  size={16}
                  className="text-[#333] group-hover:text-sky-500 group-hover:translate-x-1 transition-all"
                />
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
