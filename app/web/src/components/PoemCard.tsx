import { motion } from "framer-motion";
import { Heart, MessageCircle } from "lucide-react";
import { useState, useContext, useEffect, useRef } from "react";
import { PoemModal } from "./PoemModal";
import { toggleLike } from "@/features/reactions/reactions.api";
import { AuthContext } from "@/features/auth/AuthProvider";

// Enhanced Poem interface to match actual data structure
export interface Poem {
  id: string;
  title: string;
  content: string;
  author?: string; // Fallback display name
  likes?: number;
  comments?: number;
  userHasLiked?: boolean;
  profiles?: {
    username: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

interface PoemCardProps {
  poem: Poem;
  onUnauthenticatedAction?: (action: string) => void;
}

export function PoemCard({ poem, onUnauthenticatedAction }: PoemCardProps) {
  const [open, setOpen] = useState(false);
  const { session } = useContext(AuthContext);
  const [liked, setLiked] = useState(poem.userHasLiked ?? false);
  const [likeCount, setLikeCount] = useState(poem.likes ?? 0);
  const [isLiking, setIsLiking] = useState(false);
  const poemIdRef = useRef(poem.id);

  // Compute display author name from profiles or fallback
  const authorName =
    poem.profiles?.full_name ||
    poem.profiles?.username ||
    poem.author ||
    "Anonymous";

  // Sync state when poem identity changes
  useEffect(() => {
    if (poemIdRef.current !== poem.id) {
      poemIdRef.current = poem.id;
      setLiked(poem.userHasLiked ?? false);
      setLikeCount(poem.likes ?? 0);
    }
  }, [poem]);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!session?.user?.id) {
      onUnauthenticatedAction?.("like poems");
      return;
    }

    if (isLiking) return;

    const previousLiked = liked;
    const previousCount = likeCount;
    const newLiked = !liked;
    const newCount = liked ? likeCount - 1 : likeCount + 1;

    setLiked(newLiked);
    setLikeCount(newCount);
    setIsLiking(true);

    try {
      const result = await toggleLike(poem.id, session.user.id);
      if (result && typeof result === "object" && "liked" in result) {
        setLiked(result.liked);
        if ("likes" in result) {
          setLikeCount(result.likes);
        }
      } else {
        // Keep optimistic if no data returned
        setLiked(newLiked);
        setLikeCount(newCount);
      }
    } catch (error) {
      setLiked(previousLiked);
      setLikeCount(previousCount);
      console.error("Failed to toggle like:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!session?.user?.id) {
      onUnauthenticatedAction?.("comment on poems");
      return;
    }
    setOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
    }
  };

  return (
    <>
      <motion.div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        whileHover={{ scale: 1.015 }}
        className="group relative bg-[#121214] p-6 rounded-2xl border border-[#1f1f22] overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-[#D4AF37]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

        <div className="relative z-10">
          <h2 className="text-lg font-serif text-[#F5F5F5]">{poem.title}</h2>
          <p className="text-[#A1A1AA] mt-3 leading-relaxed line-clamp-3">
            {poem.content}
          </p>
          <div className="mt-5 text-sm text-[#D4AF37]">{authorName}</div>

          {/* Action bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex gap-4 mt-4 text-[#A1A1AA]"
          >
            <button
              onClick={handleLike}
              disabled={isLiking}
              aria-label={liked ? "Unlike poem" : "Like poem"}
              className={`flex items-center gap-1 transition ${
                liked ? "text-[#D4AF37]" : "text-[#A1A1AA] hover:text-[#D4AF37]"
              } ${!session ? "" : ""}`}
            >
              <Heart size={16} fill={liked ? "#D4AF37" : "none"} />
              <span className="text-sm">{likeCount}</span>
            </button>

            <button
              onClick={handleCommentClick}
              aria-label="View comments"
              className="flex items-center gap-1 hover:text-[#D4AF37] transition"
            >
              <MessageCircle size={16} />
              <span className="text-sm">{poem.comments ?? 0}</span>
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Modal now contains the CommentsSection */}
      <PoemModal poem={poem} isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
