import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import type { Poem } from "@/types";


export function useFeaturedPoem() {
  const [poem, setPoem] = useState<Poem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      const { data, error } = await supabase
        .from("poems")
        .select("*, profiles(username, full_name, avatar_url)")
        .eq("is_featured", true)
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!error) setPoem(data);
      setLoading(false);
    };
    fetchFeatured();
  }, []);

  return { poem, loading };
}

export function useRandomPoems(limit: number = 4, excludeId?: string) {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRandom = async () => {
      let query = supabase
        .from("poems")
        .select("*, profiles(username, full_name, avatar_url)")
        .eq("is_published", true)
        .limit(limit * 2);

      if (excludeId) query = query.neq("id", excludeId);

      const { data } = await query;
      if (data) {
        const shuffled = data.sort(() => 0.5 - Math.random());
        setPoems(shuffled.slice(0, limit));
      }
      setLoading(false);
    };
    fetchRandom();
  }, [limit, excludeId]);

  return { poems, loading };
}

export function usePlatformStats() {
  const [stats, setStats] = useState({ poems: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await supabase.rpc("get_platform_stats");
      if (data) setStats(data);
      setLoading(false);
    };
    fetchStats();
  }, []);

  return { stats, loading };
}

export function useOnlinePresence(collaborationId: string = "demo-id") {
  const [onlineCount, setOnlineCount] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);

  useEffect(() => {
    const channel = supabase.channel(`presence-${collaborationId}`, {
      config: { presence: { key: "home-spotlight" } },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const users = Object.values(state).flat();
        setOnlineUsers(users);
        setOnlineCount(users.length);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ online_at: new Date().toISOString() });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [collaborationId]);

  return { onlineCount, onlineUsers };
}
