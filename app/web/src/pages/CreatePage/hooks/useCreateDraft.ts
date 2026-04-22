import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useDebounce } from "use-debounce";
import { STORAGE_KEYS } from "../utils/constants";
import type { Draft, PoemType } from "../types";

export function useCreateDraft(session: any) {
  const [draft, setDraft] = useState<Draft>({
    id: null,
    title: "",
    content: "",
    type: "written",
    mediaUrl: null,
    isPublished: false,
    updatedAt: new Date().toISOString(),
  });
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingPublishes, setPendingPublishes] = useState<any[]>([]);

  const [debouncedContent] = useDebounce(draft.content, 2000);
  const [debouncedTitle] = useDebounce(draft.title, 2000);
  const userId = session?.user?.id;

  // Load draft on mount
  useEffect(() => {
    if (!userId) return;
    const load = async () => {
      // Try remote first
      const { data } = await supabase
        .from("poems")
        .select("*")
        .eq("author_id", userId)
        .eq("is_published", false)
        .order("updated_at", { ascending: false })
        .limit(1)
        .single();
      if (data) {
        setDraft({
          id: data.id,
          title: data.title || "",
          content: data.content || "",
          type: data.type || "written",
          mediaUrl: data.media_url,
          isPublished: false,
          updatedAt: data.updated_at,
        });
        return;
      }
      // Fallback to local
      const stored = localStorage.getItem(STORAGE_KEYS.DRAFT(userId));
      if (stored) setDraft(JSON.parse(stored));
    };
    load();
  }, [userId]);

  // Save local draft on changes
  useEffect(() => {
    if (!userId) return;
    localStorage.setItem(STORAGE_KEYS.DRAFT(userId), JSON.stringify(draft));
  }, [draft, userId]);

  // Auto‑save to remote
  useEffect(() => {
    if (!userId || !isOnline) return;
    const save = async () => {
      if (!draft.title && !draft.content) return;
      setSaveStatus("saving");
      const payload = {
        author_id: userId,
        title: draft.title,
        content: draft.content,
        type: draft.type,
        media_url: draft.mediaUrl,
        is_published: false,
        updated_at: new Date(),
      };
      const { error } = draft.id
        ? await supabase.from("poems").update(payload).eq("id", draft.id)
        : await supabase.from("poems").insert(payload).select().single();
      if (!error) setSaveStatus("saved");
      else setSaveStatus("error");
    };
    save();
  }, [
    debouncedContent,
    debouncedTitle,
    draft.type,
    draft.mediaUrl,
    isOnline,
    userId,
    draft.id,
  ]);

  // Update draft fields
  const updateDraft = useCallback((partial: Partial<Draft>) => {
    setDraft((prev) => ({
      ...prev,
      ...partial,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  // Publish (online) or queue
  const publish = useCallback(
    async (publishData: {
      title: string;
      isPremium: boolean;
      price: number;
    }) => {
      if (!isOnline) {
        const newPending = [...pendingPublishes, publishData];
        setPendingPublishes(newPending);
        localStorage.setItem(
          STORAGE_KEYS.PENDING_PUBLISHES(userId),
          JSON.stringify(newPending),
        );
        return;
      }
      await supabase
        .from("poems")
        .update({
          title: publishData.title,
          is_published: true,
          is_premium: publishData.isPremium,
          price: publishData.price,
        })
        .eq("id", draft.id);
      updateDraft({ isPublished: true });
    },
    [isOnline, draft.id, userId, pendingPublishes, updateDraft],
  );

  return {
    draft,
    updateDraft,
    saveStatus,
    isOnline,
    pendingPublishes,
    publish,
  };
}
