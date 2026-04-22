import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface RhymeResult {
  word: string;
  score: number;
}

export function RhymePanel({ word }: { word: string }) {
  const [rhymes, setRhymes] = useState<RhymeResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!word.trim()) return;
    const controller = new AbortController();
    const fetchRhymes = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.datamuse.com/words?rel_rhy=${encodeURIComponent(word)}`,
          { signal: controller.signal },
        );
        const data = await res.json();
        setRhymes(data.slice(0, 20));
      } catch (error: any) {
        if (error.name !== "AbortError")
          console.error("Rhyme fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRhymes();
    return () => controller.abort();
  }, [word]);

  if (!word)
    return (
      <p className="text-xs text-[#A1A1AA] p-3">Select a word to see rhymes</p>
    );

  return (
    <div className="p-3 max-h-64 overflow-y-auto border-t border-[#1f1f22]">
      <h4 className="text-xs font-medium text-[#D4AF37] mb-2">
        Rhymes with "{word}"
      </h4>
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-[#A1A1AA]" />
      ) : (
        <div className="flex flex-wrap gap-2">
          {rhymes.map((r) => (
            <button
              key={r.word}
              className="px-2 py-1 text-xs bg-[#1f1f22] hover:bg-[#2a2a2e] rounded"
              onClick={() => navigator.clipboard?.writeText(r.word)}
            >
              {r.word}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
