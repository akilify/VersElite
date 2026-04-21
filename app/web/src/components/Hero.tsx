import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthModal } from "./AuthModal";
import heroBg from "@/assets/hero-background.jpg"; // 👈 Import your image

const phrases = ["Living Experience", "Shared Journey", "Spoken Truth"];

export function Hero() {
  const { scrollY } = useScroll();
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative py-32 overflow-hidden text-center">
      {/* 🖼️ Static Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="Poetry reading atmosphere"
          className="w-full h-full object-cover"
          loading="eager" // Hero image should load immediately
          fetchPriority="high"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0C]/85 via-[#0f0f11]/70 to-[#0B0B0C]/90" />
      </div>

      {/* Parallax Glow (kept from original) */}
      <motion.div
        style={{ y }}
        className="absolute w-[600px] h-[600px] bg-[#D4AF37]/10 blur-[120px] rounded-full top-[-200px] left-1/2 -translate-x-1/2 z-0"
      />

      {/* Floating particle */}
      <motion.div
        className="absolute w-2 h-2 bg-[#D4AF37] rounded-full z-10"
        animate={{ y: [0, -30, 0], opacity: [0.2, 1, 0.2] }}
        transition={{ duration: 5, repeat: Infinity }}
        style={{ top: "60%", left: "30%" }}
      />

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-20 max-w-3xl mx-auto px-6"
      >
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-6xl font-serif leading-tight"
        >
          Poetry, Reimagined as a
          <span className="text-[#D4AF37] block mt-2">
            <motion.span
              key={phraseIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="inline-block"
            >
              {phrases[phraseIndex]}
            </motion.span>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-[#A1A1AA] text-lg"
        >
          Write. Perform. Collaborate. Enter a space where words move beyond the
          page.
        </motion.p>

        <div className="h-px bg-gradient-to-r from-transparent via-[#2a2a2e] to-transparent my-16" />

        <motion.div
          className="mt-10 flex justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="bg-[#D4AF37] hover:bg-[#c4a02e] text-black px-6 py-3 rounded-full font-medium transition"
          >
            Start Writing
          </button>
          <button
            onClick={() => navigate("/explore")}
            className="border border-[#2a2a2e] hover:border-[#D4AF37] px-6 py-3 rounded-full text-[#F5F5F5] transition"
          >
            Explore Poems
          </button>
        </motion.div>
      </motion.div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </section>
  );
}
