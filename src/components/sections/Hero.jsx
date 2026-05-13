import { motion } from "framer-motion";
import { Github, Instagram, MessageCircle } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 pt-24"
    >
      {/* Background grid */}
      <div className="absolute inset-0 dot-grid opacity-30" />

      {/* Emerald orb blur */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-500/30 bg-sky-500/5 mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
              <span className="font-sans text-xs font-medium text-sky-500">
                Open for Collaboration
              </span>
            </motion.div>

            {/* Typewriter */}
            <h1 className="font-display text-3xl md:text-5xl font-bold leading-tight mb-4 text-white">
              <span className="text-sky-500">Muhamad Sidiq</span>
            </h1>

            <p className="text-[#aaa] text-base md:text-lg mb-2 font-display">
              Informatics Student at{" "}
              <span className="text-white font-semibold">
                Universitas Andalas
              </span>
            </p>
            <p className="text-[#555] text-sm font-mono mb-8">
              NIM: 2411533011 · Padang, Sumatera Barat
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              <button
                onClick={() =>
                  document
                    .querySelector("#contact")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 text-white font-mono text-sm font-bold rounded-xl hover:bg-sky-500 transition-all duration-200"
              >
                Contact Me
              </button>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-3">
              {[
                {
                  href: "https://github.com/MSIDIQ472",
                  icon: <Github size={16} />,
                  label: "GitHub",
                },
                {
                  href: "https://instagram.com/m.diqqq",
                  icon: <Instagram size={16} />,
                  label: "@m.diqqq",
                },
                {
                  href: "https://wa.me/6281261443582",
                  icon: <MessageCircle size={16} />,
                  label: "WA",
                },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 font-sans text-xs text-[#555] hover:text-sky-500 transition-colors"
                >
                  {social.icon}
                  <span>{social.label}</span>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right: Profile photo slot */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex justify-center lg:justify-end relative"
          >
            <div className="relative">
              {/* Photo container */}
              <div className="relative w-56 h-56 md:w-72 md:h-72 rounded-2xl overflow-hidden border border-[#222] shadow-2xl">
                {/* Placeholder - replace src with actual photo */}
                <img
                  src="/sidiq/sidiq.jpeg"
                  alt="Muhamad Sidiq"
                  className="w-full h-full object-cover"
                />
                {/* Overlay tint */}
                <div className="absolute inset-0 bg-gradient-to-t from-sky-900/20 to-transparent" />
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-2 -right-2 bg-white/5 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg">
                <p className="font-sans text-xs text-sky-500 font-medium">
                  UNAND '24
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="font-sans text-[10px] text-[#333] uppercase tracking-[0.2em]">
            Scroll
          </span>
          <div className="w-px h-12 bg-gradient-to-b from-sky-500/50 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
