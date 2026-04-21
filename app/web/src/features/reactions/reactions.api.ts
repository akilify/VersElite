import { supabase } from "@/lib/supabase";

export async function toggleLike(poemId: string, userId: string) {
  // Check if already liked
  const { data } = await supabase
    .from("reactions")
    .select("*")
    .eq("poem_id", poemId)
    .eq("user_id", userId)
    .single();

  if (data) {
    // remove like
    await supabase
      .from("reactions")
      .delete()
      .eq("id", data.id);

    return false;
  } else {
    // add like
    await supabase
      .from("reactions")
      .insert({
        poem_id: poemId,
        user_id: userId,
        type: "like",
      });

    return true;
  }
}
