import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { PoemFeed } from "@/components/PoemFeed";
import { AuthModal } from "@/components/AuthModal";
import { AuthContext } from "@/features/auth/AuthProvider";
import { TrendingUp, Clock, Users } from "lucide-react";
import type { SortOption } from "@/hooks/usePoems";
import { FloatingNav } from "@/components/FloatingNav";

const filters: { label: string; value: SortOption; icon: typeof TrendingUp }[] =
  [
    { label: "Trending", value: "trending", icon: TrendingUp },
    { label: "New", value: "new", icon: Clock },
    { label: "Following", value: "following", icon: Users },
  ];

export default function ExplorePage() {
  const { session } = useContext(AuthContext);
  const [activeFilter, setActiveFilter] = useState<SortOption>("trending");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMessage, setAuthModalMessage] = useState("");

  const handleUnauthenticatedAction = (action: string) => {
    setAuthModalMessage(`Sign in to ${action} and join the conversation.`);
    setIsAuthModalOpen(true);
  };

  const handleFilterChange = (filter: SortOption) => {
    if (filter === "following" && !session?.user) {
      setAuthModalMessage("Sign in to see poems from poets you follow.");
      setIsAuthModalOpen(true);
      return;
    }
    setActiveFilter(filter);
  };

  return (

    <div className="min-h-screen bg-[#0B0B0C] text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header with CTA */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
             <FloatingNav/>
            <h1 className="text-4xl md:text-5xl font-serif mb-2">
              Explore <span className="text-[#D4AF37]">Poems</span>
            </h1>
            <p className="text-[#A1A1AA]">
              Discover voices that resonate with yours.
            </p>
          </motion.div>

          {!session && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              onClick={() => {
                setAuthModalMessage(
                  "Join VersElite to start writing your own poetry.",
                );
                setIsAuthModalOpen(true);
              }}
              className="mt-4 md:mt-0 bg-[#D4AF37] hover:bg-[#c4a02e] text-black px-6 py-3 rounded-full font-medium transition"
            >
              Start Writing
            </motion.button>
          )}
        </div>

        {/* Functional Filter Bar */}
        <div className="flex gap-6 border-b border-[#1f1f22] mb-10">
          {filters.map(({ label, value, icon: Icon }) => (
            <button
              key={value}
              onClick={() => handleFilterChange(value)}
              className={`flex items-center gap-2 pb-3 text-sm font-medium transition border-b-2 ${
                activeFilter === value
                  ? "text-[#D4AF37] border-[#D4AF37]"
                  : "text-[#A1A1AA] border-transparent hover:text-[#F5F5F5]"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {/* Poem Feed */}
        <PoemFeed
          onUnauthenticatedAction={handleUnauthenticatedAction}
          limit={12}
          sortBy={activeFilter}
          userId={session?.user?.id}
        />

        {/* Conversion Banner (mid‑feed) */}
        {!session && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 p-8 bg-gradient-to-r from-[#121214] to-[#0B0B0C] border border-[#D4AF37]/30 rounded-2xl text-center"
          >
            <h3 className="text-2xl font-serif mb-2">
              Your voice belongs here.
            </h3>
            <p className="text-[#A1A1AA] mb-6">
              Join VersElite to write, collaborate, and connect with poets
              worldwide.
            </p>
            <button
              onClick={() => {
                setAuthModalMessage(
                  "Create your free account and start writing.",
                );
                setIsAuthModalOpen(true);
              }}
              className="bg-[#D4AF37] hover:bg-[#c4a02e] text-black px-8 py-3 rounded-full font-medium transition"
            >
              Sign Up Free
            </button>
          </motion.div>
        )}
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultMessage={authModalMessage}
      />
    </div>
  );
}
