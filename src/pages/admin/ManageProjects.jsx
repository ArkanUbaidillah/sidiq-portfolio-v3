import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, FolderOpen, CheckCircle } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function ManageProjects() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    tech_stack: "",
    github_url: "",
    live_url: "",
    thumbnail_url: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchProjects = async () => {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    setProjects(data || []);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    const tech = form.tech_stack
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const { error } = await supabase.from("projects").insert([
      {
        title: form.title,
        description: form.description,
        tech_stack: tech,
        github_url: form.github_url || null,
        live_url: form.live_url || null,
        thumbnail_url: form.thumbnail_url || null,
      },
    ]);
    if (!error) {
      setForm({
        title: "",
        description: "",
        tech_stack: "",
        github_url: "",
        live_url: "",
        thumbnail_url: "",
      });
      setSaved(true);
      fetchProjects();
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus proyek ini?")) return;
    await supabase.from("projects").delete().eq("id", id);
    fetchProjects();
  };

  const fields = [
    {
      key: "title",
      label: "Nama Proyek",
      placeholder: "Portfolio Web",
      required: true,
    },
    {
      key: "description",
      label: "Deskripsi",
      placeholder: "Deskripsi singkat proyek",
      required: true,
    },
    {
      key: "tech_stack",
      label: "Tech Stack",
      placeholder: "React, Node.js, MySQL (pisah koma)",
      required: false,
    },
    {
      key: "github_url",
      label: "GitHub URL",
      placeholder: "https://github.com/...",
      required: false,
    },
    {
      key: "live_url",
      label: "Live URL",
      placeholder: "https://...",
      required: false,
    },
    {
      key: "thumbnail_url",
      label: "Thumbnail URL",
      placeholder: "https://...",
      required: false,
    },
  ];

  return (
    <div className="p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <p className="text-sm font-bold text-sky-200">Portfolio Works</p>
        <h1 className="mt-1 flex items-center gap-2 font-display text-3xl font-extrabold text-white">
          <FolderOpen size={24} className="text-sky-200" /> Proyek
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bento-card p-5">
          <h2 className="mb-4 font-display text-lg font-bold text-white">
            Tambah Proyek
          </h2>
          <form onSubmit={handleAdd} className="flex flex-col gap-3">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="mb-1 block text-xs font-bold text-slate-500">
                  {f.label}
                </label>
                <input
                  type="text"
                  placeholder={f.placeholder}
                  value={form[f.key]}
                  onChange={(e) =>
                    setForm({ ...form, [f.key]: e.target.value })
                  }
                  required={f.required}
                  className="w-full px-3 py-2.5 text-sm"
                />
              </div>
            ))}
            <div className="flex items-center gap-3 mt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-sky-400 px-4 py-2.5 text-xs font-bold text-slate-950 transition-colors hover:bg-sky-300 disabled:opacity-50"
              >
                <Plus size={13} /> Simpan
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
              {projects.length} proyek
            </p>
          </div>
          {projects.length === 0 ? (
            <div className="p-8 text-center text-sm font-semibold text-slate-500">
              Belum ada proyek
            </div>
          ) : (
            <ul>
              {projects.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between border-b border-white/10 p-4 transition-colors hover:bg-white/[0.03]"
                >
                  <div>
                    <p className="text-sm font-bold text-white">{p.title}</p>
                    <p className="mt-0.5 max-w-xs truncate text-xs font-semibold text-slate-500">
                      {p.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-rose-500/10 hover:text-rose-300"
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
