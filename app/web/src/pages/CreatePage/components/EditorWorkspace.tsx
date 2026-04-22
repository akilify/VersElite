import { TiptapEditor } from "@/components/TiptapEditor";
import { AudioRecorder } from "@/components/AudioRecorder";
import { VideoRecorder } from "@/components/VideoRecorder";
import { CollabEditor } from "@/components/CollabEditor";
import type { PoemType } from "../types";

interface Props {
  type: PoemType;
  content: string;
  onContentChange: (c: string) => void;
  isCollaborative: boolean;
  collaborationId: string | null;
  mediaUrl: string | null;
  onMediaChange: (url: string | null) => void;
  onMediaUpload: (file: File) => Promise<string | null>;
  focusMode: boolean;
  showLineNumbers: boolean;
  plainText: string;
}

export function EditorWorkspace({
  type,
  content,
  onContentChange,
  isCollaborative,
  collaborationId,
  mediaUrl,
  onMediaChange,
  onMediaUpload,
  focusMode,
  showLineNumbers,
  plainText,
}: Props) {
  if (isCollaborative && collaborationId) {
    return <CollabEditor collaborationId={collaborationId} />;
  }

  return (
    <div className="flex h-full">
      {showLineNumbers && type === "written" && (
        <div className="w-12 py-2 text-right text-[#2a2a2e] text-sm font-mono select-none pr-3 border-r border-[#1f1f22]">
          {plainText.split("\n").map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
      )}
      {type === "written" ? (
        <TiptapEditor
          content={content}
          onChange={onContentChange}
          placeholder="Start writing..."
          focusMode={focusMode}
        />
      ) : type === "spoken_audio" ? (
        <AudioRecorder
          mediaUrl={mediaUrl}
          onMediaChange={onMediaChange}
          onUpload={onMediaUpload}
        />
      ) : (
        <VideoRecorder
          mediaUrl={mediaUrl}
          onMediaChange={onMediaChange}
          onUpload={onMediaUpload}
        />
      )}
    </div>
  );
}
