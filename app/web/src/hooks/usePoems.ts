import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Poem } from "@/components/PoemCard";

export type SortOption = "new" | "trending" | "following";

interface UsePoemsOptions {
  limit?: number;
  excludeId?: string;
  sortBy?: SortOption;
  userId?: string; // Required for "following" filter
}

export function usePoems({
  limit = 12,
  excludeId,
  sortBy = "new",
  userId,
}: UsePoemsOptions = {}) {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPoems = async () => {
      setLoading(true);
      setError(null);

      try {
        let query = supabase
          .from("poems")
          .select("*, profiles(username, full_name, avatar_url)")
          .eq("is_published", true);

        if (excludeId) {
          query = query.neq("id", excludeId);
        }

        // Apply sorting based on filter
        if (sortBy === "trending") {
          query = query.order("like_count", { ascending: false });
        } else if (sortBy === "new") {
          query = query.order("created_at", { ascending: false });
        } else if (sortBy === "following" && userId) {
          // Get IDs of users the current user follows
          const { data: follows } = await supabase
            .from("user_follows")
            .select("followed_id")
            .eq("follower_id", userId);

          const followedIds = follows?.map((f) => f.followed_id) || [];
          if (followedIds.length > 0) {
            query = query.in("author_id", followedIds);
          } else {
            // No follows, return empty array
            setPoems([]);
            setLoading(false);
            return;
          }
          query = query.order("created_at", { ascending: false });
        }

        query = query.limit(limit);

        const { data, error: supabaseError } = await query;

        if (supabaseError) throw supabaseError;
        setPoems(data || []);
      } catch (err: any) {
        console.error("Error fetching poems:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPoems();
  }, [limit, excludeId, sortBy, userId]);

  return { poems, loading, error };
}
