import { syllable } from "syllable";

export const countWords = (text: string) =>
  text.trim().split(/\s+/).filter(Boolean).length;
export const countChars = (text: string) => text.length;
export const countLines = (text: string) => text.split(/\n/).length;
export const countSyllables = (text: string) => syllable(text);
export const readingTime = (text: string) => Math.ceil(countWords(text) / 150);
export const stripHtml = (html: string) =>
  new DOMParser().parseFromString(html, "text/html").body.textContent || "";
