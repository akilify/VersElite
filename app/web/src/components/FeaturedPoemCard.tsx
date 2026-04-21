import { useState } from "react";
import { motion } from "framer-motion";
import { Feather } from "lucide-react";
import { PoemModal } from "./PoemModal";

import type { Poem } from "@/types";
export function FeaturedPoemCard({ poem }: { poem: Poem }) {
  const [open, setOpen] = useState(false);

  const authorName =
    poem.profiles?.full_name || poem.profiles?.username || "Anonymous";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.02 }}
        onClick={() => setOpen(true)}
        className="relative bg-[#121214] border border-[#1f1f22] rounded-2xl p-6 cursor-pointer group overflow-hidden"
      >
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center gap-1 bg-[#D4AF37]/10 text-[#D4AF37] text-xs px-2 py-1 rounded-full border border-[#D4AF37]/20">
            <Feather size={12} /> Featured
          </span>
        </div>
        <div className="mt-8">
          <h3 className="text-xl font-serif text-[#F5F5F5] group-hover:text-[#D4AF37] transition">
            {poem.title}
          </h3>
          <p className="text-[#A1A1AA] mt-3 line-clamp-3">{poem.content}</p>
          <div className="mt-4 text-sm text-[#D4AF37]">— {authorName}</div>
        </div>
        <div className="absolute inset-0 bg-[#D4AF37]/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
      </motion.div>
      <PoemModal poem={poem} isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
