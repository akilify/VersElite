import { ChevronRight } from "lucide-react";

export function ShortcutsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const shortcuts = [
    { keys: "Ctrl + S", description: "Save draft" },
    { keys: "Ctrl + Shift + F", description: "Toggle focus mode" },
    { keys: "Ctrl + /", description: "Toggle AI panel" },
    { keys: "?", description: "Show this help" },
  ];
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <div
        className="bg-[#121214] border border-[#1f1f22] rounded-2xl p-6 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-serif">Keyboard Shortcuts</h2>
          <button onClick={onClose}>
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="space-y-2">
          {shortcuts.map((s) => (
            <div key={s.keys} className="flex justify-between text-sm">
              <span className="text-[#A1A1AA]">{s.description}</span>
              <kbd className="px-2 py-0.5 bg-[#1f1f22] rounded text-[#D4AF37] text-xs">
                {s.keys}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
