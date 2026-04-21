import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, AlertCircle } from "lucide-react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
}

export function VideoModal({ isOpen, onClose, videoUrl }: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setIsLoading(true);
      setError(false);
    } else {
      document.body.style.overflow = "";
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLoadedData = () => setIsLoading(false);
  const handleError = () => {
    setIsLoading(false);
    setError(true);
  };

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          className="relative max-w-4xl w-full rounded-2xl overflow-hidden bg-[#121214]"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition"
          >
            <X size={20} />
          </button>

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#121214]">
              <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#121214] text-[#A1A1AA]">
              <AlertCircle size={48} className="text-red-400 mb-4" />
              <p>Failed to load video.</p>
              <p className="text-sm mt-2">Please check the URL or try again later.</p>
            </div>
          )}

          <video
            ref={videoRef}
            src={videoUrl}
            controls
            autoPlay
            onLoadedData={handleLoadedData}
            onError={handleError}
            className="w-full rounded-2xl"
            playsInline
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
