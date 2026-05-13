import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, BookOpen } from "lucide-react";
import { supabase } from "../../lib/supabase";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

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

function BlockRenderer({ block }) {
  if (block.type === "text") {
    const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(block.content);
    if (!looksLikeHtml) {
      return (
        <div className="report-content mb-6 whitespace-pre-line">
          {block.content}
        </div>
      );
    }

    return (
      <div
        className="report-content mb-6"
        dangerouslySetInnerHTML={{ __html: block.content }}
      />
    );
  }
  if (block.type === "image") {
    return (
      <div className="mb-6">
        <div className="rounded-xl overflow-hidden border border-[#1a1a1a]">
          <img
            src={block.url}
            alt={block.caption || "Gambar laporan"}
            className="w-full object-contain max-h-[500px] bg-[#0a0a0a]"
          />
        </div>
        {block.caption && (
          <p className="font-mono text-xs text-[#444] text-center mt-2">
            {block.caption}
          </p>
        )}
      </div>
    );
  }
  return null;
}

export default function ReportDetail() {
  const { courseSlug, reportSlug } = useParams();
  const [report, setReport] = useState(null);
  const [course, setCourse] = useState(null);
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
        const { data: reportData } = await supabase
          .from("lab_reports")
          .select("*")
          .eq("slug", reportSlug)
          .eq("course_id", courseData.id)
          .single();
        setReport(reportData);
      }
      setLoading(false);
    };
    fetchData();
  }, [courseSlug, reportSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="font-mono text-sky-500 animate-pulse">
          Loading report...
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="font-mono text-[#444] mb-4">Laporan tidak ditemukan.</p>
          <Link
            to={`/praktikum/${courseSlug}`}
            className="font-mono text-xs text-sky-500 hover:underline"
          >
            ← Kembali ke daftar laporan
          </Link>
        </div>
      </div>
    );
  }

  const blocks = getReportBlocks(report);

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 pt-28 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            to={`/praktikum/${courseSlug}`}
            className="flex items-center gap-2 font-mono text-xs text-[#444] hover:text-sky-500 transition-colors mb-8"
          >
            <ArrowLeft size={14} /> Kembali ke {course?.name}
          </Link>

          {/* Report header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={14} className="text-sky-500" />
              <span className="font-mono text-xs text-sky-500">
                {course?.name}
              </span>
              <span className="text-[#222]">·</span>
              <span className="font-mono text-xs text-[#444]">
                Week {report.week_number ?? "-"}
              </span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-white mb-3">
              {report.title}
            </h1>
            <div className="flex items-center gap-2 text-[#333]">
              <Calendar size={12} />
              <span className="font-mono text-xs">
                {report.created_at
                  ? new Date(report.created_at).toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : ""}
              </span>
            </div>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-sky-500/50 via-sky-500/20 to-transparent mb-8" />

          {/* Blocks */}
          <div>
            {blocks.length === 0 ? (
              <p className="font-mono text-sm text-[#444]">
                Laporan ini belum memiliki konten.
              </p>
            ) : (
              blocks.map((block, idx) => (
                <BlockRenderer key={idx} block={block} />
              ))
            )}
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
