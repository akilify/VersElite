import { motion } from "framer-motion";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0B0B0C] text-white">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-serif mb-4">
            Privacy <span className="text-[#D4AF37]">Policy</span>
          </h1>
          <p className="text-[#A1A1AA] mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-invert prose-gold max-w-none">
            <p className="text-[#A1A1AA] leading-relaxed">
              At VersElite, we believe your words belong to you. This Privacy Policy explains how we collect,
              use, and protect your personal information when you use our platform.
            </p>

            <h2 className="text-xl font-serif text-[#F5F5F5] mt-8 mb-4">1. Information We Collect</h2>
            <p className="text-[#A1A1AA] leading-relaxed">
              We collect information you provide directly, such as your name, email address, and any content
              you create on VersElite. We also collect usage data to improve your experience.
            </p>

            <h2 className="text-xl font-serif text-[#F5F5F5] mt-8 mb-4">2. How We Use Your Information</h2>
            <p className="text-[#A1A1AA] leading-relaxed">
              We use your information to provide and improve our services, communicate with you, and ensure
              the security of our platform. We never sell your personal data.
            </p>

            <h2 className="text-xl font-serif text-[#F5F5F5] mt-8 mb-4">3. Your Rights</h2>
            <p className="text-[#A1A1AA] leading-relaxed">
              You have the right to access, correct, or delete your personal information. You can also request
              a copy of your data or ask us to stop processing it.
            </p>

            <h2 className="text-xl font-serif text-[#F5F5F5] mt-8 mb-4">4. Contact Us</h2>
            <p className="text-[#A1A1AA] leading-relaxed">
              If you have questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:privacy@verselite.com" className="text-[#D4AF37] hover:underline">
                privacy@verselite.com
              </a>.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
