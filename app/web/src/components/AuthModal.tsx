import { useState, useContext, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User } from "lucide-react";
import { AuthContext } from "@/features/auth/AuthProvider";
import { signIn, signUp } from "@/features/auth/auth.api";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMessage?: string;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  const { session } = useContext(AuthContext);

  // Close modal if user becomes authenticated
  useEffect(() => {
    if (session) {
      onClose();
    }
  }, [session, onClose]);

  // Handle Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "signin") {
        await signIn(email, password);
      } else {
        await signUp(email, password, fullName);
      }
      // onClose will be triggered by useEffect when session appears
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === "signin" ? "signup" : "signin");
    setError("");
  };

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            ref={modalRef}
            className="relative w-full max-w-md bg-[#121214] border border-[#1f1f22] rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#1f1f22] text-[#A1A1AA] hover:text-white hover:bg-[#2a2a2e] transition"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="p-6">
              <h2 className="text-2xl font-serif text-[#F5F5F5] mb-6">
                {mode === "signin" ? "Welcome Back" : "Join VersElite"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "signup" && (
                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA]"
                      size={18}
                    />
                    <input
                      type="text"
                      placeholder="Full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required={mode === "signup"}
                      className="w-full bg-[#0B0B0C] border border-[#1f1f22] rounded-lg pl-10 pr-3 py-3 text-white placeholder-[#A1A1AA] focus:border-[#D4AF37] outline-none transition"
                    />
                  </div>
                )}

                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA]"
                    size={18}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-[#0B0B0C] border border-[#1f1f22] rounded-lg pl-10 pr-3 py-3 text-white placeholder-[#A1A1AA] focus:border-[#D4AF37] outline-none transition"
                  />
                </div>

                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA]"
                    size={18}
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full bg-[#0B0B0C] border border-[#1f1f22] rounded-lg pl-10 pr-3 py-3 text-white placeholder-[#A1A1AA] focus:border-[#D4AF37] outline-none transition"
                  />
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#D4AF37] hover:bg-[#c4a02e] text-black font-medium py-3 rounded-lg transition disabled:opacity-50"
                >
                  {loading
                    ? "Processing..."
                    : mode === "signin"
                      ? "Sign In"
                      : "Create Account"}
                </button>
              </form>

              <p className="mt-4 text-center text-sm text-[#A1A1AA]">
                {mode === "signin"
                  ? "Don't have an account?"
                  : "Already have an account?"}{" "}
                <button
                  onClick={toggleMode}
                  className="text-[#D4AF37] hover:underline font-medium"
                >
                  {mode === "signin" ? "Sign Up" : "Sign In"}
                </button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
