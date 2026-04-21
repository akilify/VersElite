import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Menu, X, Home, Compass, Calendar, User, Sparkles } from "lucide-react";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/explore", icon: Compass, label: "Explore" },
  { to: "/events", icon: Calendar, label: "Events" },
  { to: "/about", icon: User, label: "About" },
];

export function FloatingNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed top-6 right-6 z-40">
      {/* Trigger button – smaller, more subtle */}
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-[#121214]/80 backdrop-blur-sm border border-[#2a2a2e] text-[#A1A1AA] hover:text-[#D4AF37] hover:border-[#D4AF37]/50 shadow-sm flex items-center justify-center transition-all duration-200"
        aria-label="Menu"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-12 right-0 bg-[#121214] border border-[#1f1f22] rounded-xl p-1.5 shadow-lg min-w-[160px] backdrop-blur-sm"
          >
            <nav className="flex flex-col gap-0.5">
              {navItems.map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#A1A1AA] hover:bg-[#1f1f22] hover:text-[#D4AF37] transition"
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </Link>
              ))}
              <div className="h-px bg-[#1f1f22] my-1" />
              <Link
                to="/create"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#D4AF37] hover:bg-[#1f1f22] transition"
              >
                <Sparkles size={16} />
                <span className="font-medium">Create</span>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
