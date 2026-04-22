import { useMemo } from "react";
import {
  countWords,
  countChars,
  countLines,
  countSyllables,
  readingTime,
  stripHtml,
} from "../utils/textStats";
import type { EditorStats } from "../types";

export function useEditorStats(content: string): EditorStats {
  const plainText = useMemo(() => stripHtml(content), [content]);
  return useMemo(
    () => ({
      words: countWords(plainText),
      chars: countChars(plainText),
      lines: countLines(plainText),
      syllables: countSyllables(plainText),
      readingTime: readingTime(plainText),
    }),
    [plainText],
  );
}
