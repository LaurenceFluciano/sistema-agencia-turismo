import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function fixEncoding(str) {
  if (typeof str !== 'string' || !str) return str;
  // quick heuristic: look for typical mis-encoded sequences like Ã
  if (/Ã[\x80-\xBF]?/i.test(str)) {
    try {
      // decode Latin1-encoded string that was interpreted as UTF-8
      // eslint-disable-next-line no-undef
      return decodeURIComponent(escape(str));
    } catch (e) {
      return str;
    }
  }
  return str;
}
