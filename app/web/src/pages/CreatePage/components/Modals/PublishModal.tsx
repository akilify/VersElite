import { useState } from "react";
import { Loader2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  draftId: string | null;
  initialTitle: string;
  onPublished: (title: string, isPremium: boolean, price: number) => void;
}

export function PublishModal({
  isOpen,
  onClose,
  draftId,
  initialTitle,
  onPublished,
}: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [isPremium, setIsPremium] = useState(false);
  const [price, setPrice] = useState("5");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handlePublish = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network
    onPublished(title, isPremium, parseFloat(price) || 0);
    setLoading(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <div
        className="bg-[#121214] border border-[#1f1f22] rounded-2xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-serif mb-4">Publish Poem</h2>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full bg-[#0B0B0C] border border-[#1f1f22] rounded-lg p-3 mb-4"
        />
        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={isPremium}
            onChange={(e) => setIsPremium(e.target.checked)}
          />
          <span>Premium (paid)</span>
        </label>
        {isPremium && (
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price (USD)"
            className="w-full bg-[#0B0B0C] border border-[#1f1f22] rounded-lg p-3 mb-4"
          />
        )}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-[#2a2a2e] rounded-lg py-2"
          >
            Cancel
          </button>
          <button
            onClick={handlePublish}
            disabled={loading}
            className="flex-1 bg-[#D4AF37] text-black rounded-lg py-2 font-medium"
          >
            {loading ? (
              <Loader2 className="animate-spin mx-auto" size={16} />
            ) : (
              "Publish"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
