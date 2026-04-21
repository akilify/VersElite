import { Mic, Square, Play } from "lucide-react";

interface AudioRecorderProps {
  mediaUrl: string | null;
  onMediaChange: (url: string | null) => void;
}

export function AudioRecorder({ mediaUrl, onMediaChange }: AudioRecorderProps) {
  const isRecorded = !!mediaUrl;

  return (
    <div className="h-full flex flex-col items-center justify-center text-[#A1A1AA]">
      {isRecorded ? (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 flex items-center justify-center mx-auto">
            <Play size={32} className="text-[#D4AF37]" />
          </div>
          <p className="text-sm">Audio recorded</p>
          <button
            onClick={() => onMediaChange(null)}
            className="text-xs text-red-400 hover:underline"
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#1f1f22] flex items-center justify-center mx-auto">
            <Mic size={32} className="text-[#D4AF37]" />
          </div>
          <p className="text-sm">Click record to start</p>
          <button
            className="px-4 py-2 bg-[#D4AF37] text-black rounded-full text-sm font-medium"
            onClick={() => {
              // Placeholder: will implement actual recording later
              console.log("Start recording (placeholder)");
            }}
          >
            Start Recording
          </button>
        </div>
      )}
    </div>
  );
}
