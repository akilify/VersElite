import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { AIAssistant } from '@/components/AIAssistant';
import { RhymePanel } from '@/components/RhymePanel';

interface AISidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  rhymeWord: string;
  draftId: string | null;
  currentContent?: string;
  onInsert: (text: string) => void;
}

export function AISidebar({
  isOpen,
  onToggle,
  rhymeWord,
  draftId,
  currentContent,
  onInsert,
}: AISidebarProps) {
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 360, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-l border-[#1f1f22] bg-[#0B0B0C] overflow-hidden"
          >
            <div className="w-[360px] h-full flex flex-col">
              <div className="p-4 border-b border-[#1f1f22] flex items-center justify-between">
                <h3 className="font-serif text-sm">AI Assistant</h3>
                <button onClick={onToggle} className="p-1 rounded hover:bg-[#1f1f22]">
                  <ChevronRight size={16} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <AIAssistant
                  draftId={draftId}
                  currentContent={currentContent}
                  onInsert={onInsert}
                />
                {rhymeWord && <RhymePanel word={rhymeWord} />}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-20 p-2 bg-[#121214] border border-[#1f1f22] rounded-l-lg"
        >
          <ChevronLeft size={16} />
        </button>
      )}
    </>
  );
}
