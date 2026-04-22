import { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useHotkeys } from "react-hotkeys-hook";
import useSound from "use-sound";
import { AuthContext } from "@/features/auth/AuthProvider";
import { FloatingNav } from "@/components/FloatingNav";
import { AuthModal } from "@/components/AuthModal";
import { Minimize2 } from "lucide-react";
import { CursorTrail } from "@/components/CursorTrail";
import { CreateHeader } from "./components/CreateHeader";
import { EditorWorkspace } from "./components/EditorWorkspace";
import { AISidebar } from "./components/AISidebar";
import { PublishModal } from "./components/Modals/PublishModal";
import { VersionHistoryModal } from "./components/Modals/VersionHistoryModal";
import { ShortcutsModal } from "./components/Modals/ShortcutsModal";
import { useCreateDraft } from "./hooks/useCreateDraft";
import { useCollaborationMode } from "./hooks/useCollaborationMode";
import { useMediaUpload } from "./hooks/useMediaUpload";
import { useEditorStats } from "./hooks/useEditorStats";
import { stripHtml } from "./utils/textStats";

export default function CreatePage() {
  const { session } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [aiPanelOpen, setAiPanelOpen] = useState(true);
  const [rhymeWord, setRhymeWord] = useState("");
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);

  const editorContainerRef = useRef<HTMLDivElement>(null);
  const [playPublish] = useSound("/sounds/publish.mp3", { volume: 0.4 });

  // Auth guard
  if (!session) {
    return (
      <>
        <div className="min-h-screen bg-[#0B0B0C] flex items-center justify-center text-white">
          <div className="text-center">
            <h1 className="text-2xl font-serif mb-4">Sign in to write</h1>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-[#D4AF37] text-black px-6 py-3 rounded-full"
            >
              Sign In
            </button>
          </div>
        </div>
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </>
    );
  }

  const {
    draft,
    updateDraft,
    saveStatus,
    isOnline,
    pendingPublishes,
    publish,
  } = useCreateDraft(session);
  const {
    isCollaborative,
    collabId,
    toggle: toggleCollaboration,
  } = useCollaborationMode(draft.id, draft.title, session.user.id);
  const { upload } = useMediaUpload(session.user.id);
  const stats = useEditorStats(draft.content);
  const plainText = stripHtml(draft.content);

  const handlePublish = () => {
    playPublish();
    setPublishModalOpen(true);
  };

  const handleContentUpdate = (newContent: string) => {
    updateDraft({ content: newContent });
  };

  const handleToggleCollaboration = async () => {
    await toggleCollaboration(draft.content, handleContentUpdate);
  };

  // Keyboard shortcuts
  useHotkeys("ctrl+shift+f", () => setFocusMode(!focusMode), [focusMode]);
  useHotkeys("ctrl+/", () => setAiPanelOpen(!aiPanelOpen), [aiPanelOpen]);
  useHotkeys("ctrl+s", (e) => e.preventDefault(), []);
  useHotkeys("?", () => setShortcutsModalOpen(true), []);

  return (
    <div
      className={`min-h-screen bg-[#0B0B0C] text-white ${focusMode ? "fixed inset-0 z-50" : ""}`}
    >
      <FloatingNav />
      <CreateHeader
        title={draft.title}
        onTitleChange={(t) => updateDraft({ title: t })}
        stats={stats}
        isOnline={isOnline}
        saveStatus={saveStatus}
        type={draft.type}
        onTypeChange={(t) => updateDraft({ type: t })}
        isCollaborative={isCollaborative}
        onToggleCollaboration={handleToggleCollaboration}
        showLineNumbers={showLineNumbers}
        onToggleLineNumbers={() => setShowLineNumbers(!showLineNumbers)}
        onOpenHistory={() => setHistoryModalOpen(true)}
        onFocusMode={() => setFocusMode(true)}
        onOpenShortcuts={() => setShortcutsModalOpen(true)}
        onPublish={handlePublish}
        pendingCount={pendingPublishes.length}
        focusMode={focusMode}
      />
      {focusMode && (
        <button
          onClick={() => setFocusMode(false)}
          className="fixed top-4 right-4 z-50 p-2 bg-[#121214] rounded-lg"
        >
          <Minimize2 size={16} />
        </button>
      )}
      <div
        className={`flex ${focusMode ? "h-screen" : "min-h-[calc(100vh-60px)]"}`}
        ref={editorContainerRef}
      >
        <CursorTrail containerRef={editorContainerRef} />
        <div className={`flex-1 p-6 ${aiPanelOpen ? "pr-4" : ""}`}>
          <EditorWorkspace
            type={draft.type}
            content={draft.content}
            onContentChange={handleContentUpdate}
            isCollaborative={isCollaborative}
            collaborationId={collabId}
            mediaUrl={draft.mediaUrl}
            onMediaChange={(url) => updateDraft({ mediaUrl: url })}
            onMediaUpload={upload}
            focusMode={focusMode}
            showLineNumbers={showLineNumbers}
            plainText={plainText}
          />
        </div>
        <AISidebar
          isOpen={aiPanelOpen}
          onToggle={() => setAiPanelOpen(!aiPanelOpen)}
          rhymeWord={rhymeWord}
          onInsert={(text) =>
            handleContentUpdate(
              draft.content + (draft.content ? "\n\n" : "") + text,
            )
          }
        />
      </div>
      <PublishModal
        isOpen={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        draftId={draft.id}
        initialTitle={draft.title}
        onPublished={(title, isPremium, price) => {
          publish({ title, isPremium, price });
          navigate(`/poem/${draft.id}`);
        }}
      />
      <VersionHistoryModal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        poemId={draft.id}
        onRestore={handleContentUpdate}
      />
      <ShortcutsModal
        isOpen={shortcutsModalOpen}
        onClose={() => setShortcutsModalOpen(false)}
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
