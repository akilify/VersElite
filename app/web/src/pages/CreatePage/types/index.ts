export type PoemType = "written" | "spoken_audio" | "spoken_video";

export interface EditorStats {
  words: number;
  chars: number;
  lines: number;
  syllables: number;
  readingTime: number;
}

export interface Draft {
  id: string | null;
  title: string;
  content: string;
  type: PoemType;
  mediaUrl: string | null;
  isPublished: boolean;
  updatedAt: string;
}
