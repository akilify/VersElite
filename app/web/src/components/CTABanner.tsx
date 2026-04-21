import { motion } from "framer-motion";
import { useState } from "react";
import { AuthModal } from "./AuthModal";

export function CTABanner() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <section className="py-16 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-gradient-to-r from-[#121214] to-[#0B0B0C] border border-[#D4AF37]/30 rounded-3xl p-10 md:p-14 text-center relative overflow-hidden"
        >
          {/* Background glow */}
          <div className="absolute inset-0 bg-[#D4AF37]/5 blur-3xl" />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-serif text-[#F5F5F5] mb-4">
              Ready to share your voice?
            </h2>
            <p className="text-[#A1A1AA] mb-8 max-w-xl mx-auto">
              Join VersElite today and experience poetry as a living, breathing
              art form.
            </p>
            <button
              onClick={() => setIsOpen(true)}
              className="bg-[#D4AF37] hover:bg-[#c4a02e] text-black px-8 py-3 rounded-full font-medium text-lg transition"
            >
              Start Writing Now
            </button>
          </div>
        </motion.div>
      </section>

      <AuthModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
