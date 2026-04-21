import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { AuthContext } from "@/features/auth/AuthProvider";
import { AuthModal } from "@/components/AuthModal";
import { FloatingNav } from "@/components/FloatingNav";

export default function CreateEvent() {
  const { session } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    event_date: "",
    event_time: "",
    type: "Virtual" as "Virtual" | "In-Person" | "Hybrid",
    meeting_link: "",
    location: "",
    is_featured: false,
  });

  if (!session) {
    return (
      <>
        <div className="min-h-screen bg-[#0B0B0C] flex items-center justify-center text-white">
          <div className="text-center">
            <h1 className="text-2xl font-serif mb-4">Sign in to create events</h1>
            <button onClick={() => setIsAuthModalOpen(true)} className="bg-[#D4AF37] text-black px-6 py-3 rounded-full">
              Sign In
            </button>
          </div>
        </div>
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from("events").insert({
      ...form,
      host_id: session.user.id,
      is_published: true,
    });
    setSubmitting(false);
    if (!error) {
      navigate("/events");
    } else {
      alert("Error creating event: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-white">
      <FloatingNav />
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-serif mb-8">Create New Event</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="text" placeholder="Event Title" required className="w-full bg-[#121214] border border-[#1f1f22] rounded-lg p-3" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
          <textarea placeholder="Description" rows={4} className="w-full bg-[#121214] border border-[#1f1f22] rounded-lg p-3" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <input type="date" required className="bg-[#121214] border border-[#1f1f22] rounded-lg p-3" value={form.event_date} onChange={e => setForm({...form, event_date: e.target.value})} />
            <input type="time" className="bg-[#121214] border border-[#1f1f22] rounded-lg p-3" value={form.event_time} onChange={e => setForm({...form, event_time: e.target.value})} />
          </div>
          <select className="w-full bg-[#121214] border border-[#1f1f22] rounded-lg p-3" value={form.type} onChange={e => setForm({...form, type: e.target.value as any})}>
            <option>Virtual</option>
            <option>In-Person</option>
            <option>Hybrid</option>
          </select>
          {form.type !== "In-Person" && <input type="url" placeholder="Meeting Link" className="w-full bg-[#121214] border border-[#1f1f22] rounded-lg p-3" value={form.meeting_link} onChange={e => setForm({...form, meeting_link: e.target.value})} />}
          {form.type !== "Virtual" && <input type="text" placeholder="Location" className="w-full bg-[#121214] border border-[#1f1f22] rounded-lg p-3" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />}
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.is_featured} onChange={e => setForm({...form, is_featured: e.target.checked})} />
            <span>Feature this event</span>
          </label>
          <button type="submit" disabled={submitting} className="bg-[#D4AF37] text-black px-8 py-3 rounded-full font-medium">
            {submitting ? "Creating..." : "Create Event"}
          </button>
        </form>
      </div>
    </div>
  );
}
