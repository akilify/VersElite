import { motion } from "framer-motion";
import {
  HelpCircle,
  BookOpen,
  MessageCircle,
  Shield,
  Mail,
} from "lucide-react";
import { Link } from "react-router-dom";

const helpSections = [
  {
    icon: BookOpen,
    title: "Getting Started",
    description:
      "Learn the basics of writing, collaborating, and sharing poetry on VersElite.",
    link: "/help/getting-started",
  },
  {
    icon: Shield,
    title: "Account & Privacy",
    description: "Manage your account settings, privacy options, and security.",
    link: "/help/account",
  },
  {
    icon: MessageCircle,
    title: "Collaboration",
    description: "How to use real‑time collaboration, AI assistance, and chat.",
    link: "/help/collaboration",
  },
];

const faqs = [
  {
    q: "How do I start writing a poem?",
    a: "Click 'Create' in the header or visit the Create page after signing in.",
  },
  {
    q: "Can I collaborate with other poets?",
    a: "Yes! Join a collaboration session or start one from the Create workspace.",
  },
  {
    q: "How does AI assistance work?",
    a: "Our AI can generate poetry plans, suggest rhymes, and help you refine your work.",
  },
  {
    q: "Is VersElite free?",
    a: "Individual poems are free. Collections may be paid, with poets receiving 80% of revenue.",
  },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-[#0B0B0C] text-white">
      <div className="max-w-5xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif mb-4">
              Help <span className="text-[#D4AF37]">Center</span>
            </h1>
            <p className="text-[#A1A1AA] max-w-2xl mx-auto">
              Find answers, learn the ropes, and get the most out of VersElite.
            </p>
          </div>

          {/* Search Bar (Visual) */}
          <div className="relative max-w-2xl mx-auto mb-16">
            <input
              type="text"
              placeholder="Search for help..."
              className="w-full bg-[#121214] border border-[#1f1f22] rounded-full px-6 py-4 text-white placeholder-[#A1A1AA] focus:border-[#D4AF37] outline-none transition"
            />
            <HelpCircle
              className="absolute right-6 top-1/2 -translate-y-1/2 text-[#A1A1AA]"
              size={20}
            />
          </div>

          {/* Help Sections */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {helpSections.map((section, i) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#121214] border border-[#1f1f22] rounded-2xl p-6 hover:border-[#D4AF37]/40 transition"
              >
                <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-4">
                  <section.icon size={24} className="text-[#D4AF37]" />
                </div>
                <h3 className="font-serif text-lg text-[#F5F5F5] mb-2">
                  {section.title}
                </h3>
                <p className="text-[#A1A1AA] text-sm mb-4">
                  {section.description}
                </p>
                <Link
                  to={section.link}
                  className="text-[#D4AF37] text-sm hover:underline"
                >
                  Learn more →
                </Link>
              </motion.div>
            ))}
          </div>

          {/* FAQs */}
          <div className="mb-16">
            <h2 className="text-2xl font-serif mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-[#121214] border border-[#1f1f22] rounded-xl p-5"
                >
                  <h3 className="font-medium text-[#F5F5F5] mb-2">{faq.q}</h3>
                  <p className="text-[#A1A1AA] text-sm">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-[#121214] to-[#0B0B0C] border border-[#D4AF37]/30 rounded-2xl p-8 text-center"
          >
            <Mail size={32} className="text-[#D4AF37] mx-auto mb-4" />
            <h3 className="text-xl font-serif text-[#F5F5F5] mb-2">
              Still need help?
            </h3>
            <p className="text-[#A1A1AA] mb-6">
              Our support team is ready to assist you with any questions.
            </p>
            <a
              href="mailto:support@verselite.com"
              className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#c4a02e] text-black px-6 py-3 rounded-full font-medium transition"
            >
              <Mail size={18} /> Contact Support
            </a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
