import { supabase } from "@/lib/supabase";

export async function fetchMessages(conversationId: string) {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}

export async function sendMessage({
  conversationId,
  senderId,
  content,
}: {
  conversationId: string;
  senderId: string;
  content: string;
}) {
  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      content,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
