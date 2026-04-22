import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  poemId: string | null;
  onRestore: (content: string) => void;
}

export function VersionHistoryModal({
  isOpen,
  onClose,
  poemId,
  onRestore,
}: Props) {
  const [versions, setVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !poemId) return;
    supabase
      .from("poem_versions")
      .select("*")
      .eq("poem_id", poemId)
      .order("created_at", { ascending: false })
      .limit(30)
      .then(({ data }) => {
        setVersions(data || []);
        setLoading(false);
      });
  }, [isOpen, poemId]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <div
        className="bg-[#121214] border border-[#1f1f22] rounded-2xl p-6 w-full max-w-md max-h-[70vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-serif mb-4">Version History</h2>
        {loading ? (
          <Loader2 className="animate-spin mx-auto" />
        ) : versions.length === 0 ? (
          <p className="text-[#A1A1AA]">No previous versions.</p>
        ) : (
          <div className="space-y-3">
            {versions.map((v) => (
              <div key={v.id} className="p-3 bg-[#1f1f22] rounded-lg">
                <p className="text-xs text-[#A1A1AA] mb-2">
                  {new Date(v.created_at).toLocaleString()}
                </p>
                <p className="text-sm text-white line-clamp-3">
                  {v.content?.slice(0, 150)}
                </p>
                <button
                  onClick={() => {
                    onRestore(v.content);
                    onClose();
                  }}
                  className="mt-2 text-xs text-[#D4AF37] hover:underline"
                >
                  Restore
                </button>
              </div>
            ))}
          </div>
        )}
        <button
          onClick={onClose}
          className="mt-4 w-full bg-[#1f1f22] rounded-lg py-2"
        >
          Close
        </button>
      </div>
    </div>
  );
}
