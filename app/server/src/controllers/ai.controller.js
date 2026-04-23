import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const chatWithAI = async (req, res) => {
  try {
    const { messages, currentContent } = req.body;

    const conversation = messages.map((m) => `${m.role}: ${m.content}`).join("\n");
    const prompt = `You are a poetry assistant. Current draft: ${currentContent || "none"}\n${conversation}\nAssistant:`;

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

// ✅ New streaming function
export const chatWithAIStream = async (req, res) => {
  try {
    const { messages, currentContent } = req.body;

    const conversation = messages.map((m) => `${m.role}: ${m.content}`).join("\n");
    const prompt = `You are a poetry assistant. Current draft: ${currentContent || "none"}\n${conversation}\nAssistant:`;

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [{ role: "user", content: prompt }],
      stream: true,
    });

    // Set headers for SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    for await (const chunk of completion) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }
    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    console.error("Stream error:", error);
    res.status(500).json({ error: error.message });
  }
};
