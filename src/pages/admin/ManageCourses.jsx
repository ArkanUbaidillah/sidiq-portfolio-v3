import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, BookOpen, CheckCircle } from "lucide-react";
import { supabase } from "../../lib/supabase";

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchCourses = async () => {
    const { data } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false });
    setCourses(data || []);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("courses").insert([
      {
        name: form.name,
        slug: slugify(form.name),
        description: form.description,
      },
    ]);
    if (!error) {
      setForm({ name: "", description: "" });
      setSaved(true);
      fetchCourses();
      setTimeout(() => setSaved(false), 2000);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus mata kuliah ini?")) return;
    await supabase.from("courses").delete().eq("id", id);
    fetchCourses();
  };

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-xl font-bold text-white mb-6 flex items-center gap-2">
          <BookOpen size={20} className="text-sky-500" /> Mata Kuliah
        </h1>

        {/* Form */}
        <div className="bento-card p-5 mb-6">
          <h2 className="font-mono text-xs text-sky-500 mb-4">
            // Tambah Mata Kuliah
          </h2>
          <form onSubmit={handleAdd} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Nama Mata Kuliah (e.g. Pemrograman Web)"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-4 py-2.5 font-mono text-sm text-white placeholder-[#333] focus:outline-none focus:border-sky-500 transition-colors"
            />
            <input
              type="text"
              placeholder="Deskripsi (opsional)"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-4 py-2.5 font-mono text-sm text-white placeholder-[#333] focus:outline-none focus:border-sky-500 transition-colors"
            />
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white font-mono text-xs font-bold rounded-xl hover:bg-sky-500 transition-colors disabled:opacity-50"
              >
                <Plus size={14} /> Tambah
              </button>
              {saved && (
                <span className="flex items-center gap-1 font-mono text-xs text-sky-500">
                  <CheckCircle size={12} /> Tersimpan!
                </span>
              )}
            </div>
          </form>
        </div>

        {/* List */}
        <div className="bento-card overflow-hidden">
          <div className="p-4 border-b border-[#0f0f0f]">
            <p className="font-mono text-xs text-[#444]">
              {courses.length} mata kuliah
            </p>
          </div>
          {courses.length === 0 ? (
            <div className="p-8 text-center font-mono text-sm text-[#333]">
              Belum ada data
            </div>
          ) : (
            <ul>
              {courses.map((course) => (
                <li
                  key={course.id}
                  className="flex items-center justify-between p-4 border-b border-[#0a0a0a] hover:bg-[#0a0a0a] transition-colors"
                >
                  <div>
                    <p className="font-mono text-sm text-white">
                      {course.name}
                    </p>
                    <p className="font-mono text-xs text-[#333] mt-0.5">
                      /{course.slug}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="p-1.5 text-[#333] hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>
    </div>
  );
}
