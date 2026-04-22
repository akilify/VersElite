import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const chatWithAI = async (req, res) => {
  try {
    const { messages, currentContent } = req.body;

    // Build a prompt from conversation history
    const conversation = messages
      .map((m) => `${m.role}: ${m.content}`)
      .join("\n");

    const prompt = `You are a poetry assistant. Current draft: ${currentContent || "none"}\n${conversation}\nAssistant:`;

    // Call OpenRouter with the prompt
    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: error.message });
  }
};
