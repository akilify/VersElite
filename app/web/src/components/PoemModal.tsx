import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { X } from "lucide-react";
import { CommentsSection } from "./CommentsSection";

interface Poem {
  id: string;
  title: string;
  content: string;
  author: string;
}

interface PoemModalProps {
  poem: Poem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PoemModal({ poem, isOpen, onClose }: PoemModalProps) {
  if (!poem) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" aria-hidden="true" />

      {/* Modal container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#121214] border border-[#1f1f22] rounded-2xl shadow-2xl">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-[#1f1f22] text-[#A1A1AA] hover:text-white hover:bg-[#2a2a2e] transition"
          >
            <X size={20} />
          </button>

          <div className="p-6">
            <DialogTitle className="text-2xl font-serif text-[#F5F5F5] mb-4">
              {poem.title}
            </DialogTitle>
            <p className="text-[#A1A1AA] leading-relaxed whitespace-pre-wrap mb-6">
              {poem.content}
            </p>
            <div className="text-sm text-[#D4AF37] mb-6">— {poem.author}</div>

            <hr className="border-[#1f1f22] my-6" />

            <CommentsSection poemId={poem.id} />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
