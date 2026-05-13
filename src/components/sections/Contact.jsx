import { useState } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Github,
  Instagram,
  MessageCircle,
  Video,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { sendEmail } from "../../lib/emailjs";

const socials = [
  {
    icon: <MessageCircle size={18} />,
    label: "WhatsApp",
    value: "+62 812-6144-3582",
    href: "https://wa.me/6281261443582",
  },
  {
    icon: <Instagram size={18} />,
    label: "Instagram",
    value: "@m.diqqq",
    href: "https://instagram.com/m.diqqq",
  },
  {
    icon: <Video size={18} />,
    label: "TikTok",
    value: "@diqsxx",
    href: "https://tiktok.com/@diqsxx",
  },
  {
    icon: <Github size={18} />,
    label: "GitHub",
    value: "MSIDIQ472",
    href: "https://github.com/MSIDIQ472",
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await sendEmail(form);
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setStatus(null), 4000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus(null), 4000);
    }
  };

  return (
    <section id="contact" className="py-24 px-4 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <p className="font-mono text-xs text-sky-500 uppercase tracking-widest mb-2">
          05. Contact
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-bold">
          Get In Touch
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bento-card p-6"
        >
          <h3 className="font-mono text-sm text-sky-500 mb-5">
            // Send a message
          </h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="font-mono text-xs text-[#444] mb-1.5 block uppercase tracking-wider">
                Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                placeholder="Muhamad Sidiq"
                className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-4 py-3 font-mono text-sm text-white placeholder-[#333] focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>
            <div>
              <label className="font-mono text-xs text-[#444] mb-1.5 block uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                placeholder="sidiq@example.com"
                className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-4 py-3 font-mono text-sm text-white placeholder-[#333] focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>
            <div>
              <label className="font-mono text-xs text-[#444] mb-1.5 block uppercase tracking-wider">
                Message
              </label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                rows={4}
                placeholder="Halo Sidiq, saya ingin..."
                className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-4 py-3 font-mono text-sm text-white placeholder-[#333] focus:outline-none focus:border-sky-500 transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="flex items-center justify-center gap-2 bg-sky-600 text-white font-mono text-sm font-bold py-3 rounded-xl hover:bg-sky-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "loading" ? (
                <>
                  Sending<span className="animate-pulse">...</span>
                </>
              ) : (
                <>
                  <Send size={14} /> Send Message
                </>
              )}
            </button>
            {status === "success" && (
              <div className="flex items-center gap-2 text-sky-500 font-mono text-xs">
                <CheckCircle size={14} /> Pesan terkirim! Terima kasih.
              </div>
            )}
            {status === "error" && (
              <div className="flex items-center gap-2 text-red-500 font-mono text-xs">
                <AlertCircle size={14} /> Gagal mengirim. Coba lagi.
              </div>
            )}
          </form>
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex flex-col gap-4"
        >
          <div className="bento-card p-5">
            <p className="font-mono text-xs text-[#444] uppercase tracking-wider mb-4">
              // Direct contact
            </p>
            <div className="flex flex-col gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl border border-[#111] hover:border-sky-500 hover:bg-sky-500/5 transition-all group"
                >
                  <span className="text-[#444] group-hover:text-sky-500 transition-colors">
                    {s.icon}
                  </span>
                  <div>
                    <p className="font-mono text-xs text-[#555] group-hover:text-sky-500/70 transition-colors">
                      {s.label}
                    </p>
                    <p className="font-mono text-sm text-white">{s.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="bento-card p-5">
            <p className="font-mono text-xs text-[#444] uppercase tracking-wider mb-3">
              // Location
            </p>
            <p className="font-mono text-sm text-white">
              Padang, Sumatera Barat
            </p>
            <p className="font-mono text-xs text-[#444] mt-1">
              Universitas Andalas
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
              <span className="font-mono text-xs text-sky-500">
                Open to collaboration
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
