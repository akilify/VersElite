import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { generatePlan } from "@/features/ai/ai.api";

interface AIAssistantProps {
  onInsert: (text: string) => void;
}

export function AIAssistant({ onInsert }: AIAssistantProps) {
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("love");
  const [tone, setTone] = useState("emotional");
  const [style, setStyle] = useState("free verse");
  const [generatedText, setGeneratedText] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await generatePlan({ theme, tone, style });
      setGeneratedText(response.plan);
    } catch (error) {
      console.error("AI generation failed:", error);
      setGeneratedText("Failed to generate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInsert = () => {
    if (generatedText) {
      onInsert(generatedText);
      setGeneratedText(""); // Clear after insert
    }
  };

  return (
    <div className="p-4 border-t border-[#1f1f22] bg-[#0B0B0C]">
      <h3 className="font-serif text-sm mb-3 flex items-center gap-2">
        <Sparkles size={16} className="text-[#D4AF37]" />
        AI Assistant
      </h3>

      <div className="space-y-3">
        <input
          type="text"
          placeholder="Theme (e.g., love)"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="w-full bg-[#121214] border border-[#1f1f22] rounded-lg px-3 py-2 text-sm text-white placeholder-[#A1A1AA] focus:border-[#D4AF37] outline-none"
        />
        <input
          type="text"
          placeholder="Tone (e.g., emotional)"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="w-full bg-[#121214] border border-[#1f1f22] rounded-lg px-3 py-2 text-sm text-white placeholder-[#A1A1AA] focus:border-[#D4AF37] outline-none"
        />
        <input
          type="text"
          placeholder="Style (e.g., free verse)"
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          className="w-full bg-[#121214] border border-[#1f1f22] rounded-lg px-3 py-2 text-sm text-white placeholder-[#A1A1AA] focus:border-[#D4AF37] outline-none"
        />

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-[#D4AF37] hover:bg-[#c4a02e] text-black font-medium py-2 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? "Generating..." : "Generate Plan"}
        </button>

        {generatedText && (
          <div className="mt-3">
            <div className="bg-[#121214] border border-[#1f1f22] rounded-lg p-3 max-h-40 overflow-y-auto text-sm text-[#F5F5F5] whitespace-pre-wrap">
              {generatedText}
            </div>
            <button
              onClick={handleInsert}
              className="mt-2 w-full border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black py-1.5 rounded-lg text-sm transition"
            >
              Insert into Editor
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
