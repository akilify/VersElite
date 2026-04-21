import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { PenSquare, LogOut, User, Settings } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: { label: string; path: string }[];
  session: any;
  onSignIn: () => void;
}

export function MobileMenu({
  isOpen,
  onClose,
  navItems,
  session,
  onSignIn,
}: MobileMenuProps) {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onClose();
    navigate("/");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-[#0B0B0C] border-t border-[#1f1f22] overflow-hidden"
        >
          <div className="px-6 py-4 space-y-4">
            {/* Navigation Links */}
            <nav className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className="text-[#A1A1AA] hover:text-[#D4AF37] transition py-1"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="pt-4 border-t border-[#1f1f22] space-y-3">
              {session ? (
                <>
                  <button
                    onClick={() => {
                      navigate("/create");
                      onClose();
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-[#D4AF37] text-black px-4 py-2 rounded-full text-sm font-medium"
                  >
                    <PenSquare size={16} />
                    Create New
                  </button>
                  <Link
                    to="/profile"
                    onClick={onClose}
                    className="flex items-center gap-3 text-[#A1A1AA] hover:text-[#F5F5F5] transition py-2"
                  >
                    <User size={18} /> Profile
                  </Link>
                  <Link
                    to="/settings"
                    onClick={onClose}
                    className="flex items-center gap-3 text-[#A1A1AA] hover:text-[#F5F5F5] transition py-2"
                  >
                    <Settings size={18} /> Settings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 text-red-400 hover:text-red-300 transition py-2"
                  >
                    <LogOut size={18} /> Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    onSignIn();
                    onClose();
                  }}
                  className="w-full bg-[#D4AF37] hover:bg-[#c4a02e] text-black px-4 py-2 rounded-full text-sm font-medium transition"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
