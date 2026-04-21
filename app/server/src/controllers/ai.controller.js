import OpenAI from "openai";
import { supabaseAdmin } from "../config/supabase.js";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const generatePlan = async (req, res) => {
  try {
    const { theme, tone, style } = req.body || {};
    const userId = req.user?.id;

    if (!theme || !tone || !style) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // Optional: Check for userId if you require authentication
    if (!userId) {
      console.warn("Warning: No user ID found. Skipping database logging.");
    }

    const prompt = `
You are a professional poetry mentor.

Theme: ${theme}
Tone: ${tone}
Style: ${style}

Provide a poetry writing plan with:
1. Three compelling title ideas
2. Recommended structure
3. Key metaphors or imagery
4. Emotional direction
`;

    // 1. Create AI session (only if user is authenticated)
    let session;
    if (userId) {
      const { data: newSession, error: sessionError } = await supabaseAdmin
        .from("ai_sessions")
        .insert({
          user_id: userId,
          type: "plan",
        })
        .select()
        .single();

      if (sessionError) {
        console.error("Session creation error:", sessionError);
        throw sessionError;
      }
      session = newSession;

      // 2. Save user prompt
      await supabaseAdmin.from("ai_messages").insert({
        session_id: session.id,
        role: "user",
        content: prompt,
      });
    }

    // 3. Call OpenRouter with a reliable free model
    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001", // Reliable free model
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    });

    // Define aiText FIRST
    const aiText = completion.choices[0].message.content;

    // NOW you can log it
    console.log("AI Text extracted:", aiText);

    // 4. Save AI response (if user is authenticated)
    if (userId && session) {
      await supabaseAdmin.from("ai_messages").insert({
        session_id: session.id,
        role: "assistant",
        content: aiText,
      });
    }

    res.json({
      sessionId: session?.id || null,
      plan: aiText,
    });
  } catch (error) {
    console.error("OpenRouter error:", error);
    res.status(500).json({
      error: "AI request failed",
      details: error.message,
    });
  }
};
