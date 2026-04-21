import { motion } from "framer-motion";
import { Heart, Shield, Users, Sparkles, AlertCircle } from "lucide-react";

const principles = [
  {
    icon: Heart,
    title: "Respect Every Voice",
    description:
      "We celebrate diversity of expression. Treat all members with kindness and empathy.",
  },
  {
    icon: Shield,
    title: "Safe Creative Space",
    description:
      "Harassment, hate speech, and bullying have no place here. We actively moderate content.",
  },
  {
    icon: Users,
    title: "Collaborative Spirit",
    description:
      "Give credit where it's due. When collaborating, honor each contributor's work.",
  },
  {
    icon: Sparkles,
    title: "Original Work",
    description:
      "Share your own poetry. Plagiarism violates our community trust and may result in removal.",
  },
];

const rules = [
  "No hate speech, harassment, or discrimination of any kind.",
  "Do not post content that infringes on others' copyright or intellectual property.",
  "Respect privacy — do not share personal information without consent.",
  "Keep feedback constructive and encouraging.",
  "Report inappropriate content rather than engaging with it.",
  "Follow all applicable laws and regulations.",
];

export default function GuidelinesPage() {
  return (
    <div className="min-h-screen bg-[#0B0B0C] text-white">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif mb-4">
              Community <span className="text-[#D4AF37]">Guidelines</span>
            </h1>
            <p className="text-[#A1A1AA] max-w-2xl mx-auto">
              VersElite is a home for poets. These guidelines help keep our
              community safe, respectful, and inspiring.
            </p>
          </div>

          {/* Principles Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {principles.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#121214] border border-[#1f1f22] rounded-2xl p-6"
              >
                <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-4">
                  <p.icon size={24} className="text-[#D4AF37]" />
                </div>
                <h3 className="font-serif text-lg text-[#F5F5F5] mb-2">
                  {p.title}
                </h3>
                <p className="text-[#A1A1AA] text-sm leading-relaxed">
                  {p.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Rules */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-[#121214] border border-[#1f1f22] rounded-2xl p-8 mb-12"
          >
            <h2 className="text-xl font-serif mb-6 flex items-center gap-2">
              <AlertCircle size={20} className="text-[#D4AF37]" />
              Community Rules
            </h2>
            <ul className="space-y-3">
              {rules.map((rule, i) => (
                <li key={i} className="flex items-start gap-3 text-[#A1A1AA]">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Enforcement */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-[#A1A1AA] text-sm">
              Violations may result in content removal, temporary suspension, or
              permanent ban. If you see something that violates these
              guidelines, please report it.
            </p>
            <p className="text-[#A1A1AA] text-sm mt-4">
              Thank you for helping us keep VersElite a welcoming space for
              poetry.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
