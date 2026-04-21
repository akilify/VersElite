import { useEffect, useState, useContext, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { AuthContext } from "@/features/auth/AuthProvider";

interface CollabEditorProps {
  collaborationId: string;
  externalInsert?: string; // AI generated text to insert
}

export function CollabEditor({
  collaborationId,
  externalInsert,
}: CollabEditorProps) {
  const { session } = useContext(AuthContext);
  const [content, setContent] = useState("");
  const contentRef = useRef(content);

  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  // Handle external insert (AI suggestion)
  useEffect(() => {
    if (externalInsert) {
      const newContent = content + (content ? "\n\n" : "") + externalInsert;
      setContent(newContent);
      sendEdit(newContent);
    }
  }, [externalInsert]); // Run when AI text changes

  const sendEdit = async (text: string) => {
    if (!session?.user?.id) return;
    await supabase.from("collaboration_events").insert({
      collaboration_id: collaborationId,
      user_id: session.user.id,
      type: "edit",
      content: { text },
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setContent(newText);
    sendEdit(newText);
  };

  // Realtime subscription for remote edits
  useEffect(() => {
    const channel = supabase
      .channel(`collab-${collaborationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "collaboration_events",
          filter: `collaboration_id=eq.${collaborationId}`,
        },
        (payload) => {
          const event = payload.new;
          if (event.user_id === session?.user?.id) return;
          if (event.type === "edit") {
            setContent(event.content.text);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [collaborationId, session?.user?.id]);

  return (
    <textarea
      value={content}
      onChange={handleChange}
      className="w-full h-full bg-[#121214] text-[#F5F5F5] p-6 rounded-xl border border-[#1f1f22] focus:border-[#D4AF37] outline-none resize-none font-serif text-lg leading-relaxed"
      placeholder="Start writing together... or use the AI Assistant →"
    />
  );
}
