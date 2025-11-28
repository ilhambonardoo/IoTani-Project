import { motion, Variants } from "framer-motion";
import { LuBrainCircuit, LuDroplets, LuLayoutDashboard } from "react-icons/lu";

const features = [
  {
    icon: LuLayoutDashboard,
    title: "Dashboard Real-time",
    description: "Pantau data pH, kelembapan, dan suhu tanah secara langsung kapanpun dan dimanapun dengan update real-time.",
    color: "green",
    gradient: "from-green-500 to-emerald-500",
    bgGradient: "from-green-50 to-emerald-50",
  },
  {
    icon: LuDroplets,
    title: "Kontrol Pompa Otomatis",
    description: "Sistem irigasi cerdas yang menyiram tanaman secara otomatis berdasarkan kondisi kelembapan tanah.",
    color: "blue",
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50",
  },
  {
    icon: LuBrainCircuit,
    title: "Deteksi Tanaman (AI)",
    description: "Manfaatkan Machine Learning dan Robotik untuk identifikasi kondisi tanaman secara presisi dan akurat.",
    color: "orange",
    gradient: "from-orange-500 to-amber-500",
    bgGradient: "from-orange-50 to-amber-50",
  },
];

const FeatureSection = () => {
  const featureContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const featureItemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <section className="relative py-20 sm:py-24 md:py-32 bg-gradient-to-b from-white via-neutral-50/50 to-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-green-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16 sm:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.span
            className="inline-block mb-4 text-sm font-semibold text-green-600 uppercase tracking-wider"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            Fitur Unggulan
          </motion.span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-neutral-900 tracking-tight mb-6">
            <span className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 bg-clip-text text-transparent">
              Teknologi Cerdas
            </span>
            <br />
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              untuk Pertanian Modern
            </span>
          </h2>
          <p className="mx-auto max-w-3xl text-lg sm:text-xl text-neutral-600 leading-relaxed font-medium">
            Dibangun dengan teknologi terkini untuk memberikan hasil presisi dan
            efisiensi maksimal di lahan Anda.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-8 sm:gap-10 md:grid-cols-3"
          variants={featureContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                className="group relative flex flex-col rounded-3xl border border-neutral-200/80 bg-white/80 backdrop-blur-sm p-8 shadow-lg shadow-neutral-200/50 transition-all duration-500 hover:shadow-2xl hover:shadow-neutral-300/50 hover:-translate-y-2"
                variants={featureItemVariants}
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />
                
                {/* Icon */}
                <div className={`relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg shadow-${feature.color}-500/25 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  <Icon className="text-white" size={28} />
                </div>

                {/* Content */}
                <h3 className="mb-4 text-2xl font-bold text-neutral-900 leading-tight">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed text-base">
                  {feature.description}
                </p>

                {/* Decorative element */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-3xl`} />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureSection;
