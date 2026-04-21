import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Mail, Heart, ArrowUp, Users } from "lucide-react";
import {
  siX as XIcon,
  siYoutube as YoutubeIcon,
  siDiscord as DiscordIcon,
} from "simple-icons";
import { useState, useEffect } from "react";

export function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0B0B0C] border-t border-[#1f1f22] relative">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link
              to="/"
              className="text-2xl font-serif tracking-wide text-[#D4AF37] inline-block mb-4"
            >
              VersElite
            </Link>
            <p className="text-[#A1A1AA] text-sm leading-relaxed mb-6">
              Poetry, reimagined as a living experience. Write, collaborate, and
              share your voice with the world.
            </p>
            <div className="flex items-center gap-4">
              {/* X (Twitter) */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#A1A1AA] hover:text-[#D4AF37] transition"
                aria-label="X (Twitter)"
                dangerouslySetInnerHTML={{ __html: XIcon.svg }}
              />
              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#A1A1AA] hover:text-[#D4AF37] transition"
                aria-label="YouTube"
                dangerouslySetInnerHTML={{ __html: YoutubeIcon.svg }}
              />
              {/* Discord */}
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#A1A1AA] hover:text-[#D4AF37] transition"
                aria-label="Discord"
                dangerouslySetInnerHTML={{ __html: DiscordIcon.svg }}
              />
              {/* Email */}
              <a
                href="mailto:hello@verselite.com"
                className="text-[#A1A1AA] hover:text-[#D4AF37] transition"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="font-serif text-[#F5F5F5] mb-4">Explore</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-[#A1A1AA] hover:text-[#D4AF37] transition"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/explore"
                  className="text-[#A1A1AA] hover:text-[#D4AF37] transition"
                >
                  Discover Poems
                </Link>
              </li>
              <li>
                <Link
                  to="/events"
                  className="text-[#A1A1AA] hover:text-[#D4AF37] transition"
                >
                  Live Events
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-[#A1A1AA] hover:text-[#D4AF37] transition"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-serif text-[#F5F5F5] mb-4">Resources</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/create"
                  className="text-[#A1A1AA] hover:text-[#D4AF37] transition"
                >
                  Start Writing
                </Link>
              </li>
              <li>
                <Link
                  to="/collab/demo-id"
                  className="text-[#A1A1AA] hover:text-[#D4AF37] transition"
                >
                  Collaborate
                </Link>
              </li>
              <li>
                <Link
                  to="/help"
                  className="text-[#A1A1AA] hover:text-[#D4AF37] transition"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/guidelines"
                  className="text-[#A1A1AA] hover:text-[#D4AF37] transition"
                >
                  Community Guidelines
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Newsletter / CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="font-serif text-[#F5F5F5] mb-4">Stay Inspired</h3>
            <p className="text-[#A1A1AA] text-sm mb-4">
              Get weekly poetry prompts and event updates.
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-[#121214] border border-[#1f1f22] rounded-lg px-4 py-2 text-sm text-white placeholder-[#A1A1AA] focus:border-[#D4AF37] outline-none transition"
              />
              <button
                type="submit"
                className="bg-[#D4AF37] hover:bg-[#c4a02e] text-black px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-[#A1A1AA] mt-3">
              No spam. Unsubscribe anytime.
            </p>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-[#1f1f22] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#A1A1AA] flex items-center gap-1">
            © {currentYear} VersElite. Made with{" "}
            <Heart size={12} className="text-[#D4AF37] fill-[#D4AF37]" /> for
            poets everywhere.
          </p>
          <div className="flex items-center gap-6 text-xs">
            <Link
              to="/privacy"
              className="text-[#A1A1AA] hover:text-[#D4AF37] transition"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="text-[#A1A1AA] hover:text-[#D4AF37] transition"
            >
              Terms
            </Link>
            <Link
              to="/cookies"
              className="text-[#A1A1AA] hover:text-[#D4AF37] transition"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-30 p-3 bg-[#D4AF37] hover:bg-[#c4a02e] text-black rounded-full shadow-lg transition"
            aria-label="Scroll to top"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
}
