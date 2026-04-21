import { supabaseAdmin } from "../config/supabase.js";
import { hasPurchased } from "../services/purchase.service.js";

export const getCollection = async (req, res) => {
  const userId = req.user.id;
  const { collectionId } = req.params;

  const purchased = await hasPurchased(userId, collectionId);

  if (!purchased) {
    return res.status(403).json({ error: "Not purchased" });
  }

  const { data } = await supabaseAdmin
    .from("collection_items")
    .select(
      `
      poems (*)
    `,
    )
    .eq("collection_id", collectionId);

  res.json(data);
};
