import { useReactMediaRecorder } from "react-media-recorder";
import { Mic, Square, Play, Upload, Loader2, Check } from "lucide-react";
import { useState, useRef } from "react";

interface AudioRecorderProps {
  mediaUrl: string | null;
  onMediaChange: (url: string | null) => void;
  onUpload: (file: File) => Promise<string | void>;
}

export function AudioRecorder({ mediaUrl, onMediaChange, onUpload }: AudioRecorderProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
    clearBlobUrl,
  } = useReactMediaRecorder({ audio: true });

  const handleUpload = async () => {
    if (!mediaBlobUrl) return;
    setUploading(true);
    try {
      const response = await fetch(mediaBlobUrl);
      const blob = await response.blob();
      const file = new File([blob], `recording-${Date.now()}.webm`, { type: "audio/webm" });
      const uploadedUrl = await onUpload(file);
      if (uploadedUrl) {
        onMediaChange(uploadedUrl);
        setUploadSuccess(true);
        clearBlobUrl(); // clean up local blob
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAudioEnded = () => setIsPlaying(false);

  // If a mediaUrl is already present (from previous upload), show player
  if (mediaUrl) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-[#A1A1AA] space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
          <Play size={32} className="text-[#D4AF37] cursor-pointer" onClick={handlePlayPause} />
        </div>
        <audio ref={audioRef} src={mediaUrl} onEnded={handleAudioEnded} className="hidden" />
        <p className="text-sm">Audio ready</p>
        <button
          onClick={() => onMediaChange(null)}
          className="px-3 py-1 text-xs bg-red-500/10 text-red-400 rounded-full hover:bg-red-500/20"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center text-[#A1A1AA] space-y-4">
      {status === "recording" ? (
        <>
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center animate-pulse">
              <Mic size={40} className="text-red-400" />
            </div>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping" />
          </div>
          <p className="text-sm font-medium text-red-400">Recording...</p>
          <button
            onClick={stopRecording}
            className="px-4 py-2 bg-[#1f1f22] hover:bg-[#2a2a2e] rounded-full text-sm flex items-center gap-2"
          >
            <Square size={14} /> Stop
          </button>
        </>
      ) : status === "stopped" && mediaBlobUrl ? (
        <>
          <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
            <Play size={32} className="text-[#D4AF37] cursor-pointer" onClick={handlePlayPause} />
          </div>
          <audio ref={audioRef} src={mediaBlobUrl} onEnded={handleAudioEnded} className="hidden" />
          <p className="text-sm">Preview ready</p>
          <div className="flex gap-2">
            <button
              onClick={clearBlobUrl}
              className="px-3 py-1 text-xs bg-[#1f1f22] hover:bg-[#2a2a2e] rounded-full"
            >
              Discard
            </button>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="px-3 py-1 text-xs bg-[#D4AF37] text-black rounded-full font-medium flex items-center gap-1"
            >
              {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
              {uploading ? "Uploading..." : "Save Recording"}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="w-20 h-20 rounded-full bg-[#1f1f22] flex items-center justify-center">
            <Mic size={40} className="text-[#D4AF37]" />
          </div>
          <p className="text-sm">Click to start recording</p>
          <button
            onClick={startRecording}
            className="px-4 py-2 bg-[#D4AF37] text-black rounded-full text-sm font-medium flex items-center gap-2"
          >
            <Mic size={14} /> Record
          </button>
          <p className="text-xs text-[#A1A1AA]">or</p>
          <label className="cursor-pointer text-xs text-[#D4AF37] hover:underline">
            <Upload size={12} className="inline mr-1" />
            Upload audio file
            <input
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setUploading(true);
                  const url = await onUpload(file);
                  if (url) onMediaChange(url);
                  setUploading(false);
                }
              }}
            />
          </label>
        </>
      )}
    </div>
  );
}
