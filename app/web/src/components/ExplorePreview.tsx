import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { PoemCard } from "./PoemCard";
import { useRandomPoems, useFeaturedPoem } from "@/hooks/usePlatformData";

export function ExplorePreview() {
  const { poem: featured } = useFeaturedPoem();
  const { poems, loading } = useRandomPoems(4, featured?.id);

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-serif"
        >
          From the <span className="text-[#D4AF37]">Community</span>
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <Link
            to="/explore"
            className="flex items-center gap-2 text-[#D4AF37] hover:gap-3 transition-all"
          >
            View All <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {poems.map((poem, index) => (
            <motion.div
              key={poem.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <PoemCard poem={poem} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
