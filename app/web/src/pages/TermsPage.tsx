import { motion } from "framer-motion";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0B0B0C] text-white">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-serif mb-4">
            Terms of <span className="text-[#D4AF37]">Service</span>
          </h1>
          <p className="text-[#A1A1AA] mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="prose prose-invert prose-gold max-w-none">
            <p className="text-[#A1A1AA] leading-relaxed">
              Welcome to VersElite. By using our platform, you agree to these
              terms. Please read them carefully.
            </p>

            <h2 className="text-xl font-serif text-[#F5F5F5] mt-8 mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-[#A1A1AA] leading-relaxed">
              By accessing or using VersElite, you agree to be bound by these
              Terms of Service and all applicable laws. If you do not agree, you
              may not use our services.
            </p>

            <h2 className="text-xl font-serif text-[#F5F5F5] mt-8 mb-4">
              2. User Content
            </h2>
            <p className="text-[#A1A1AA] leading-relaxed">
              You retain ownership of the poems and content you create on
              VersElite. By posting content, you grant us a limited license to
              display and distribute it within the platform.
            </p>

            <h2 className="text-xl font-serif text-[#F5F5F5] mt-8 mb-4">
              3. Prohibited Conduct
            </h2>
            <p className="text-[#A1A1AA] leading-relaxed">
              You agree not to post harmful, abusive, or infringing content. We
              reserve the right to remove content and suspend accounts that
              violate these terms.
            </p>

            <h2 className="text-xl font-serif text-[#F5F5F5] mt-8 mb-4">
              4. Termination
            </h2>
            <p className="text-[#A1A1AA] leading-relaxed">
              We may terminate or suspend your account at any time for violation
              of these terms. Upon termination, your right to use the platform
              ceases immediately.
            </p>

            <h2 className="text-xl font-serif text-[#F5F5F5] mt-8 mb-4">
              5. Disclaimer
            </h2>
            <p className="text-[#A1A1AA] leading-relaxed">
              VersElite is provided "as is" without warranties of any kind. We
              are not liable for any damages arising from your use of the
              platform.
            </p>

            <h2 className="text-xl font-serif text-[#F5F5F5] mt-8 mb-4">
              6. Contact
            </h2>
            <p className="text-[#A1A1AA] leading-relaxed">
              Questions about these Terms? Reach out to{" "}
              <a
                href="mailto:legal@verselite.com"
                className="text-[#D4AF37] hover:underline"
              >
                legal@verselite.com
              </a>
              .
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
