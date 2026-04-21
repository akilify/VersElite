import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function useEventRSVP(eventId: string) {
  const [rsvp, setRsvp] = useState<"going" | "interested" | null>(null);
  const [loading, setLoading] = useState(false);
  const [attendeeCount, setAttendeeCount] = useState(0);

  const fetchRSVP = async (userId: string) => {
    const { data } = await supabase
      .from("event_attendees")
      .select("status")
      .eq("event_id", eventId)
      .eq("user_id", userId)
      .single();
    setRsvp(data?.status || null);
  };

  const fetchAttendeeCount = async () => {
    const { count } = await supabase
      .from("event_attendees")
      .select("*", { count: "exact", head: true })
      .eq("event_id", eventId)
      .eq("status", "going");
    setAttendeeCount(count || 0);
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
    await fetchAttendeeCount();
    setLoading(false);
  };

  useEffect(() => {
    fetchAttendeeCount();
  }, [eventId]);

  return {
    rsvp,
    loading,
    attendeeCount,
    fetchRSVP,
    toggleRSVP,
    refetchCount: fetchAttendeeCount,
  };
}
