import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Menu, Sparkles, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Praktikum", href: "#praktikum" },
  { label: "Certificates", href: "#certificates" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleNav = (href) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
          scrolled
            ? "border-white/10 bg-[#080b12]/85 backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-sky-300">
              <Sparkles size={17} />
            </span>
            <span className="font-display text-sm font-bold text-white">
              sidiq.dev
            </span>
          </div>

          <ul className="hidden items-center gap-7 md:flex">
            {navLinks.map((link) => (
              <li key={link.label}>
                <button
                  onClick={() => handleNav(link.href)}
                  className="font-sans text-xs font-semibold text-slate-400 transition-colors duration-200 hover:text-white"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          <Link
            to="/sidiq-admin"
            className="hidden rounded-lg border border-sky-400/30 bg-sky-400/10 px-4 py-2 font-sans text-xs font-bold text-sky-100 transition-colors duration-200 hover:bg-sky-400/20 md:flex"
          >
            Admin
          </Link>

          <button
            className="rounded-lg border border-white/10 p-2 text-sky-200 md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed left-0 right-0 top-[68px] z-40 border-b border-white/10 bg-[#080b12]/95 p-6 backdrop-blur-xl"
          >
            <ul className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleNav(link.href)}
                    className="w-full border-b border-white/10 py-3 text-left font-sans text-sm font-semibold text-slate-300 transition-colors last:border-0 hover:text-white"
                  >
                    <span className="mr-2 text-sky-300">/</span>
                    {link.label}
                  </button>
                </li>
              ))}
              <li>
                <Link
                  to="/sidiq-admin"
                  className="mt-2 block rounded-lg bg-sky-400 px-4 py-2 text-center font-sans text-sm font-bold text-slate-950"
                >
                  Admin Panel
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
