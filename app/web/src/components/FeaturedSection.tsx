import { motion } from "framer-motion";
import { FeaturedPoemCard } from "./FeaturedPoemCard";
import { VideoCard } from "./VideoCard";
import { CollaborationSpotlightCard } from "./CollaborationSpotlightCard";
import { useFeaturedPoem } from "@/hooks/usePlatformData";
import { Loader2 } from "lucide-react";

export function FeaturedSection() {
  const { poem, loading } = useFeaturedPoem();

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl font-serif text-center mb-12"
      >
        Featured <span className="text-[#D4AF37]">Voices</span>
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
          </div>
        ) : (
          <>
            {poem && <FeaturedPoemCard poem={poem} />}
            <VideoCard />
            <CollaborationSpotlightCard />
          </>
        )}
      </div>
    </section>
  );
}
