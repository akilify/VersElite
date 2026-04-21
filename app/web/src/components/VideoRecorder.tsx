import { useReactMediaRecorder } from "react-media-recorder";
import { Video, Square, Upload, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface VideoRecorderProps {
  mediaUrl: string | null;
  onMediaChange: (url: string | null) => void;
  onUpload: (file: File) => Promise<string | void>;
}

export function VideoRecorder({
  mediaUrl,
  onMediaChange,
  onUpload,
}: VideoRecorderProps) {
  const [uploading, setUploading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
    clearBlobUrl,
    previewStream,
  } = useReactMediaRecorder({ video: true, audio: true });

  useEffect(() => {
    if (videoRef.current && previewStream) {
      videoRef.current.srcObject = previewStream;
    }
  }, [previewStream]);

  const handleUpload = async () => {
    if (!mediaBlobUrl) return;
    setUploading(true);
    try {
      const response = await fetch(mediaBlobUrl);
      const blob = await response.blob();
      const file = new File([blob], `video-${Date.now()}.webm`, {
        type: "video/webm",
      });
      const uploadedUrl = await onUpload(file);
      if (uploadedUrl) {
        onMediaChange(uploadedUrl);
        clearBlobUrl();
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  if (mediaUrl) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-[#A1A1AA] space-y-4">
        <video src={mediaUrl} controls className="max-h-64 rounded-lg" />
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
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-64 h-48 rounded-lg bg-black border border-[#2a2a2e] object-cover"
            />
            <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          </div>
          <button
            onClick={stopRecording}
            className="px-4 py-2 bg-[#1f1f22] hover:bg-[#2a2a2e] rounded-full text-sm flex items-center gap-2"
          >
            <Square size={14} /> Stop Recording
          </button>
        </>
      ) : status === "stopped" && mediaBlobUrl ? (
        <>
          <video src={mediaBlobUrl} controls className="max-h-64 rounded-lg" />
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
              {uploading ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Upload size={12} />
              )}
              {uploading ? "Uploading..." : "Save Video"}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="w-20 h-20 rounded-full bg-[#1f1f22] flex items-center justify-center">
            <Video size={40} className="text-[#D4AF37]" />
          </div>
          <p className="text-sm">Click to start recording</p>
          <button
            onClick={startRecording}
            className="px-4 py-2 bg-[#D4AF37] text-black rounded-full text-sm font-medium flex items-center gap-2"
          >
            <Video size={14} /> Record Video
          </button>
          <p className="text-xs text-[#A1A1AA]">or</p>
          <label className="cursor-pointer text-xs text-[#D4AF37] hover:underline">
            <Upload size={12} className="inline mr-1" />
            Upload video file
            <input
              type="file"
              accept="video/*"
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
