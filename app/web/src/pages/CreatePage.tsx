import { useState, useEffect, useContext, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "use-debounce";
import { useHotkeys } from "react-hotkeys-hook";
import { supabase } from "@/lib/supabase";
import { AuthContext } from "@/features/auth/AuthProvider";
import { FloatingNav } from "@/components/FloatingNav";
import { AuthModal } from "@/components/AuthModal";
import { AIAssistant } from "@/components/AIAssistant";
import {
  Save, Eye, EyeOff, Maximize2, Minimize2, History, Mic, FileText,
  Loader2, Check, AlertCircle, ChevronRight, ChevronLeft, Upload, X,
  Volume2, HelpCircle
} from "lucide-react";
import { syllable } from "syllable";
import WaveSurfer from "wavesurfer.js";
import useSound from "use-sound";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface Draft {
  id: string;
  title: string;
  content: string;
  type: "written" | "spoken_audio" | "spoken_video";
  media_url: string | null;
  is_published: boolean;
  updated_at: string;
}

interface RhymeResult {
  word: string;
  score: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Utility functions
// ─────────────────────────────────────────────────────────────────────────────

const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;
const countChars = (text: string) => text.length;
const countLines = (text: string) => text.split(/\n/).length;
const countSyllables = (text: string) => syllable(text);
const readingTime = (text: string) => Math.ceil(countWords(text) / 150);

// ─────────────────────────────────────────────────────────────────────────────
// Custom Cursor Trail Component
// ─────────────────────────────────────────────────────────────────────────────
function CursorTrail({ containerRef }: { containerRef: React.RefObject<HTMLElement> }) {
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);
  const counter = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = counter.current++;
      setTrail(prev => [...prev.slice(-8), { x, y, id }]);
    };

    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, [containerRef]);

  return (
    <>
      {trail.map(({ x, y, id }) => (
        <motion.div
          key={id}
          initial={{ opacity: 0.6, scale: 1 }}
          animate={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.5 }}
          className="absolute w-3 h-3 rounded-full bg-[#D4AF37]/30 pointer-events-none blur-sm"
          style={{ left: x - 6, top: y - 6 }}
        />
      ))}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Rhyme Dictionary Panel (Datamuse)
// ─────────────────────────────────────────────────────────────────────────────
function RhymePanel({ word }: { word: string }) {
  const [rhymes, setRhymes] = useState<RhymeResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!word.trim()) return;
    const fetchRhymes = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://api.datamuse.com/words?rel_rhy=${encodeURIComponent(word)}`);
        const data = await res.json();
        setRhymes(data.slice(0, 20));
      } catch (error) {
        console.error("Rhyme fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRhymes();
  }, [word]);

  if (!word) return <p className="text-xs text-[#A1A1AA] p-3">Select a word to see rhymes</p>;

  return (
    <div className="p-3 max-h-64 overflow-y-auto">
      <h4 className="text-xs font-medium text-[#D4AF37] mb-2">Rhymes with "{word}"</h4>
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-[#A1A1AA]" />
      ) : (
        <div className="flex flex-wrap gap-2">
          {rhymes.map(r => (
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

// ─────────────────────────────────────────────────────────────────────────────
// Shortcut Cheat Sheet Modal
// ─────────────────────────────────────────────────────────────────────────────
function ShortcutModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const shortcuts = [
    { keys: "Ctrl + S", description: "Save draft" },
    { keys: "Ctrl + Shift + F", description: "Toggle focus mode" },
    { keys: "Ctrl + /", description: "Toggle AI panel" },
    { keys: "?", description: "Show this help" },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={onClose}>
      <div className="bg-[#121214] border border-[#1f1f22] rounded-2xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-serif">Keyboard Shortcuts</h2>
          <button onClick={onClose}><X size={16} /></button>
        </div>
        <div className="space-y-2">
          {shortcuts.map(s => (
            <div key={s.keys} className="flex justify-between text-sm">
              <span className="text-[#A1A1AA]">{s.description}</span>
              <kbd className="px-2 py-0.5 bg-[#1f1f22] rounded text-[#D4AF37] font-mono text-xs">{s.keys}</kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export default function CreatePage() {
  const { session } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Editor state
  const [draftId, setDraftId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<"written" | "spoken_audio" | "spoken_video">("written");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);

  // UI state
  const [focusMode, setFocusMode] = useState(false);
  const [aiPanelOpen, setAiPanelOpen] = useState(true);
  const [rhymeWord, setRhymeWord] = useState("");
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">("saved");
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [shortcutModalOpen, setShortcutModalOpen] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState(true);

  // Refs
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef(content);
  const titleRef = useRef(title);
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  // Auto-save debounce
  const [debouncedContent] = useDebounce(content, 3000);
  const [debouncedTitle] = useDebounce(title, 3000);

  // Sounds
  const [playSave] = useSound("/sounds/save.mp3", { volume: 0.3 });
  const [playPublish] = useSound("/sounds/publish.mp3", { volume: 0.4 });

  // Derived stats
  const stats = {
    words: countWords(content),
    chars: countChars(content),
    lines: countLines(content),
    syllables: countSyllables(content),
    readingTime: readingTime(content),
  };

  // ───────────────────────────────────────────────────────────────────────────
  // Auth guard
  // ───────────────────────────────────────────────────────────────────────────
  if (!session) {
    return (
      <>
        <div className="min-h-screen bg-[#0B0B0C] flex items-center justify-center text-white">
          <div className="text-center">
            <h1 className="text-2xl font-serif mb-4">Sign in to write</h1>
            <button onClick={() => setIsAuthModalOpen(true)} className="bg-[#D4AF37] text-black px-6 py-3 rounded-full">
              Sign In
            </button>
          </div>
        </div>
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Load or create draft
  // ───────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const loadDraft = async () => {
      const { data } = await supabase
        .from("poems")
        .select("*")
        .eq("author_id", session.user.id)
        .eq("is_published", false)
        .order("updated_at", { ascending: false })
        .limit(1)
        .single();

      if (data) {
        setDraftId(data.id);
        setTitle(data.title || "");
        setContent(data.content || "");
        setType(data.type || "written");
        setMediaUrl(data.media_url);
      }
    };
    loadDraft();
  }, [session]);

  // ───────────────────────────────────────────────────────────────────────────
  // WaveSurfer for audio preview
  // ───────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (type === "spoken_audio" && mediaUrl && waveformRef.current) {
      if (wavesurferRef.current) wavesurferRef.current.destroy();
      const ws = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#D4AF37",
        progressColor: "#b08c2c",
        cursorColor: "#D4AF37",
        height: 60,
        barWidth: 2,
      });
      ws.load(mediaUrl);
      wavesurferRef.current = ws;
    }
    return () => {
      if (wavesurferRef.current) wavesurferRef.current.destroy();
    };
  }, [type, mediaUrl]);

  // ───────────────────────────────────────────────────────────────────────────
  // Auto-save
  // ───────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const saveDraft = async () => {
      if (!session?.user?.id) return;
      if (!title && !content && !mediaUrl) return;

      setSaveStatus("saving");
      const payload = {
        author_id: session.user.id,
        title,
        content,
        type,
        media_url: mediaUrl,
        is_published: false,
        updated_at: new Date(),
      };

      let error;
      if (draftId) {
        ({ error } = await supabase.from("poems").update(payload).eq("id", draftId));
      } else {
        const { data, error: insertError } = await supabase.from("poems").insert(payload).select().single();
        error = insertError;
        if (data) setDraftId(data.id);
      }

      setSaveStatus(error ? "error" : "saved");
      if (!error) playSave();
    };

    if (debouncedContent !== contentRef.current || debouncedTitle !== titleRef.current) {
      contentRef.current = debouncedContent;
      titleRef.current = debouncedTitle;
      saveDraft();
    }
  }, [debouncedContent, debouncedTitle]);

  // ───────────────────────────────────────────────────────────────────────────
  // Media upload
  // ───────────────────────────────────────────────────────────────────────────
  const handleMediaUpload = async (file: File) => {
    const ext = file.name.split(".").pop();
    const path = `${session.user.id}/${Date.now()}.${ext}`;
    const { error, data } = await supabase.storage.from("media").upload(path, file);
    if (!error) {
      const url = supabase.storage.from("media").getPublicUrl(data.path).data.publicUrl;
      setMediaUrl(url);
      setMediaFile(file);
    }
  };

  // ───────────────────────────────────────────────────────────────────────────
  // Get selected word for rhyme
  // ───────────────────────────────────────────────────────────────────────────
  const handleTextSelection = () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();
    if (selectedText && selectedText.split(/\s+/).length === 1) {
      setRhymeWord(selectedText);
    }
  };

  // ───────────────────────────────────────────────────────────────────────────
  // Keyboard shortcuts
  // ───────────────────────────────────────────────────────────────────────────
  useHotkeys("ctrl+shift+f", () => setFocusMode(!focusMode), [focusMode]);
  useHotkeys("ctrl+/", () => setAiPanelOpen(!aiPanelOpen), [aiPanelOpen]);
  useHotkeys("ctrl+s", (e) => { e.preventDefault(); }, []);
  useHotkeys("?", () => setShortcutModalOpen(true), [], { preventDefault: true });

  // ───────────────────────────────────────────────────────────────────────────
  // Render
  // ───────────────────────────────────────────────────────────────────────────
  return (
    <div className={`min-h-screen bg-[#0B0B0C] text-white ${focusMode ? "fixed inset-0 z-50" : ""}`}>
      <FloatingNav />

      {/* Editor Header */}
      <div className={`sticky top-0 z-30 bg-[#0B0B0C]/90 backdrop-blur-md border-b border-[#1f1f22] px-6 py-3 ${focusMode ? "hidden" : ""}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <input
              type="text"
              placeholder="Untitled"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
            {/* Save indicator */}
            <div className="flex items-center gap-1 text-xs">
              {saveStatus === "saving" && <Loader2 size={14} className="animate-spin text-[#A1A1AA]" />}
              {saveStatus === "saved" && <Check size={14} className="text-green-400" />}
              {saveStatus === "error" && <AlertCircle size={14} className="text-red-400" />}
              <span className="text-[#A1A1AA]">
                {saveStatus === "saving" ? "Saving..." : saveStatus === "saved" ? "Saved" : "Error"}
              </span>
            </div>

            {/* Type dropdown */}
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="bg-[#121214] border border-[#1f1f22] rounded-lg px-3 py-1.5 text-xs"
            >
              <option value="written">Written</option>
              <option value="spoken_audio">Spoken (Audio)</option>
              <option value="spoken_video">Spoken (Video)</option>
            </select>

            <button onClick={() => setShowLineNumbers(!showLineNumbers)} className="p-2 rounded-lg hover:bg-[#1f1f22] text-[#A1A1AA]">
              <FileText size={16} />
            </button>
            <button onClick={() => setHistoryModalOpen(true)} className="p-2 rounded-lg hover:bg-[#1f1f22] text-[#A1A1AA]">
              <History size={16} />
            </button>
            <button onClick={() => setFocusMode(true)} className="p-2 rounded-lg hover:bg-[#1f1f22] text-[#A1A1AA]">
              <Maximize2 size={16} />
            </button>
            <button onClick={() => setShortcutModalOpen(true)} className="p-2 rounded-lg hover:bg-[#1f1f22] text-[#A1A1AA]">
              <HelpCircle size={16} />
            </button>
            <button
              onClick={() => {
                playPublish();
                setPublishModalOpen(true);
              }}
              className="bg-[#D4AF37] text-black px-4 py-1.5 rounded-full text-sm font-medium"
            >
              Publish
            </button>
          </div>
        </div>
      </div>

      {/* Focus Mode Exit Button */}
      {focusMode && (
        <button
          onClick={() => setFocusMode(false)}
          className="fixed top-4 right-4 z-50 p-2 bg-[#121214] border border-[#1f1f22] rounded-lg text-[#A1A1AA] hover:text-[#D4AF37]"
        >
          <Minimize2 size={16} />
        </button>
      )}

      {/* Main Editor Area */}
      <div className={`flex ${focusMode ? "h-screen" : "min-h-[calc(100vh-60px)]"}`} ref={editorContainerRef}>
        <CursorTrail containerRef={editorContainerRef} />

        {/* Editor */}
        <div className={`flex-1 p-6 ${aiPanelOpen ? "pr-4" : ""}`}>
          <div className="flex h-full">
            {showLineNumbers && (
              <div className="w-12 py-2 text-right text-[#2a2a2e] text-sm font-mono select-none pr-3 border-r border-[#1f1f22]">
                {content.split("\n").map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
            )}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onMouseUp={handleTextSelection}
              placeholder="Start writing..."
              className={`flex-1 bg-transparent text-[#F5F5F5] text-lg leading-relaxed outline-none resize-none p-2 font-serif placeholder-[#3a3a3e] ${focusMode ? "text-2xl" : ""}`}
              style={{ minHeight: focusMode ? "100vh" : "600px" }}
            />
          </div>

          {/* Spoken Word Uploader + Preview */}
          {type !== "written" && (
            <div className="mt-6 border-t border-[#1f1f22] pt-4">
              <label className="flex items-center gap-3 cursor-pointer text-[#A1A1AA] hover:text-[#D4AF37]">
                <Upload size={16} />
                <span>Upload {type === "spoken_audio" ? "Audio" : "Video"}</span>
                <input
                  type="file"
                  accept={type === "spoken_audio" ? "audio/*" : "video/*"}
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleMediaUpload(e.target.files[0])}
                />
              </label>
              {mediaUrl && type === "spoken_audio" && (
                <div className="mt-3">
                  <div ref={waveformRef} />
                  <button onClick={() => wavesurferRef.current?.playPause()} className="mt-2 text-xs text-[#D4AF37]">
                    <Volume2 size={14} className="inline mr-1" /> Play/Pause
                  </button>
                </div>
              )}
              {mediaUrl && type === "spoken_video" && (
                <div className="mt-3">
                  <video src={mediaUrl} controls className="max-h-40 rounded" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* AI Panel */}
        <AnimatePresence>
          {aiPanelOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 360, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-l border-[#1f1f22] bg-[#0B0B0C] overflow-hidden"
            >
              <div className="w-[360px] h-full flex flex-col">
                <div className="p-4 border-b border-[#1f1f22] flex items-center justify-between">
                  <h3 className="font-serif text-sm">AI Assistant</h3>
                  <button onClick={() => setAiPanelOpen(false)} className="p-1 rounded hover:bg-[#1f1f22]">
                    <ChevronRight size={16} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <AIAssistant onInsert={(text) => setContent(prev => prev + (prev ? "\n\n" : "") + text)} />
                  {rhymeWord && <RhymePanel word={rhymeWord} />}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapsed AI panel toggle */}
        {!aiPanelOpen && (
          <button
            onClick={() => setAiPanelOpen(true)}
            className="fixed right-0 top-1/2 -translate-y-1/2 z-20 p-2 bg-[#121214] border border-[#1f1f22] rounded-l-lg text-[#A1A1AA] hover:text-[#D4AF37]"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Modals */}
      <PublishModal
        isOpen={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        draftId={draftId}
        initialTitle={title}
        onPublished={() => navigate(`/poem/${draftId}`)}
      />
      <VersionHistoryModal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        poemId={draftId}
        onRestore={(content) => setContent(content)}
      />
      <ShortcutModal isOpen={shortcutModalOpen} onClose={() => setShortcutModalOpen(false)} />

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Publish Modal (updated with sound)
// ─────────────────────────────────────────────────────────────────────────────
function PublishModal({ isOpen, onClose, draftId, initialTitle, onPublished }) {
  const [title, setTitle] = useState(initialTitle);
  const [isPremium, setIsPremium] = useState(false);
  const [price, setPrice] = useState("5");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handlePublish = async () => {
    setLoading(true);
    await supabase.from("poems").update({
      title,
      is_published: true,
      is_premium: isPremium,
      price: isPremium ? parseFloat(price) : 0,
    }).eq("id", draftId);
    setLoading(false);
    onPublished();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={onClose}>
      <div className="bg-[#121214] border border-[#1f1f22] rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-serif mb-4">Publish Poem</h2>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="w-full bg-[#0B0B0C] border border-[#1f1f22] rounded-lg p-3 mb-4" />
        <label className="flex items-center gap-2 mb-4">
          <input type="checkbox" checked={isPremium} onChange={e => setIsPremium(e.target.checked)} />
          <span>Premium (paid)</span>
        </label>
        {isPremium && (
          <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="Price (USD)" className="w-full bg-[#0B0B0C] border border-[#1f1f22] rounded-lg p-3 mb-4" />
        )}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 border border-[#2a2a2e] rounded-lg py-2">Cancel</button>
          <button onClick={handlePublish} disabled={loading} className="flex-1 bg-[#D4AF37] text-black rounded-lg py-2 font-medium">
            {loading ? <Loader2 className="animate-spin mx-auto" size={16} /> : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Version History Modal (using collaboration_events)
// ─────────────────────────────────────────────────────────────────────────────
function VersionHistoryModal({ isOpen, onClose, poemId, onRestore }) {
  const [versions, setVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !poemId) return;
    const fetchVersions = async () => {
      const { data } = await supabase
        .from("collaboration_events")
        .select("*")
        .eq("collaboration_id", poemId)
        .eq("type", "edit")
        .order("created_at", { ascending: false })
        .limit(20);
      setVersions(data || []);
      setLoading(false);
    };
    fetchVersions();
  }, [isOpen, poemId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={onClose}>
      <div className="bg-[#121214] border border-[#1f1f22] rounded-2xl p-6 w-full max-w-md max-h-[70vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-serif mb-4">Version History</h2>
        {loading ? (
          <Loader2 className="animate-spin mx-auto" />
        ) : versions.length === 0 ? (
          <p className="text-[#A1A1AA] text-sm">No previous versions found.</p>
        ) : (
          <div className="space-y-3">
            {versions.map((v, i) => (
              <div key={v.id} className="p-3 bg-[#1f1f22] rounded-lg">
                <p className="text-xs text-[#A1A1AA]">{new Date(v.created_at).toLocaleString()}</p>
                <p className="text-sm text-white line-clamp-2">{v.content?.text || "Empty"}</p>
                <button
                  onClick={() => onRestore(v.content?.text || "")}
                  className="mt-2 text-xs text-[#D4AF37] hover:underline"
                >
                  Restore this version
                </button>
              </div>
            ))}
          </div>
        )}
        <button onClick={onClose} className="mt-4 w-full bg-[#1f1f22] rounded-lg py-2">Close</button>
      </div>
    </div>
  );
}