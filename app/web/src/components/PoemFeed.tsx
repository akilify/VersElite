import { motion } from "framer-motion";
import { PoemCard } from "./PoemCard";
import { usePoems, type SortOption } from "@/hooks/usePoems";
import { Loader2 } from "lucide-react";

interface PoemFeedProps {
  onUnauthenticatedAction?: (action: string) => void;
  limit?: number;
  excludeId?: string;
  sortBy?: SortOption;
  userId?: string;
}

export function PoemFeed({
  onUnauthenticatedAction,
  limit = 12,
  excludeId,
  sortBy = "new",
  userId,
}: PoemFeedProps) {
  const { poems, loading, error } = usePoems({
    limit,
    excludeId,
    sortBy,
    userId,
  });

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-400">
        <p>Failed to load poems. Please try again later.</p>
      </div>
    );
  }

  if (poems.length === 0) {
    let message = "No poems yet. Be the first to share your voice.";
    if (sortBy === "following") {
      message =
        "You're not following any poets yet. Explore and follow poets to see their work here.";
    }
    return (
      <div className="text-center py-20 text-[#A1A1AA]">
        <p>{message}</p>
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.1 } },
      }}
    >
      {poems.map((poem) => (
        <motion.div
          key={poem.id}
          variants={{
            hidden: { opacity: 0, y: 30 },
            show: { opacity: 1, y: 0 },
          }}
        >
          <PoemCard
            poem={poem}
            onUnauthenticatedAction={onUnauthenticatedAction}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
