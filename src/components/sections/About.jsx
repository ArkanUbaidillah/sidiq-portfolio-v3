import { motion } from "framer-motion";
import { Code2, Cpu, BookOpen, Zap } from "lucide-react";

const skills = [
  { category: "Technical Skills", items: ["Java", "HTML", "CSS", "Git"] },
];

const stats = [
  { value: "2024", label: "Angkatan", icon: <BookOpen size={16} /> },
  { value: "2.0+", label: "Tahun Belajar", icon: <Zap size={16} /> },
  { value: "S1", label: "Program Studi", icon: <Cpu size={16} /> },
  { value: "∞", label: "Semangat Belajar", icon: <Code2 size={16} /> },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export default function About() {
  return (
    <section id="about" className="py-24 px-4 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <p className="font-sans text-xs font-semibold text-sky-500 uppercase tracking-wider mb-2">
          01. About
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-bold">
          Who I Am
        </h2>
      </motion.div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Bio card - spans 2 cols */}
        <motion.div
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={cardVariants}
          className="bento-card md:col-span-2 p-6"
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
              <Code2 size={16} className="text-sky-500" />
            </div>
            <h3 className="font-sans text-sm font-bold text-sky-500 uppercase tracking-wider pt-1">
              Bio
            </h3>
          </div>
          <p className="text-[#aaa] text-sm leading-relaxed mb-3">
            Halo! Saya <strong className="text-white">Muhamad Sidiq</strong>,
            mahasiswa Informatika di{" "}
            <span className="text-sky-500">Universitas Andalas</span> angkatan
            2024. Saya memiliki ketertarikan mendalam di bidang pengembangan web
            full-stack dan selalu antusias mempelajari teknologi baru.
          </p>
          <p className="text-[#666] text-sm leading-relaxed">
            Selain kuliah, saya aktif mengerjakan proyek-proyek pribadi untuk
            mengasah kemampuan teknis, mulai dari membangun sistem manajemen
            data hingga aplikasi web terintegrasi API.
          </p>
        </motion.div>

        {/* Stats card */}
        <motion.div
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={cardVariants}
          className="bento-card p-6"
        >
          <h3 className="font-sans text-xs font-bold text-[#444] uppercase tracking-wider mb-4">
            Stats
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <div className="flex items-center gap-1 text-sky-500/60">
                  {stat.icon}
                </div>
                <p className="font-display text-xl font-bold text-white">
                  {stat.value}
                </p>
                <p className="font-sans text-xs text-[#444]">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Skills card - full width */}
        <motion.div
          custom={2}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={cardVariants}
          className="bento-card md:col-span-3 p-6"
        >
          <h3 className="font-sans text-xs font-bold text-[#444] uppercase tracking-wider mb-5">
            Tech Stack
          </h3>
          <div className="flex flex-wrap gap-12">
            {skills.map((group) => (
              <div key={group.category}>
                <p className="font-sans text-xs font-bold text-sky-500 mb-3">
                  {group.category}
                </p>
                <div className="flex flex-wrap gap-4">
                  {group.items.map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-sky-500/50" />
                      <span className="font-sans text-sm text-[#888]">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
