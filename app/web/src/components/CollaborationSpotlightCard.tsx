import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "@/features/auth/AuthProvider";
import { AuthModal } from "./AuthModal";
import { useOnlinePresence } from "@/hooks/usePlatformData";

export function CollaborationSpotlightCard() {
  const navigate = useNavigate();
  const { session } = useContext(AuthContext);
  const [authOpen, setAuthOpen] = useState(false);
  const { onlineCount } = useOnlinePresence("demo-id");

  const handleClick = () => {
    if (session) {
      navigate("/collab/demo-id");
    } else {
      setAuthOpen(true);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.02 }}
        onClick={handleClick}
        className="relative bg-[#121214] border border-[#1f1f22] rounded-2xl p-6 cursor-pointer group overflow-hidden"
      >
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center gap-1 bg-[#D4AF37]/10 text-[#D4AF37] text-xs px-2 py-1 rounded-full border border-[#D4AF37]/20">
            <Users size={12} /> Live Collaboration
          </span>
        </div>
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="relative">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75" />
            </div>
            <span className="text-[#F5F5F5] text-sm">
              {onlineCount > 0 ? `${onlineCount} poet${onlineCount !== 1 ? "s" : ""} online` : "Be the first online"}
            </span>
          </div>
          <h3 className="text-xl font-serif text-[#F5F5F5] group-hover:text-[#D4AF37] transition">
            Midnight Draft
          </h3>
          <p className="text-[#A1A1AA] mt-3">
            Join an open collaboration and shape a poem together in real time.
          </p>
          <div className="mt-6 text-[#D4AF37] text-sm font-medium">
            {session ? "Join session →" : "Sign in to join →"}
          </div>
        </div>
        <div className="absolute inset-0 bg-[#D4AF37]/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
      </motion.div>
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
