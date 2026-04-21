import { motion } from "framer-motion";

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[#0B0B0C] text-white">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-serif mb-4">
            Cookie <span className="text-[#D4AF37]">Policy</span>
          </h1>
          <p className="text-[#A1A1AA] mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="prose prose-invert prose-gold max-w-none">
            <p className="text-[#A1A1AA] leading-relaxed">
              VersElite uses cookies to enhance your experience. This policy
              explains what cookies are, how we use them, and your choices.
            </p>

            <h2 className="text-xl font-serif text-[#F5F5F5] mt-8 mb-4">
              What Are Cookies?
            </h2>
            <p className="text-[#A1A1AA] leading-relaxed">
              Cookies are small text files stored on your device when you visit
              a website. They help us remember your preferences and understand
              how you interact with VersElite.
            </p>

            <h2 className="text-xl font-serif text-[#F5F5F5] mt-8 mb-4">
              How We Use Cookies
            </h2>
            <p className="text-[#A1A1AA] leading-relaxed">
              We use essential cookies to keep you logged in and remember your
              settings. We also use analytics cookies to improve our platform,
              but only with your consent.
            </p>

            <h2 className="text-xl font-serif text-[#F5F5F5] mt-8 mb-4">
              Managing Cookies
            </h2>
            <p className="text-[#A1A1AA] leading-relaxed">
              You can control and delete cookies through your browser settings.
              Note that disabling essential cookies may affect the functionality
              of VersElite.
            </p>

            <h2 className="text-xl font-serif text-[#F5F5F5] mt-8 mb-4">
              Third-Party Cookies
            </h2>
            <p className="text-[#A1A1AA] leading-relaxed">
              Some third-party services we use (like analytics or embedded
              videos) may set their own cookies. We encourage you to review
              their policies.
            </p>

            <h2 className="text-xl font-serif text-[#F5F5F5] mt-8 mb-4">
              Updates to This Policy
            </h2>
            <p className="text-[#A1A1AA] leading-relaxed">
              We may update this Cookie Policy from time to time. Changes will
              be posted on this page.
            </p>

            <h2 className="text-xl font-serif text-[#F5F5F5] mt-8 mb-4">
              Contact Us
            </h2>
            <p className="text-[#A1A1AA] leading-relaxed">
              Questions about cookies? Email us at{" "}
              <a
                href="mailto:privacy@verselite.com"
                className="text-[#D4AF37] hover:underline"
              >
                privacy@verselite.com
              </a>
              .
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
