import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { EventCard } from "@/components/EventCard";
import { AuthModal } from "@/components/AuthModal";
import { AuthContext } from "@/features/auth/AuthProvider";
import { useEvents, type EventFilter } from "@/hooks/useEvents";
import { Calendar, Sparkles, Clock, Star, Loader2 } from "lucide-react";
import { FloatingNav } from "@/components/FloatingNav";

const filters: { label: string; value: EventFilter; icon: typeof Calendar }[] =
  [
    { label: "Upcoming", value: "upcoming", icon: Sparkles },
    { label: "Featured", value: "featured", icon: Star },
    { label: "Past", value: "past", icon: Clock },
  ];

export default function EventsPage() {
  const { session } = useContext(AuthContext);
  const [activeFilter, setActiveFilter] = useState<EventFilter>("upcoming");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { events, loading } = useEvents(activeFilter);

  const featuredEvent = events.find(
    (e) => e.is_featured && activeFilter !== "past",
  );

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-white">
      <FloatingNav />
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-serif mb-2">
              Live & <span className="text-[#D4AF37]">Upcoming</span>
            </h1>
            <p className="text-[#A1A1AA]">
              Join poetry readings, workshops, and collaborative events.
            </p>
          </motion.div>

          {!session && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setIsAuthModalOpen(true)}
              className="mt-4 md:mt-0 bg-[#D4AF37] hover:bg-[#c4a02e] text-black px-6 py-3 rounded-full font-medium transition"
            >
              Host an Event
            </motion.button>
          )}
        </div>

        {/* Filter Bar */}
        <div className="flex gap-6 border-b border-[#1f1f22] mb-10">
          {filters.map(({ label, value, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setActiveFilter(value)}
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

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
          </div>
        ) : (
          <>
            {/* Featured Event */}
            {featuredEvent && activeFilter !== "past" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
              >
                <div className="bg-gradient-to-r from-[#121214] to-[#0B0B0C] border border-[#D4AF37]/40 rounded-2xl p-6 md:p-8">
                  <span className="text-[#D4AF37] text-sm uppercase tracking-wider">
                    Featured Event
                  </span>
                  <h2 className="text-2xl md:text-3xl font-serif mt-2">
                    {featuredEvent.title}
                  </h2>
                  <p className="text-[#A1A1AA] mt-3 max-w-2xl">
                    {featuredEvent.description}
                  </p>
                  <div className="flex flex-wrap gap-4 mt-4">
                    <span className="text-[#F5F5F5]">
                      Hosted by{" "}
                      {featuredEvent.profiles?.full_name ||
                        featuredEvent.profiles?.username}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (!session) {
                        setIsAuthModalOpen(true);
                        return;
                      }
                      // RSVP logic handled in EventCard
                    }}
                    className="mt-6 bg-[#D4AF37] hover:bg-[#c4a02e] text-black px-6 py-2 rounded-full font-medium transition"
                  >
                    RSVP Now
                  </button>
                </div>
              </motion.div>
            )}

            {/* Event Grid */}
            {events.length === 0 ? (
              <div className="text-center py-20 text-[#A1A1AA]">
                <p>No events scheduled. Check back soon!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events
                  .filter((e) => !e.is_featured || activeFilter === "past")
                  .map((event, index) => (
                    <EventCard key={event.id} event={event} index={index} />
                  ))}
              </div>
            )}

            {/* Past Events Archive Link */}
            {activeFilter === "past" && events.length > 0 && (
              <div className="mt-12 text-center">
                <button className="text-[#D4AF37] hover:underline text-sm">
                  View archived recordings →
                </button>
              </div>
            )}

            {/* CTA Banner for non-authenticated users */}
            {!session && events.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="mt-20 p-8 bg-gradient-to-r from-[#121214] to-[#0B0B0C] border border-[#D4AF37]/30 rounded-2xl text-center"
              >
                <h3 className="text-2xl font-serif mb-2">
                  Never miss an event
                </h3>
                <p className="text-[#A1A1AA] mb-6">
                  Sign up to RSVP, get reminders, and connect with poets.
                </p>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-[#D4AF37] hover:bg-[#c4a02e] text-black px-8 py-3 rounded-full font-medium transition"
                >
                  Join VersElite
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultMessage="Sign in to RSVP for events and stay updated."
      />
    </div>
  );
}
