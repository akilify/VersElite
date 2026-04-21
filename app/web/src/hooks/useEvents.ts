import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_time: string | null;
  host_id: string;
  type: "Virtual" | "In-P-person" | "Hybrid";
  meeting_link: string | null;
  location: string | null;
  thumbnail_url: string | null;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  profiles?: {
    username: string;
    full_name: string | null;
    avatar_url: string | null;
  };
  attendee_count?: number;
  user_rsvp?: "going" | "interested" | null;
}

export type EventFilter = "upcoming" | "past" | "featured" | "all";

export function useEvents(filter: EventFilter = "upcoming") {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      let query = supabase
        .from("events")
        .select(`
          *,
          profiles!events_host_id_fkey(username, full_name, avatar_url),
          event_attendees(count)
        `)
        .eq("is_published", true);

      const now = new Date().toISOString();
      if (filter === "upcoming") {
        query = query.gte("event_date", now).order("event_date", { ascending: true });
      } else if (filter === "past") {
        query = query.lt("event_date", now).order("event_date", { ascending: false });
      } else if (filter === "featured") {
        query = query.eq("is_featured", true).order("event_date", { ascending: true });
      } else {
        query = query.order("event_date", { ascending: true });
      }

      const { data, error: supabaseError } = await query;
      if (!supabaseError && data) {
        const eventsWithCount = data.map((e: any) => ({
          ...e,
          attendee_count: e.event_attendees?.[0]?.count || 0,
        }));
        setEvents(eventsWithCount);
      }
      setError(supabaseError?.message || null);
      setLoading(false);
    };
    fetchEvents();
  }, [filter]);

  return { events, loading, error };
}

export function useEventRSVP(eventId: string) {
  const [rsvp, setRsvp] = useState<"going" | "interested" | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchRSVP = async (userId: string) => {
    const { data } = await supabase
      .from("event_attendees")
      .select("status")
      .eq("event_id", eventId)
      .eq("user_id", userId)
      .single();
    setRsvp(data?.status || null);
  };

  const toggleRSVP = async (userId: string, status: "going" | "interested") => {
    setLoading(true);
    const newStatus = rsvp === status ? null : status;
    if (newStatus) {
      await supabase.from("event_attendees").upsert({
        event_id: eventId,
        user_id: userId,
        status: newStatus,
      });
    } else {
      await supabase
        .from("event_attendees")
        .delete()
        .eq("event_id", eventId)
        .eq("user_id", userId);
    }
    setRsvp(newStatus);
    setLoading(false);
  };

  return { rsvp, loading, fetchRSVP, toggleRSVP };
}
