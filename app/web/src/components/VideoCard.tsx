import { useState } from "react";
import { motion } from "framer-motion";
import { Mic, Play } from "lucide-react";
import { VideoModal } from "./VideoModal";

// Use the video URL from your Supabase storage
const FEATURED_VIDEO_URL = "https://rdoeyxphajemxtkrapzx.supabase.co/storage/v1/object/public/media/Rudy%20Francisco%20-%20On%20Days%20Like%20This.mp4";

export function VideoCard() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        whileHover={{ scale: 1.02 }}
        onClick={() => setOpen(true)}
        className="relative bg-[#121214] border border-[#1f1f22] rounded-2xl overflow-hidden cursor-pointer group"
      >
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-flex items-center gap-1 bg-[#D4AF37]/10 text-[#D4AF37] text-xs px-2 py-1 rounded-full border border-[#D4AF37]/20">
            <Mic size={12} /> Spoken Word
          </span>
        </div>
        <div className="relative h-48 bg-gradient-to-br from-[#1a1a1e] to-[#0B0B0C]">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-[#D4AF37]/90 flex items-center justify-center group-hover:scale-110 transition">
              <Play size={24} className="text-black ml-0.5" />
            </div>
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-serif text-lg text-[#F5F5F5]">Echoes of the Unspoken</h3>
          <p className="text-[#A1A1AA] text-sm mt-1">Live Performance · 4:32</p>
        </div>
      </motion.div>
      <VideoModal isOpen={open} onClose={() => setOpen(false)} videoUrl={FEATURED_VIDEO_URL} />
    </>
  );
}
