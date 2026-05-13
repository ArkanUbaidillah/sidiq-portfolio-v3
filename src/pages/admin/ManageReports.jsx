import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Image,
  Type,
  FlaskConical,
  ChevronUp,
  ChevronDown,
  Eye,
  CheckCircle,
  X,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

const sortReportsByWeek = (items) =>
  [...items].sort((a, b) => (a.week_number ?? 0) - (b.week_number ?? 0));

const STORAGE_BUCKET = "media";

function parseJsonLike(value) {
  if (typeof value !== "string") return value;

  const trimmed = value.trim();
  if (!trimmed.startsWith("[") && !trimmed.startsWith("{")) return value;

  try {
    return JSON.parse(trimmed);
  } catch {
    return value;
  }
}

function normalizeBlock(block) {
  if (!block) return null;

  if (typeof block === "string") {
    return { type: "text", content: block };
  }

  if (block.type === "image") {
    const url = block.url || block.value || block.src || block.image_url;
    return url
      ? { type: "image", url, caption: block.caption || block.title || "" }
      : null;
  }

  const content =
    block.content || block.value || block.text || block.html || block.body;

  if (content) {
    return { type: "text", content: String(content) };
  }

  return null;
}

function normalizeBlocks(value) {
  const parsed = parseJsonLike(value);
  const items = Array.isArray(parsed) ? parsed : [parsed];
  return items.map(normalizeBlock).filter(Boolean);
}

function getReportBlocks(report) {
  const blocks = normalizeBlocks(report.blocks);
  if (blocks.length > 0) {
    return blocks;
  }

  const legacyContent =
    report.content || report.html_content || report.body || report.description;

  return normalizeBlocks(legacyContent);
}

// Block editor components
function TextBlockEditor({ block, onChange, onDelete }) {
  return (
    <div className="relative border border-[#1a1a1a] rounded-xl bg-[#0a0a0a] p-3">
      <div className="flex items-center gap-2 mb-2">
        <Type size={12} className="text-sky-500" />
        <span className="font-mono text-xs text-sky-500">Text Block</span>
        <button
          onClick={onDelete}
          className="ml-auto text-[#333] hover:text-red-500 transition-colors"
        >
          <X size={12} />
        </button>
      </div>
      <textarea
        value={block.content || ""}
        onChange={(e) => onChange({ ...block, content: e.target.value })}
        placeholder="Tulis konten HTML di sini... (support: <h2>, <p>, <code>, <ul>, <blockquote>)"
        rows={5}
        className="w-full bg-transparent font-mono text-xs text-[#aaa] placeholder-[#333] focus:outline-none resize-none"
      />
    </div>
  );
}

function ImageBlockEditor({ block, onChange, onDelete }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef();

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `reports/${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, file);
    if (!error) {
      const { data } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(path);
      onChange({ ...block, url: data.publicUrl });
    }
    setUploading(false);
  };

  return (
    <div className="relative border border-[#1a1a1a] rounded-xl bg-[#0a0a0a] p-3">
      <div className="flex items-center gap-2 mb-3">
        <Image size={12} className="text-sky-500" />
        <span className="font-mono text-xs text-sky-500">Image Block</span>
        <button
          onClick={onDelete}
          className="ml-auto text-[#333] hover:text-red-500 transition-colors"
        >
          <X size={12} />
        </button>
      </div>

      {block.url ? (
        <div className="mb-3">
          <img
            src={block.url}
            alt="preview"
            className="max-h-40 rounded-lg object-contain bg-[#111]"
          />
          <button
            onClick={() => onChange({ ...block, url: "" })}
            className="font-mono text-xs text-[#333] hover:text-red-500 mt-1 transition-colors"
          >
            Ganti gambar
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="border border-dashed border-[#222] rounded-xl p-6 text-center cursor-pointer hover:border-sky-500/40 transition-colors mb-3"
        >
          {uploading ? (
            <span className="font-mono text-xs text-sky-500 animate-pulse">
              Uploading...
            </span>
          ) : (
            <>
              <Image size={20} className="text-[#333] mx-auto mb-2" />
              <span className="font-mono text-xs text-[#333]">
                Klik untuk upload gambar
              </span>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
        </div>
      )}

      <input
        type="text"
        value={block.caption || ""}
        onChange={(e) => onChange({ ...block, caption: e.target.value })}
        placeholder="Caption gambar (opsional)"
        className="w-full bg-transparent font-mono text-xs text-[#555] placeholder-[#222] focus:outline-none border-t border-[#0f0f0f] pt-2"
      />
    </div>
  );
}

export default function ManageReports() {
  const [courses, setCourses] = useState([]);
  const [reports, setReports] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [editing, setEditing] = useState(null); // null | report object
  const [form, setForm] = useState({
    title: "",
    week_number: 1,
    course_id: "",
  });
  const [blocks, setBlocks] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase
      .from("courses")
      .select("*")
      .order("name")
      .then(({ data }) => setCourses(data || []));
  }, []);

  useEffect(() => {
    if (!selectedCourse) return;
    supabase
      .from("lab_reports")
      .select("*")
      .eq("course_id", selectedCourse)
      .then(({ data }) => setReports(sortReportsByWeek(data || [])));
  }, [selectedCourse]);

  const addBlock = (type) => {
    const newBlock =
      type === "text"
        ? { type: "text", content: "" }
        : { type: "image", url: "", caption: "" };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (idx, updated) => {
    setBlocks(blocks.map((b, i) => (i === idx ? updated : b)));
  };

  const deleteBlock = (idx) => {
    setBlocks(blocks.filter((_, i) => i !== idx));
  };

  const moveBlock = (idx, dir) => {
    const newBlocks = [...blocks];
    const target = idx + dir;
    if (target < 0 || target >= newBlocks.length) return;
    [newBlocks[idx], newBlocks[target]] = [newBlocks[target], newBlocks[idx]];
    setBlocks(newBlocks);
  };

  const startNew = () => {
    setEditing("new");
    setForm({ title: "", week_number: 1, course_id: selectedCourse });
    setBlocks([]);
  };

  const startEdit = (report) => {
    setEditing(report.id);
    setForm({
      title: report.title,
      week_number: report.week_number,
      course_id: report.course_id,
    });
    setBlocks(getReportBlocks(report));
  };

  const handleSave = async () => {
    if (!form.title || !form.course_id) return;
    setSaving(true);
    const payload = {
      title: form.title,
      slug: slugify(form.title),
      week_number: form.week_number,
      course_id: form.course_id,
      blocks,
    };
    let error;
    if (editing === "new") {
      ({ error } = await supabase.from("lab_reports").insert([payload]));
    } else {
      ({ error } = await supabase
        .from("lab_reports")
        .update(payload)
        .eq("id", editing));
    }
    if (!error) {
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        setEditing(null);
      }, 1500);
      // Refresh list
      const { data } = await supabase
        .from("lab_reports")
        .select("*")
        .eq("course_id", selectedCourse);
      setReports(sortReportsByWeek(data || []));
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus laporan ini?")) return;
    await supabase.from("lab_reports").delete().eq("id", id);
    setReports(reports.filter((r) => r.id !== id));
    if (editing === id) setEditing(null);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
      <div className="mb-6">
        <p className="text-sm font-bold text-sky-200">Lab Publishing</p>
        <h1 className="mt-1 flex items-center gap-2 font-display text-3xl font-extrabold text-white">
          <FlaskConical size={24} className="text-sky-200" /> Laporan Praktikum
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Course selector + report list */}
        <div>
          <div className="bento-card p-4 mb-4">
            <label className="mb-2 block text-xs font-bold uppercase text-slate-500">
              Pilih Mata Kuliah
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => {
                setSelectedCourse(e.target.value);
                setEditing(null);
              }}
              className="w-full px-3 py-2.5 text-sm"
            >
              <option value="">-- Pilih --</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {selectedCourse && (
            <div className="bento-card overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 p-3">
                <p className="text-xs font-bold text-slate-500">
                  {reports.length} laporan
                </p>
                <button
                  onClick={startNew}
                  className="flex items-center gap-1 rounded-lg bg-sky-400 px-3 py-1.5 text-xs font-bold text-slate-950 transition-colors hover:bg-sky-300"
                >
                  <Plus size={12} /> Baru
                </button>
              </div>
              {reports.length === 0 && (
                <div className="p-6 text-center text-xs font-semibold text-slate-500">
                  Belum ada laporan
                </div>
              )}
              {reports.map((report) => (
                <div
                  key={report.id}
                  className={`flex cursor-pointer items-center justify-between border-b border-white/10 p-3 transition-colors ${
                    editing === report.id
                      ? "border-l-2 border-l-sky-300 bg-sky-400/10"
                      : "hover:bg-white/[0.03]"
                  }`}
                  onClick={() => startEdit(report)}
                >
                  <div>
                    <p className="text-xs font-bold text-white">
                      {report.title}
                    </p>
                    <p className="text-xs font-semibold text-slate-500">
                      Week {report.week_number ?? "-"}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(report.id);
                    }}
                    className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-rose-500/10 hover:text-rose-300"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Block editor */}
        <div className="lg:col-span-2">
          {editing ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bento-card p-5"
            >
              <h2 className="mb-4 font-display text-lg font-bold text-white">
                {editing === "new" ? "Laporan Baru" : "Edit Laporan"}
              </h2>

              <div className="flex gap-3 mb-4">
                <input
                  type="text"
                  placeholder="Judul laporan"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="flex-1 px-3 py-2.5 text-sm"
                />
                <input
                  type="number"
                  min={1}
                  value={form.week_number}
                  onChange={(e) =>
                    setForm({ ...form, week_number: parseInt(e.target.value) })
                  }
                  className="w-20 px-3 py-2.5 text-sm"
                  placeholder="Week"
                />
              </div>

              {/* Blocks */}
              <div className="flex flex-col gap-3 mb-4">
                <AnimatePresence>
                  {blocks.map((block, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      className="relative"
                    >
                      {/* Move buttons */}
                      <div className="absolute -left-7 top-3 flex flex-col gap-1">
                        <button
                          onClick={() => moveBlock(idx, -1)}
                          className="text-[#222] hover:text-sky-500 transition-colors"
                        >
                          <ChevronUp size={12} />
                        </button>
                        <button
                          onClick={() => moveBlock(idx, 1)}
                          className="text-[#222] hover:text-sky-500 transition-colors"
                        >
                          <ChevronDown size={12} />
                        </button>
                      </div>

                      {block.type === "text" ? (
                        <TextBlockEditor
                          block={block}
                          onChange={(updated) => updateBlock(idx, updated)}
                          onDelete={() => deleteBlock(idx)}
                        />
                      ) : (
                        <ImageBlockEditor
                          block={block}
                          onChange={(updated) => updateBlock(idx, updated)}
                          onDelete={() => deleteBlock(idx)}
                        />
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Add block buttons */}
              <div className="flex gap-2 mb-5">
                <button
                  onClick={() => addBlock("text")}
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-slate-400 transition-all hover:border-sky-300/40 hover:text-white"
                >
                  <Type size={12} /> Add Text
                </button>
                <button
                  onClick={() => addBlock("image")}
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-slate-400 transition-all hover:border-sky-300/40 hover:text-white"
                >
                  <Image size={12} /> Upload Image
                </button>
              </div>

              {/* Save */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-lg bg-sky-400 px-5 py-2.5 text-xs font-bold text-slate-950 transition-colors hover:bg-sky-300 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Simpan Laporan"}
                </button>
                {saved && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-300">
                    <CheckCircle size={12} /> Tersimpan!
                  </span>
                )}
                <button
                  onClick={() => setEditing(null)}
                  className="text-xs font-bold text-slate-500 transition-colors hover:text-white"
                >
                  Batal
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="bento-card p-12 text-center">
              <Eye size={24} className="mx-auto mb-3 text-slate-600" />
              <p className="text-sm font-semibold text-slate-500">
                Pilih laporan untuk diedit
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-600">
                atau klik "+ Baru" untuk membuat laporan
              </p>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
