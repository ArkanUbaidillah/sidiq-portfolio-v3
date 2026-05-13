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
    <div className="p-8">
      <h1 className="font-display text-xl font-bold text-white mb-6 flex items-center gap-2">
        <FolderOpen size={20} className="text-sky-500" /> Proyek
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bento-card p-5">
          <h2 className="font-mono text-xs text-sky-500 mb-4">
            // Tambah Proyek
          </h2>
          <form onSubmit={handleAdd} className="flex flex-col gap-3">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="font-mono text-xs text-[#444] mb-1 block">
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
                  className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-3 py-2 font-mono text-sm text-white placeholder-[#333] focus:outline-none focus:border-sky-500 transition-colors"
                />
              </div>
            ))}
            <div className="flex items-center gap-3 mt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white font-mono text-xs font-bold rounded-xl hover:bg-sky-500 transition-colors disabled:opacity-50"
              >
                <Plus size={13} /> Simpan
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
              {projects.length} proyek
            </p>
          </div>
          {projects.length === 0 ? (
            <div className="p-8 text-center font-mono text-sm text-[#333]">
              Belum ada proyek
            </div>
          ) : (
            <ul>
              {projects.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between p-4 border-b border-[#0a0a0a] hover:bg-[#0a0a0a] transition-colors"
                >
                  <div>
                    <p className="font-mono text-sm text-white">{p.title}</p>
                    <p className="font-mono text-xs text-[#333] mt-0.5 max-w-xs truncate">
                      {p.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-1.5 text-[#333] hover:text-red-500 transition-colors"
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
  );
}
