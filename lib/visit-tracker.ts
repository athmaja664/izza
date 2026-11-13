// Call trackEvent() from the CUSTOMER site to record visits and funnel steps.
// The admin Reports page reads these events.

export const VISIT_EVENTS_KEY = "izha-visit-events";

export type StageType =
  | "visit"
  | "product_view"
  | "add_to_cart"
  | "checkout_start"
  | "order_placed";

export const STAGES: { type: StageType; label: string }[] = [
  { type: "visit", label: "Visited site" },
  { type: "product_view", label: "Viewed a product" },
  { type: "add_to_cart", label: "Added to cart" },
  { type: "checkout_start", label: "Started checkout" },
  { type: "order_placed", label: "Placed order" },
];

export type VisitEvent = {
  id: string;
  sessionId: string;
  type: StageType;
  at: string; // ISO date
  page?: string;
  productName?: string;
  customerName?: string;
};

function sessionId(): string {
  try {
    let id = sessionStorage.getItem("izha-session-id");
    if (!id) {
      id = `s-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      sessionStorage.setItem("izha-session-id", id);
    }
    return id;
  } catch {
    return "s-unknown";
  }
}

export function readEvents(): VisitEvent[] {
  try {
    const raw = localStorage.getItem(VISIT_EVENTS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeEvents(list: VisitEvent[]) {
  try {
    localStorage.setItem(VISIT_EVENTS_KEY, JSON.stringify(list.slice(-5000)));
    window.dispatchEvent(new Event("izha-visit-events-changed"));
  } catch {
    /* storage full or blocked: ignore */
  }
}

export function trackEvent(
  type: StageType,
  meta: Partial<Pick<VisitEvent, "page" | "productName" | "customerName">> = {}
) {
  if (typeof window === "undefined") return;
  const list = readEvents();
  list.push({
    id: `ev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    sessionId: sessionId(),
    type,
    at: new Date().toISOString(),
    page: meta.page ?? window.location.pathname,
    productName: meta.productName,
    customerName: meta.customerName,
  });
  writeEvents(list);
}