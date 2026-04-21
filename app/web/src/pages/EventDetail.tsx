import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users, Video, Share2, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AuthContext } from "@/features/auth/AuthProvider";
import { AuthModal } from "@/components/AuthModal";
import { FloatingNav } from "@/components/FloatingNav";
import { useEventRSVP } from "@/hooks/useEvents";
import type { Event } from "@/hooks/useEvents";

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const { session } = useContext(AuthContext);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  const { rsvp, loading: rsvpLoading, fetchRSVP, toggleRSVP } = useEventRSVP(id!);

  useEffect(() => {
    if (!id) return;
    const fetchEvent = async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*, profiles!events_host_id_fkey(username, full_name, avatar_url)")
        .eq("id", id)
        .single();
      if (error || !data) setNotFound(true);
      else setEvent(data);
      setLoading(false);
    };
    fetchEvent();
  }, [id]);

  useEffect(() => {
    if (session?.user?.id && id) fetchRSVP(session.user.id);
  }, [session, id]);

  const handleRSVP = (status: "going" | "interested") => {
    if (!session) {
      setIsAuthModalOpen(true);
      return;
    }
    toggleRSVP(session.user.id, status);
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard?.writeText(url);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2000);
  };

  const addToCalendar = () => {
    if (!event) return;
    const start = new Date(event.event_date).toISOString().replace(/-|:|\.\d+/g, "");
    const end = new Date(new Date(event.event_date).getTime() + 3600000)
      .toISOString()
      .replace(/-|:|\.\d+/g, "");
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${start}/${end}&details=${encodeURIComponent(event.description || "")}&location=${encodeURIComponent(event.meeting_link || event.location || "")}`;
    window.open(googleUrl, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0C] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
      </div>
    );
  }

  if (notFound || !event) {
    return (
      <div className="min-h-screen bg-[#0B0B0C] flex flex-col items-center justify-center text-white px-6">
        <h1 className="text-3xl font-serif mb-4">Event Not Found</h1>
        <p className="text-[#A1A1AA] mb-6">This event may have been removed or the link is incorrect.</p>
        <Link to="/events" className="bg-[#D4AF37] text-black px-6 py-3 rounded-full font-medium">
          Browse Events
        </Link>
      </div>
    );
  }

  const hostName = event.profiles?.full_name || event.profiles?.username || "Host";
  const eventDate = new Date(event.event_date);
  const isPast = eventDate < new Date();

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-white">
      <FloatingNav />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#121214] to-[#0B0B0C] border-b border-[#1f1f22]">
        <div className="absolute inset-0 bg-[#D4AF37]/5 blur-3xl" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 md:py-24">
          <Link to="/events" className="inline-flex items-center gap-2 text-sm text-[#A1A1AA] hover:text-[#D4AF37] mb-8 transition">
            ← Back to Events
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {event.is_featured && (
              <span className="inline-block text-xs bg-[#D4AF37]/20 text-[#D4AF37] px-3 py-1 rounded-full mb-4">
                Featured Event
              </span>
            )}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-4">{event.title}</h1>
            <p className="text-lg text-[#A1A1AA] max-w-3xl">{event.description}</p>

            <div className="flex flex-wrap items-center gap-6 mt-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#b08c2c] flex items-center justify-center text-black font-bold">
                  {hostName[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm text-[#A1A1AA]">Hosted by</p>
                  <p className="font-medium">{hostName}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-[#A1A1AA]">
                <span className="flex items-center gap-1"><Calendar size={16} /> {eventDate.toLocaleDateString()}</span>
                <span className="flex items-center gap-1"><Clock size={16} /> {event.event_time || "TBD"}</span>
                <span className="flex items-center gap-1">{event.type === "Virtual" ? <Video size={16} /> : <MapPin size={16} />} {event.type}</span>
                <span className="flex items-center gap-1"><Users size={16} /> {event.attendee_count || 0} attending</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Actions */}
      <section className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex flex-wrap gap-4 items-center">
          {!isPast && (
            <>
              <button
                onClick={() => handleRSVP("going")}
                disabled={rsvpLoading}
                className={`px-6 py-3 rounded-full font-medium transition ${
                  rsvp === "going"
                    ? "bg-[#D4AF37] text-black"
                    : "bg-[#1f1f22] text-white hover:bg-[#2a2a2e]"
                }`}
              >
                {rsvp === "going" ? "✓ Going" : "RSVP"}
              </button>
              <button
                onClick={() => handleRSVP("interested")}
                disabled={rsvpLoading}
                className={`px-6 py-3 rounded-full font-medium transition ${
                  rsvp === "interested"
                    ? "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/50"
                    : "bg-[#1f1f22] text-[#A1A1AA] hover:text-white"
                }`}
              >
                {rsvp === "interested" ? "✓ Interested" : "Interested"}
              </button>
            </>
          )}
          <button onClick={addToCalendar} className="p-3 rounded-full bg-[#1f1f22] text-[#A1A1AA] hover:text-[#D4AF37] transition">
            <Calendar size={20} />
          </button>
          <button onClick={handleShare} className="p-3 rounded-full bg-[#1f1f22] text-[#A1A1AA] hover:text-[#D4AF37] transition">
            <Share2 size={20} />
          </button>
        </div>
        {showShareToast && (
          <div className="mt-4 inline-block bg-[#D4AF37] text-black text-sm px-4 py-2 rounded-full">
            Link copied!
          </div>
        )}
      </section>

      {/* Details */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-serif mb-4">About This Event</h2>
            <p className="text-[#A1A1AA] leading-relaxed">{event.description}</p>
            {event.meeting_link && !isPast && (
              <div className="mt-6 p-4 bg-[#121214] border border-[#1f1f22] rounded-xl">
                <p className="text-sm text-[#A1A1AA] mb-2">Meeting Link</p>
                <a href={event.meeting_link} target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] break-all">
                  {event.meeting_link}
                </a>
              </div>
            )}
          </div>
          <div className="bg-[#121214] border border-[#1f1f22] rounded-2xl p-6">
            <h3 className="font-serif text-lg mb-4">Event Details</h3>
            <dl className="space-y-3 text-sm">
              <div><dt className="text-[#A1A1AA]">Date</dt><dd className="text-white">{eventDate.toLocaleDateString()}</dd></div>
              <div><dt className="text-[#A1A1AA]">Time</dt><dd className="text-white">{event.event_time || "TBD"}</dd></div>
              <div><dt className="text-[#A1A1AA]">Type</dt><dd className="text-white">{event.type}</dd></div>
              {event.location && <div><dt className="text-[#A1A1AA]">Location</dt><dd className="text-white">{event.location}</dd></div>}
            </dl>
          </div>
        </div>
      </section>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} defaultMessage="Sign in to RSVP for this event." />
    </div>
  );
}
