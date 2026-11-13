import { useCallback, useEffect, useState } from "react";

/* Reviews shown in the landing page section "Words from our customers".
   The admin manages them at /admin/landing-reviews. */

export const HOME_REVIEWS_KEY = "izha-home-reviews";
const CHANGE_EVENT = "izha-home-reviews-changed";

export type HomeReview = {
  id: string;
  name: string;
  place: string;
  product: string;
  rating: number; // 1 to 5
  text: string;
  visible: boolean; // true = shown on the landing page
  sourceId?: string; // set when copied from a product review
  createdAt: string;
};

export const DEFAULT_HOME_REVIEWS: HomeReview[] = [
  {
    id: "hr-sample-1",
    name: "Customer name",
    place: "Kochi",
    product: "Embroidered kurta",
    rating: 5,
    text: "Sample review. Write what the customer said about the fit, the fabric and the delivery here.",
    visible: true,
    createdAt: "2026-11-13",
  },
  {
    id: "hr-sample-2",
    name: "Customer name",
    place: "Aluva",
    product: "Cotton dress",
    rating: 5,
    text: "Sample review. A short, honest line works better than a long one.",
    visible: true,
    createdAt: "2026-11-13",
  },
  {
    id: "hr-sample-3",
    name: "Customer name",
    place: "Thrissur",
    product: "Festive set",
    rating: 4,
    text: "Sample review. Mention the occasion she wore it for, if she shared one.",
    visible: true,
    createdAt: "2026-11-13",
  },
];

function read(): HomeReview[] {
  try {
    const raw = localStorage.getItem(HOME_REVIEWS_KEY);
    if (raw === null) return DEFAULT_HOME_REVIEWS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_HOME_REVIEWS;
  } catch {
    return DEFAULT_HOME_REVIEWS;
  }
}

/** Returns [reviews, update, ready]. `ready` is false until the browser has loaded the saved data. */
export function useHomeReviews() {
  const [reviews, setReviews] = useState<HomeReview[]>(DEFAULT_HOME_REVIEWS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const load = () => {
      setReviews(read());
      setReady(true);
    };
    load();
    window.addEventListener("storage", load);
    window.addEventListener(CHANGE_EVENT, load);
    return () => {
      window.removeEventListener("storage", load);
      window.removeEventListener(CHANGE_EVENT, load);
    };
  }, []);

  const update = useCallback(
    (next: HomeReview[] | ((prev: HomeReview[]) => HomeReview[])) => {
      const value = typeof next === "function" ? next(read()) : next;
      try {
        localStorage.setItem(HOME_REVIEWS_KEY, JSON.stringify(value));
      } catch {
        /* storage full or blocked */
      }
      window.dispatchEvent(new Event(CHANGE_EVENT));
    },
    []
  );

  return [reviews, update, ready] as const;
}