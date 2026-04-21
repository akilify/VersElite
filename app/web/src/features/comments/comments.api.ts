import { supabase } from "@/lib/supabase";

export async function fetchComments(poemId: string) {
  const { data, error } = await supabase
    .from("comments")
    .select(`
      *,
      profiles (username)
    `)
    .eq("poem_id", poemId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}

export async function addComment({
  poemId,
  userId,
  content,
  parentId = null,
}: {
  poemId: string;
  userId: string;
  content: string;
  parentId?: string | null;
}) {
  const { data, error } = await supabase
    .from("comments")
    .insert({
      poem_id: poemId,
      user_id: userId,
      content,
      parent_id: parentId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
