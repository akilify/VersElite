import { Video, Play } from "lucide-react";

interface VideoRecorderProps {
  mediaUrl: string | null;
  onMediaChange: (url: string | null) => void;
}

export function VideoRecorder({ mediaUrl, onMediaChange }: VideoRecorderProps) {
  const isRecorded = !!mediaUrl;

  return (
    <div className="h-full flex flex-col items-center justify-center text-[#A1A1AA]">
      {isRecorded ? (
        <div className="text-center space-y-4">
          <video src={mediaUrl} controls className="max-h-64 rounded-lg" />
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
            <Video size={32} className="text-[#D4AF37]" />
          </div>
          <p className="text-sm">Click record to start</p>
          <button
            className="px-4 py-2 bg-[#D4AF37] text-black rounded-full text-sm font-medium"
            onClick={() => {
              console.log("Start video recording (placeholder)");
            }}
          >
            Start Recording
          </button>
        </div>
      )}
    </div>
  );
}
