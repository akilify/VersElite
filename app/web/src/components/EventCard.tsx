import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Users,
  Video,
  Bell,
  BellRing,
  Share2,
} from "lucide-react";
import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthModal } from "./AuthModal";
import { AuthContext } from "@/features/auth/AuthProvider";
import { useEventRSVP } from "@/hooks/useEventRSVP";
import type { Event } from "@/hooks/useEvents";

interface EventCardProps {
  event: Event;
  index?: number;
}

export function EventCard({ event, index = 0 }: EventCardProps) {
  const { session } = useContext(AuthContext);
  const [authOpen, setAuthOpen] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const { rsvp, loading, attendeeCount, fetchRSVP, toggleRSVP } = useEventRSVP(
    event.id,
  );

  const hostName =
    event.profiles?.full_name || event.profiles?.username || "Host";
  const eventDate = new Date(event.event_date);
  const month = eventDate.toLocaleString("default", { month: "short" });
  const day = eventDate.getDate();

  useEffect(() => {
    if (session?.user?.id) {
      fetchRSVP(session.user.id);
    }
  }, [session?.user?.id]);

  const handleRSVP = (status: "going" | "interested") => {
    if (!session) {
      setAuthOpen(true);
      return;
    }
    toggleRSVP(session.user.id, status);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/events/${event.id}`;
    navigator.clipboard?.writeText(url);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2000);
  };

  const addToCalendar = (e: React.MouseEvent) => {
    e.stopPropagation();
    const start = eventDate.toISOString().replace(/-|:|\.\d+/g, "");
    const end = new Date(eventDate.getTime() + 3600000)
      .toISOString()
      .replace(/-|:|\.\d+/g, "");
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${start}/${end}&details=${encodeURIComponent(event.description || "")}&location=${encodeURIComponent(event.meeting_link || event.location || "")}`;
    window.open(googleUrl, "_blank");
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ scale: 1.02 }}
        className="bg-[#121214] border border-[#1f1f22] hover:border-[#D4AF37]/40 rounded-2xl p-5 transition group"
      >
        <div className="flex items-start gap-4">
          <div className="bg-[#0B0B0C] border border-[#1f1f22] rounded-lg p-3 text-center min-w-[65px]">
            <p className="text-[#D4AF37] text-sm font-medium">{month}</p>
            <p className="text-[#F5F5F5] text-2xl font-serif">{day}</p>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <Link to={`/events/${event.id}`}>
                <h3 className="font-serif text-lg text-[#F5F5F5] group-hover:text-[#D4AF37] transition line-clamp-2">
                  {event.title}
                </h3>
              </Link>
              {event.is_featured && (
                <span className="text-xs bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded-full flex-shrink-0">
                  Featured
                </span>
              )}
            </div>
            <p className="text-[#A1A1AA] text-sm mt-1">Hosted by {hostName}</p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-[#A1A1AA]">
              <span className="flex items-center gap-1">
                <Calendar size={12} /> {event.event_time || "TBD"}
              </span>
              <span className="flex items-center gap-1">
                {event.type === "Virtual" ? (
                  <Video size={12} />
                ) : (
                  <MapPin size={12} />
                )}
                {event.type}
              </span>
              <span className="flex items-center gap-1">
                <Users size={12} /> {attendeeCount || event.attendee_count || 0}{" "}
                attending
              </span>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#1f1f22]">
          <div className="flex gap-2">
            <button
              onClick={() => handleRSVP("going")}
              disabled={loading}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition ${
                rsvp === "going"
                  ? "bg-[#D4AF37] text-black"
                  : "bg-[#1f1f22] text-[#F5F5F5] hover:bg-[#2a2a2e]"
              }`}
            >
              {rsvp === "going" ? <BellRing size={12} /> : <Bell size={12} />}
              Going
            </button>
            <button
              onClick={() => handleRSVP("interested")}
              disabled={loading}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition ${
                rsvp === "interested"
                  ? "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/50"
                  : "bg-[#1f1f22] text-[#A1A1AA] hover:text-[#F5F5F5]"
              }`}
            >
              Interested
            </button>
          </div>
          <div className="flex gap-1">
            <button
              onClick={addToCalendar}
              className="p-2 rounded-full hover:bg-[#1f1f22] text-[#A1A1AA] hover:text-[#D4AF37] transition"
              title="Add to calendar"
            >
              <Calendar size={14} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-[#1f1f22] text-[#A1A1AA] hover:text-[#D4AF37] transition relative"
              title="Share event"
            >
              <Share2 size={14} />
              {showShareToast && (
                <span className="absolute -top-8 right-0 bg-[#D4AF37] text-black text-xs px-2 py-1 rounded whitespace-nowrap">
                  Link copied!
                </span>
              )}
            </button>
          </div>
        </div>
      </motion.div>
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        defaultMessage="Sign in to RSVP for events and stay updated."
      />
    </>
  );
}
