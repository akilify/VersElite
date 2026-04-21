import { motion } from "framer-motion";
import { usePlatformStats } from "@/hooks/usePlatformData";
import { Sparkles, Users } from "lucide-react";

export function PlatformStats() {
  const { stats, loading } = usePlatformStats();

  return (
    <section className="py-20 px-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <h2 className="text-3xl font-serif mb-4">
          Growing <span className="text-[#D4AF37]">Together</span>
        </h2>
        <p className="text-[#A1A1AA] mb-12 max-w-2xl mx-auto">
          Join a community of poets sharing their voice. Every number here is real.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-[#121214] border border-[#1f1f22] rounded-2xl p-8"
          >
            <Sparkles size={32} className="text-[#D4AF37] mx-auto mb-4" />
            <div className="text-4xl font-serif text-[#F5F5F5]">
              {loading ? "..." : stats.poems}
            </div>
            <p className="text-[#A1A1AA] mt-2">Poems Published</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-[#121214] border border-[#1f1f22] rounded-2xl p-8"
          >
            <Users size={32} className="text-[#D4AF37] mx-auto mb-4" />
            <div className="text-4xl font-serif text-[#F5F5F5]">
              {loading ? "..." : stats.users}
            </div>
            <p className="text-[#A1A1AA] mt-2">Poets Joined</p>
          </motion.div>
        </div>

        <p className="text-sm text-[#A1A1AA] mt-8 italic">
          "Join me in building a new home for poetry." — Founder
        </p>
      </motion.div>
    </section>
  );
}
