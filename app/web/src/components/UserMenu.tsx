import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "@/features/auth/AuthProvider";
import { supabase } from "@/lib/supabase";
import { User, Settings, LogOut, Sparkles } from "lucide-react";

export function UserMenu() {
  const { session } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsOpen(false);
    navigate("/");
  };

  const userInitial = session?.user?.email?.[0].toUpperCase() || "U";

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#b08c2c] flex items-center justify-center text-black font-medium hover:scale-105 transition"
      >
        {userInitial}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-56 bg-[#121214] border border-[#1f1f22] rounded-xl shadow-xl overflow-hidden"
          >
            <div className="p-3 border-b border-[#1f1f22]">
              <p className="text-sm text-[#F5F5F5] truncate">{session?.user?.email}</p>
            </div>
            <div className="py-1">
              <button
                onClick={() => { navigate("/profile"); setIsOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[#A1A1AA] hover:bg-[#1f1f22] hover:text-[#F5F5F5] transition"
              >
                <User size={16} /> Profile
              </button>
              <button
                onClick={() => { navigate("/settings"); setIsOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[#A1A1AA] hover:bg-[#1f1f22] hover:text-[#F5F5F5] transition"
              >
                <Settings size={16} /> Settings
              </button>
              <button
                onClick={() => { navigate("/create"); setIsOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[#D4AF37] hover:bg-[#1f1f22] transition"
              >
                <Sparkles size={16} /> Create New
              </button>
            </div>
            <div className="border-t border-[#1f1f22] py-1">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-[#1f1f22] transition"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
