import { motion } from "framer-motion";
import { ArrowDown, Github, Instagram, MessageCircle } from "lucide-react";

export default function Hero() {
  const profilePhoto = `${import.meta.env.BASE_URL}sidiq.jpeg`;

  const socials = [
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
      label: "WhatsApp",
    },
  ];

  return (
    <section
      id="hero"
      className="relative flex min-h-[92vh] items-center justify-center overflow-hidden px-4 pb-16 pt-20"
    >
      <div className="dot-grid absolute inset-0 opacity-55" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-sky-500/10 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mb-6 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="font-sans text-xs font-semibold text-slate-200">
                Open for Collaboration
              </span>
            </motion.div>

            <h1 className="mb-5 font-display text-5xl font-extrabold leading-[0.95] text-white md:text-7xl">
              Muhamad <span className="text-sky-300">Sidiq</span>
            </h1>

            <p className="mb-3 max-w-xl font-display text-base leading-relaxed text-slate-300 md:text-xl">
              Informatics Student at{" "}
              <span className="font-semibold text-white">
                Universitas Andalas
              </span>
            </p>
            <p className="mb-8 text-sm text-slate-500">
              NIM: 2411533011 / Padang, Sumatera Barat
            </p>

            <div className="mb-8 flex flex-wrap gap-3">
              <button
                onClick={() =>
                  document
                    .querySelector("#contact")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="flex items-center gap-2 rounded-lg bg-sky-400 px-5 py-3 text-sm font-bold text-slate-950 transition-all duration-200 hover:bg-sky-300"
              >
                Contact Me <ArrowDown size={15} />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 font-sans text-xs text-slate-400 transition-colors hover:border-sky-300/40 hover:text-white"
                >
                  {social.icon}
                  <span>{social.label}</span>
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative">
              <div className="relative aspect-[4/5] w-64 overflow-hidden rounded-lg border border-white/10 bg-white/5 shadow-2xl shadow-sky-950/30 md:w-80">
                <img
                  src={profilePhoto}
                  alt="Muhamad Sidiq"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 to-transparent" />
              </div>

              <div className="absolute -bottom-3 -right-3 rounded-lg border border-white/10 bg-slate-950/80 px-4 py-2 backdrop-blur-md">
                <p className="font-sans text-xs font-bold text-sky-200">
                  UNAND '24
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
