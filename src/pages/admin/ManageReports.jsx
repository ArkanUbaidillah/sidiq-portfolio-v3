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
    setBlocks(report.blocks || []);
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
    <div className="p-8">
      <h1 className="font-display text-xl font-bold text-white mb-6 flex items-center gap-2">
        <FlaskConical size={20} className="text-sky-500" /> Laporan Praktikum
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Course selector + report list */}
        <div>
          <div className="bento-card p-4 mb-4">
            <label className="font-mono text-xs text-[#444] mb-2 block">
              Pilih Mata Kuliah
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => {
                setSelectedCourse(e.target.value);
                setEditing(null);
              }}
              className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-sky-500"
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
              <div className="p-3 border-b border-[#0f0f0f] flex items-center justify-between">
                <p className="font-mono text-xs text-[#444]">
                  {reports.length} laporan
                </p>
                <button
                  onClick={startNew}
                  className="flex items-center gap-1 font-mono text-xs text-white bg-sky-600 px-2.5 py-1 rounded-lg hover:bg-sky-500 transition-colors"
                >
                  <Plus size={12} /> Baru
                </button>
              </div>
              {reports.length === 0 && (
                <div className="p-6 text-center font-mono text-xs text-[#333]">
                  Belum ada laporan
                </div>
              )}
              {reports.map((report) => (
                <div
                  key={report.id}
                  className={`flex items-center justify-between p-3 border-b border-[#0a0a0a] cursor-pointer transition-colors ${
                    editing === report.id
                      ? "bg-sky-500/5 border-l-2 border-l-sky-500"
                      : "hover:bg-[#0a0a0a]"
                  }`}
                  onClick={() => startEdit(report)}
                >
                  <div>
                    <p className="font-mono text-xs text-white">
                      {report.title}
                    </p>
                    <p className="font-mono text-xs text-[#333]">
                      Week {report.week_number ?? "-"}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(report.id);
                    }}
                    className="p-1 text-[#333] hover:text-red-500 transition-colors"
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
              <h2 className="font-mono text-xs text-sky-500 mb-4">
                {editing === "new" ? "// Laporan Baru" : "// Edit Laporan"}
              </h2>

              <div className="flex gap-3 mb-4">
                <input
                  type="text"
                  placeholder="Judul laporan"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="flex-1 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-3 py-2 font-mono text-sm text-white placeholder-[#333] focus:outline-none focus:border-sky-500"
                />
                <input
                  type="number"
                  min={1}
                  value={form.week_number}
                  onChange={(e) =>
                    setForm({ ...form, week_number: parseInt(e.target.value) })
                  }
                  className="w-20 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-sky-500"
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
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-[#1a1a1a] rounded-xl font-mono text-xs text-[#555] hover:border-sky-500 hover:text-sky-500 transition-all"
                >
                  <Type size={12} /> Add Text
                </button>
                <button
                  onClick={() => addBlock("image")}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-[#1a1a1a] rounded-xl font-mono text-xs text-[#555] hover:border-sky-500 hover:text-sky-500 transition-all"
                >
                  <Image size={12} /> Upload Image
                </button>
              </div>

              {/* Save */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2 bg-sky-600 text-white font-mono text-xs font-bold rounded-xl hover:bg-sky-500 transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Simpan Laporan"}
                </button>
                {saved && (
                  <span className="flex items-center gap-1 font-mono text-xs text-sky-500">
                    <CheckCircle size={12} /> Tersimpan!
                  </span>
                )}
                <button
                  onClick={() => setEditing(null)}
                  className="font-mono text-xs text-[#333] hover:text-white transition-colors"
                >
                  Batal
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="bento-card p-12 text-center">
              <Eye size={24} className="text-[#222] mx-auto mb-3" />
              <p className="font-mono text-sm text-[#333]">
                Pilih laporan untuk diedit
              </p>
              <p className="font-mono text-xs text-[#222] mt-1">
                atau klik "+ Baru" untuk membuat laporan
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
