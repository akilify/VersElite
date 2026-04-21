import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "@/features/auth/AuthProvider";
import { AuthModal } from "./AuthModal";
import { UserMenu } from "./UserMenu";
import { MobileMenu } from "./MobileMenu";
import { PenSquare, Menu, X } from "lucide-react";

export function Header() {
  const { session } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Explore", path: "/explore" },
    { label: "Events", path: "/events" },
    { label: "About", path: "/about" },
  ];

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-[#0B0B0C]/80 backdrop-blur-md border-b border-[#1f1f22]"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-xl font-serif tracking-wide text-[#D4AF37] hover:text-[#c4a02e] transition">
            VersElite
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm text-[#A1A1AA]">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="hover:text-[#D4AF37] transition"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <>
                <button
                  onClick={() => navigate("/create")}
                  className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#c4a02e] text-black px-4 py-2 rounded-full text-sm font-medium transition"
                >
                  <PenSquare size={16} />
                  Create
                </button>
                <UserMenu />
              </>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-[#D4AF37] hover:bg-[#c4a02e] text-black px-4 py-2 rounded-full text-sm font-medium transition"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#A1A1AA] hover:text-[#D4AF37] hover:bg-[#1f1f22] transition"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          navItems={navItems}
          session={session}
          onSignIn={() => setIsAuthModalOpen(true)}
        />
      </motion.header>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}
