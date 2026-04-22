import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function CursorTrail({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLElement>;
}) {
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>(
    [],
  );
  const counter = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      setTrail((prev) => [
        ...prev.slice(-8),
        {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          id: counter.current++,
        },
      ]);
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
