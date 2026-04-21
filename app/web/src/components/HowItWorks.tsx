import { motion } from "framer-motion";
import { Sparkles, Users, Share2 } from "lucide-react";

const steps = [
  {
    icon: Sparkles,
    title: "Write with AI",
    description:
      "Generate poetry plans and refine your verses with our AI assistant.",
  },
  {
    icon: Users,
    title: "Collaborate Live",
    description:
      "Write together in real time, seeing every edit and who's online.",
  },
  {
    icon: Share2,
    title: "Share Your Voice",
    description: "Publish your work and connect with a community of poets.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 px-6 bg-[#0B0B0C]">
      <div className="max-w-5xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-serif mb-4"
        >
          How It <span className="text-[#D4AF37]">Works</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[#A1A1AA] mb-12 max-w-2xl mx-auto"
        >
          Three steps to bring your poetry to life.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="bg-[#121214] border border-[#1f1f22] rounded-2xl p-8 text-center hover:border-[#D4AF37]/30 transition"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                <step.icon size={28} className="text-[#D4AF37]" />
              </div>
              <h3 className="text-xl font-serif text-[#F5F5F5] mb-2">
                {step.title}
              </h3>
              <p className="text-[#A1A1AA] text-sm">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
