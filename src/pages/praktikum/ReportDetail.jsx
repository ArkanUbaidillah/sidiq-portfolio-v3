import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Calendar } from "lucide-react";
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
  if (blocks.length > 0) return blocks;

  const legacyContent =
    report.content || report.html_content || report.body || report.description;

  return normalizeBlocks(legacyContent);
}

function BlockRenderer({ block }) {
  if (block.type === "text") {
    const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(block.content);
    if (!looksLikeHtml) {
      return (
        <div className="bento-card report-content whitespace-pre-line p-6">
          {block.content}
        </div>
      );
    }

    return (
      <div
        className="bento-card report-content p-6"
        dangerouslySetInnerHTML={{ __html: block.content }}
      />
    );
  }

  if (block.type === "image") {
    return (
      <figure className="bento-card p-2">
        <div className="overflow-hidden rounded-lg">
          <img
            src={block.url}
            alt={block.caption || "Gambar laporan"}
            className="max-h-[620px] w-full bg-slate-950 object-contain"
          />
        </div>
        {block.caption && (
          <figcaption className="mt-2 text-center text-xs font-semibold text-slate-500">
            {block.caption}
          </figcaption>
        )}
      </figure>
    );
  }

  return null;
}

function ReportSkeleton() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 pb-20 pt-28">
        <div className="mb-8 h-6 w-40 animate-pulse rounded-lg bg-white/10" />
        <div className="mb-4 h-10 w-3/4 animate-pulse rounded-lg bg-white/10" />
        <div className="mb-10 h-4 w-48 animate-pulse rounded-lg bg-white/10" />
        <div className="space-y-4">
          <div className="h-28 animate-pulse rounded-lg bg-white/10" />
          <div className="h-64 animate-pulse rounded-lg bg-white/10" />
        </div>
      </main>
    </div>
  );
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

  if (loading) return <ReportSkeleton />;

  if (!report) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-4">
          <div className="bento-card p-8 text-center">
            <p className="mb-4 text-sm font-semibold text-slate-400">
              Laporan tidak ditemukan.
            </p>
            <Link
              to={`/praktikum/${courseSlug}`}
              className="text-sm font-bold text-sky-200 hover:text-white"
            >
              Kembali ke daftar laporan
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const blocks = getReportBlocks(report);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 pb-20 pt-28">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            to={`/praktikum/${courseSlug}`}
            className="mb-8 flex items-center gap-2 text-sm font-semibold text-slate-400 transition-colors hover:text-white"
          >
            <ArrowLeft size={14} /> Kembali ke {course?.name}
          </Link>

          <div className="bento-card mb-8 p-6">
            <div className="mb-3 flex items-center gap-2">
              <BookOpen size={14} className="text-sky-200" />
              <span className="text-xs font-bold text-sky-200">
                {course?.name}
              </span>
              <span className="text-slate-600">/</span>
              <span className="text-xs font-semibold text-slate-400">
                Week {report.week_number ?? "-"}
              </span>
            </div>
            <h1 className="mb-3 font-display text-3xl font-extrabold text-white md:text-4xl">
              {report.title}
            </h1>
            <div className="flex items-center gap-2 text-slate-500">
              <Calendar size={12} />
              <span className="text-xs font-semibold">
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

          <div className="space-y-6">
            {blocks.length === 0 ? (
              <p className="bento-card p-6 text-sm font-semibold text-slate-400">
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
