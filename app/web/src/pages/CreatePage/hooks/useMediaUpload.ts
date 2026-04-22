import { useCallback } from "react";
import { supabase } from "@/lib/supabase";

export function useMediaUpload(userId: string) {
  const upload = useCallback(
    async (file: File): Promise<string | null> => {
      if (!userId) return null;
      const ext = file.name.split(".").pop();
      const path = `${userId}/${Date.now()}.${ext}`;
      const { error, data } = await supabase.storage
        .from("media")
        .upload(path, file);
      if (error) return null;
      return supabase.storage.from("media").getPublicUrl(data.path).data
        .publicUrl;
    },
    [userId],
  );
  return { upload };
}
