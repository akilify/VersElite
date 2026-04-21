import { supabaseAdmin } from "../config/supabase.js";

export const hasPurchased = async (userId, itemId) => {
  const { data } = await supabaseAdmin
    .from("purchases")
    .select("*")
    .eq("user_id", userId)
    .eq("item_id", itemId)
    .eq("status", "completed")
    .single();

  return !!data;
};
