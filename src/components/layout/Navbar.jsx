import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Terminal } from "lucide-react";

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
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`sticky top-0 z-50 w-full transition-all duration-300 border-b border-[#111] ${
          scrolled ? "bg-black/80 backdrop-blur-md" : "bg-black"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Terminal size={18} className="text-sky-500" />
            <span className="font-mono text-sm font-bold text-sky-500">
              sidiq.dev
            </span>
          </div>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.label}>
                <button
                  onClick={() => handleNav(link.href)}
                  className="font-mono text-xs text-[#666] hover:text-sky-500 transition-colors duration-200 uppercase tracking-widest"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <a
            href="/sidiq-admin"
            className="hidden md:flex items-center gap-1 font-mono text-xs text-white bg-sky-600 px-3 py-1.5 rounded-lg hover:bg-sky-500 transition-colors duration-200"
          >
            Admin
          </a>

          {/* Hamburger */}
          <button
            className="md:hidden text-sky-500 p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed top-[64px] left-0 right-0 z-40 bg-black border-b border-[#111] p-6"
          >
            <ul className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleNav(link.href)}
                    className="w-full text-left font-mono text-sm text-[#aaa] hover:text-sky-500 transition-colors py-2 border-b border-[#111] last:border-0"
                  >
                    <span className="text-sky-500 mr-2">›</span>
                    {link.label}
                  </button>
                </li>
              ))}
              <li>
                <a
                  href="/sidiq-admin"
                  className="block text-center font-mono text-sm text-white bg-sky-600 px-4 py-2 rounded-lg"
                >
                  Admin Panel
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
