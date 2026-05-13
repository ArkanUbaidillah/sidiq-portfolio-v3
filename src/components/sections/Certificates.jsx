import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Award, ExternalLink } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("certificates")
      .select("*")
      .then(({ data, error }) => {
        if (error) {
          console.error("Failed to load certificates:", error.message);
        }
        setCertificates(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <section id="certificates" className="py-24 px-4 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <p className="font-mono text-xs text-sky-500 uppercase tracking-widest mb-2">
          04. Certificates
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-bold">
          Achievements
        </h2>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bento-card h-40 animate-pulse" />
          ))}
        </div>
      ) : certificates.length === 0 ? (
        <div className="bento-card p-12 text-center">
          <Award size={32} className="text-[#333] mx-auto mb-3" />
          <p className="font-mono text-sm text-[#444]">
            Sertifikat akan ditampilkan di sini.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {certificates.map((cert, i) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bento-card p-5"
            >
              {cert.image_url && (
                <div className="w-full h-28 rounded-lg overflow-hidden mb-3 bg-[#0a0a0a]">
                  <img
                    src={cert.image_url}
                    alt={cert.title}
                    className="w-full h-full object-cover opacity-80"
                  />
                </div>
              )}
              <div className="flex items-start gap-2">
                <Award size={14} className="text-sky-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-display font-semibold text-white text-sm">
                    {cert.title}
                  </p>
                  <p className="font-mono text-xs text-[#555] mt-1">
                    {cert.issuer}
                  </p>
                  {cert.issued_date && (
                    <p className="font-mono text-xs text-[#333] mt-0.5">
                      {new Date(cert.issued_date).toLocaleDateString("id-ID", {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </div>
              {cert.credential_url && (
                <a
                  href={cert.credential_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 font-mono text-xs text-[#444] hover:text-sky-500 transition-colors mt-3"
                >
                  <ExternalLink size={11} /> Lihat Kredensial
                </a>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
