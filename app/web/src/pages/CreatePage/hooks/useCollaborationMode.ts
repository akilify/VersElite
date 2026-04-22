import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export function useCollaborationMode(
  draftId: string | null,
  title: string,
  userId: string,
) {
  const [isCollaborative, setIsCollaborative] = useState(false);
  const [collabId, setCollabId] = useState<string | null>(null);

  const toggle = useCallback(
    async (currentContent: string, onContentUpdate: (c: string) => void) => {
      if (!userId) return;

      if (!isCollaborative) {
        // Enter collaboration mode
        let cid: string | null = null;

        // Check if draft already has a linked collaboration
        if (draftId) {
          const { data: poemData } = await supabase
            .from("poems")
            .select("collaboration_id")
            .eq("id", draftId)
            .single();
          cid = poemData?.collaboration_id || null;
        }

        // Create new collaboration if none exists
        if (!cid) {
          const { data: collabData, error } = await supabase
            .from("collaborations")
            .insert({
              title: title || "Untitled Collaboration",
              owner_id: userId,
            })
            .select("id")
            .single();

          if (error) {
            console.error("Failed to create collaboration:", error);
            return;
          }
          cid = collabData?.id || null;

          // Link collaboration to draft if draft exists
          if (cid && draftId) {
            await supabase
              .from("poems")
              .update({ collaboration_id: cid })
              .eq("id", draftId);
          }
        }

        if (cid) {
          setCollabId(cid);
          setIsCollaborative(true);
        }
      } else {
        // Exit collaboration mode: fetch latest content from events
        if (collabId) {
          const { data } = await supabase
            .from("collaboration_events")
            .select("content")
            .eq("collaboration_id", collabId)
            .eq("type", "edit")
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

          if (data?.content?.text) {
            onContentUpdate(data.content.text);
          }
        }
        setIsCollaborative(false);
        setCollabId(null);
      }
    },
    [isCollaborative, draftId, title, userId, collabId],
  );

  return { isCollaborative, collabId, toggle };
}
