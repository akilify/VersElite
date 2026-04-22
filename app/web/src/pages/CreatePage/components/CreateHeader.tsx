import {
  Maximize2,
  History,
  FileText,
  HelpCircle,
  Wifi,
  WifiOff,
  Loader2,
  Check,
  AlertCircle,
  Users,
} from "lucide-react";
import type { EditorStats, PoemType } from "../types";

interface Props {
  title: string;
  onTitleChange: (t: string) => void;
  stats: EditorStats;
  isOnline: boolean;
  saveStatus: "idle" | "saving" | "saved" | "error";
  type: PoemType;
  onTypeChange: (t: PoemType) => void;
  isCollaborative: boolean;
  onToggleCollaboration: () => void;
  showLineNumbers: boolean;
  onToggleLineNumbers: () => void;
  onOpenHistory: () => void;
  onFocusMode: () => void;
  onOpenShortcuts: () => void;
  onPublish: () => void;
  pendingCount: number;
  focusMode: boolean;
}

export function CreateHeader({
  title,
  onTitleChange,
  stats,
  isOnline,
  saveStatus,
  type,
  onTypeChange,
  isCollaborative,
  onToggleCollaboration,
  showLineNumbers,
  onToggleLineNumbers,
  onOpenHistory,
  onFocusMode,
  onOpenShortcuts,
  onPublish,
  pendingCount,
  focusMode,
}: Props) {
  return (
    <div
      className={`sticky top-0 z-30 bg-[#0B0B0C]/90 backdrop-blur-md border-b border-[#1f1f22] px-6 py-3 ${focusMode ? "hidden" : ""}`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <input
            type="text"
            placeholder="Untitled"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="bg-transparent text-xl font-serif text-[#F5F5F5] placeholder-[#A1A1AA] outline-none border-b border-transparent focus:border-[#D4AF37] transition w-64"
          />
          <div className="flex items-center gap-4 text-xs text-[#A1A1AA]">
            <span>{stats.words} words</span>
            <span>{stats.chars} chars</span>
            <span>{stats.syllables} syllables</span>
            <span>{stats.lines} lines</span>
            <span>{stats.readingTime} min read</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs">
            {isOnline ? (
              <Wifi size={14} className="text-green-400" />
            ) : (
              <WifiOff size={14} className="text-amber-400" />
            )}
            <span className="hidden sm:inline text-[#A1A1AA]">
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            {saveStatus === "saving" && (
              <Loader2 size={14} className="animate-spin text-[#A1A1AA]" />
            )}
            {saveStatus === "saved" && (
              <Check size={14} className="text-green-400" />
            )}
            {saveStatus === "error" && (
              <AlertCircle size={14} className="text-red-400" />
            )}
            <span className="hidden sm:inline text-[#A1A1AA]">
              {saveStatus === "saving" ? "Saving..." : saveStatus}
            </span>
          </div>
          {!isCollaborative && (
            <select
              value={type}
              onChange={(e) => onTypeChange(e.target.value as PoemType)}
              className="bg-[#121214] border border-[#1f1f22] rounded-lg px-3 py-1.5 text-xs"
            >
              <option value="written">Written</option>
              <option value="spoken_audio">Audio</option>
              <option value="spoken_video">Video</option>
            </select>
          )}
          <button
            onClick={onToggleCollaboration}
            className={`p-2 rounded-lg ${isCollaborative ? "bg-[#D4AF37]/20 text-[#D4AF37]" : "hover:bg-[#1f1f22] text-[#A1A1AA]"}`}
          >
            <Users size={16} />
          </button>
          {!isCollaborative && (
            <button
              onClick={onToggleLineNumbers}
              className="p-2 rounded-lg hover:bg-[#1f1f22] text-[#A1A1AA]"
            >
              <FileText size={16} />
            </button>
          )}
          <button
            onClick={onOpenHistory}
            className="p-2 rounded-lg hover:bg-[#1f1f22] text-[#A1A1AA]"
          >
            <History size={16} />
          </button>
          <button
            onClick={onFocusMode}
            className="p-2 rounded-lg hover:bg-[#1f1f22] text-[#A1A1AA]"
          >
            <Maximize2 size={16} />
          </button>
          <button
            onClick={onOpenShortcuts}
            className="p-2 rounded-lg hover:bg-[#1f1f22] text-[#A1A1AA]"
          >
            <HelpCircle size={16} />
          </button>
          <button
            onClick={onPublish}
            className="bg-[#D4AF37] text-black px-4 py-1.5 rounded-full text-sm font-medium relative"
          >
            Publish
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
