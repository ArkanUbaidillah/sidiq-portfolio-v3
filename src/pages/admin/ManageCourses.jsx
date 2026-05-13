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
    <div className="p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-6xl"
      >
        <div className="mb-6">
          <p className="text-sm font-bold text-sky-200">Content Library</p>
          <h1 className="mt-1 flex items-center gap-2 font-display text-3xl font-extrabold text-white">
            <BookOpen size={24} className="text-sky-200" /> Mata Kuliah
          </h1>
        </div>

        {/* Form */}
        <div className="bento-card p-5 mb-6">
          <h2 className="mb-4 font-display text-lg font-bold text-white">
            Tambah Mata Kuliah
          </h2>
          <form onSubmit={handleAdd} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Nama Mata Kuliah (e.g. Pemrograman Web)"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="px-4 py-3 text-sm"
            />
            <input
              type="text"
              placeholder="Deskripsi (opsional)"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="px-4 py-3 text-sm"
            />
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-sky-400 px-4 py-2.5 text-xs font-bold text-slate-950 transition-colors hover:bg-sky-300 disabled:opacity-50"
              >
                <Plus size={14} /> Tambah
              </button>
              {saved && (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-300">
                  <CheckCircle size={12} /> Tersimpan!
                </span>
              )}
            </div>
          </form>
        </div>

        {/* List */}
        <div className="bento-card overflow-hidden">
          <div className="border-b border-white/10 p-4">
            <p className="text-xs font-bold text-slate-500">
              {courses.length} mata kuliah
            </p>
          </div>
          {courses.length === 0 ? (
            <div className="p-8 text-center text-sm font-semibold text-slate-500">
              Belum ada data
            </div>
          ) : (
            <ul>
              {courses.map((course) => (
                <li
                  key={course.id}
                  className="flex items-center justify-between border-b border-white/10 p-4 transition-colors hover:bg-white/[0.03]"
                >
                  <div>
                    <p className="text-sm font-bold text-white">
                      {course.name}
                    </p>
                    <p className="mt-0.5 text-xs font-semibold text-slate-500">
                      /{course.slug}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-rose-500/10 hover:text-rose-300"
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
