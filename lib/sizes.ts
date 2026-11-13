import { ALL_CLOTH_SIZES } from "@/lib/demo-store";

const LETTER_ORDER = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL", "3XL", "4XL", "5XL"];

/** Keeps sizes in a sensible order: XS, S, M... first, then numbers (32, 34, 36...) ascending. */
export function sortSizes(list: string[]): string[] {
  const rank = (s: string) => {
    if (/^\d+(\.\d+)?$/.test(s)) return { group: 1, n: Number(s) };
    const i = LETTER_ORDER.indexOf(s);
    return i >= 0 ? { group: 0, n: i } : { group: 2, n: 0 };
  };
  return [...list].sort((a, b) => {
    const ra = rank(a);
    const rb = rank(b);
    return ra.group - rb.group || ra.n - rb.n || a.localeCompare(b);
  });
}

/** True when every size is one of the standard letter sizes (XS to XXXL). */
export function isStandardSizeSet(sizes: string[]): boolean {
  const standard = ALL_CLOTH_SIZES as readonly string[];
  return sizes.every((s) => standard.includes(s));
}

/** One row of the size measurement chart (values in inches, typed by the admin). */
export type SizeChartRow = { size: string; bust: string; waist: string; hip: string };

/** Adds the inch mark to plain numbers: "34" becomes 34". */
export function formatMeasure(value: string): string {
  const t = value.trim();
  return /^\d+(\.\d+)?$/.test(t) ? `${t}"` : t;
}