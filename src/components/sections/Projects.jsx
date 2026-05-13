import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github, FolderOpen } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setProjects(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <section id="projects" className="py-24 px-4 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <p className="font-mono text-xs text-sky-500 uppercase tracking-widest mb-2">
          02. Projects
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-bold">
          What I've Built
        </h2>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bento-card h-56 animate-pulse">
              <div className="h-full bg-[#0a0a0a]" />
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="bento-card p-12 text-center">
          <FolderOpen size={32} className="text-[#333] mx-auto mb-3" />
          <p className="font-mono text-sm text-[#444]">
            Proyek akan ditampilkan di sini.
          </p>
          <p className="font-mono text-xs text-[#333] mt-1">
            Admin dapat menambahkan via dashboard.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bento-card p-5 flex flex-col"
            >
              {project.thumbnail_url && (
                <div className="w-full h-36 rounded-lg overflow-hidden mb-4 bg-[#0a0a0a]">
                  <img
                    src={project.thumbnail_url}
                    alt={project.title}
                    className="w-full h-full object-cover opacity-80"
                  />
                </div>
              )}
              <h3 className="font-display font-semibold text-white mb-2">
                {project.title}
              </h3>
              <p className="text-[#666] text-xs leading-relaxed mb-3 flex-1">
                {project.description}
              </p>
              {project.tech_stack && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.tech_stack.map((tech) => (
                    <span
                      key={tech}
                      className="font-mono text-xs px-2 py-0.5 rounded bg-sky-500/10 text-sky-500 border border-sky-500/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-3">
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 font-mono text-xs text-[#555] hover:text-sky-500 transition-colors"
                  >
                    <Github size={13} /> Code
                  </a>
                )}
                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 font-mono text-xs text-[#555] hover:text-sky-500 transition-colors"
                  >
                    <ExternalLink size={13} /> Live
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
