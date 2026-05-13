import { motion } from "framer-motion";
import { Github, Instagram, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative mt-20 border-t border-[#111]">
      {/* Map */}
      <div className="w-full h-64 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-10 pointer-events-none" />
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.681456714268!2d100.35697431475468!3d-0.9146736991778707!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2fd4b95a6a33d84b%3A0x6a8c5e3a5d8c7e3a!2sUniversitas%20Andalas!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
          width="100%"
          height="256"
          style={{
            border: 0,
            filter: "grayscale(1) invert(1) opacity(0.7)",
          }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Universitas Andalas Location"
        />
      </div>

      {/* Footer content */}
      <div className="bg-[#000] py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="font-mono text-sm text-sky-500 font-bold">
              Muhamad Sidiq
            </p>
            <p className="font-mono text-xs text-[#444] mt-1">
              2411533011 · Universitas Andalas
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/MSIDIQ472"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg border border-[#111] text-[#555] hover:text-sky-500 hover:border-sky-500 transition-all duration-200"
              aria-label="GitHub"
            >
              <Github size={16} />
            </a>
            <a
              href="https://instagram.com/m.diqqq"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg border border-[#111] text-[#555] hover:text-sky-500 hover:border-sky-500 transition-all duration-200"
              aria-label="Instagram"
            >
              <Instagram size={16} />
            </a>
            <a
              href="https://wa.me/6281261443582"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg border border-[#111] text-[#555] hover:text-sky-500 hover:border-sky-500 transition-all duration-200"
              aria-label="WhatsApp"
            >
              <MessageCircle size={16} />
            </a>
          </div>

          <p className="font-mono text-xs text-[#333]">
            © {new Date().getFullYear()} · Built with React + Vite
          </p>
        </div>
      </div>
    </footer>
  );
}
