import Link from "next/link";
import type { ReactNode } from "react";

/* ---------- Shared class strings ---------- */
export const serif = "font-[family-name:var(--font-cormorant)]";

export const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B20947]";

/** Double outline card: 2px pink frame plus inner white ring */
export const card =
  "rounded-2xl border-2 border-[#E8B8C5] bg-white ring-2 ring-inset ring-white";
export const cardCream =
  "rounded-2xl border-2 border-[#E8B8C5] bg-[#FCF8F3] ring-2 ring-inset ring-white";

/** Glass pill (same recipe as the New Arrivals Shop Now button) */
export const glassBtn = `inline-block rounded-full border border-white/20 bg-white/10 px-4 py-2 text-center text-[9px] font-semibold uppercase tracking-[0.15em] text-[#ad0e48] backdrop-blur-md transition-colors duration-300 hover:bg-white/25 sm:px-9 sm:py-3.5 sm:text-sm sm:tracking-[0.2em] ${focusRing}`;

/** White button, pink outline, deep rose text (same recipe as Add to Cart) */
export const outlineBtn = `inline-flex items-center justify-center rounded-[10px] border-[1.5px] border-[#E99A9F] bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.05em] text-[#B20947] sm:px-5 sm:py-2.5 sm:text-xs md:text-sm disabled:cursor-not-allowed disabled:border-[#d9cfd2] disabled:text-[#b3a9ab] ${focusRing}`;

/** Solid deep rose, only for the main checkout and submit actions */
export const solidBtn = `inline-flex items-center justify-center rounded-[10px] bg-[#B20947] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.05em] text-white transition-colors hover:bg-[#8F3057] disabled:opacity-60 sm:text-xs md:text-sm ${focusRing}`;

export const inputCls =
  "w-full rounded-[10px] border border-[#E8B8C5] bg-white px-4 py-3 text-[15px] text-[#332B2B] placeholder:text-[#b3a9ab] focus:border-[#B20947] focus:outline-none focus:ring-2 focus:ring-[#E99A9F]/40";

/* ---------- Flower motif: thin five-petal blossom ---------- */
export function Flower({
  size = 24,
  stroke = 1.2,
  className = "",
}: {
  size?: number;
  stroke?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      className={className}
      aria-hidden="true"
    >
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse
          key={a}
          cx="24"
          cy="12"
          rx="6"
          ry="10"
          transform={`rotate(${a} 24 24)`}
        />
      ))}
      <circle cx="24" cy="24" r="2.5" />
    </svg>
  );
}

/** Round flower badge that sits on a card's top edge */
export function FlowerBadge() {
  return (
    <span className="absolute -top-5 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-[#E8B8C5] bg-white text-[#E99A9F]">
      <Flower size={22} />
    </span>
  );
}

/* ---------- Page shell and hero banner ---------- */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[#FCF8F3] pb-20 pt-5 sm:pt-8">
      <div className="mx-auto w-full max-w-[1100px] px-4 sm:px-8">
        {children}
      </div>
    </main>
  );
}

export function PageHero({
  label,
  title,
  sub,
  top,
  children,
}: {
  label: string;
  title: string;
  sub?: string;
  top?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden rounded-[28px] bg-gradient-to-br from-[#F9DDE2] via-[#F2BFC7] to-[#E99A9F]/80 px-6 py-12 text-center sm:py-16 md:rounded-[44px]">
      {/* soft light blobs so the glass button has something to blur */}
      <span className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-white/50 blur-3xl" />
      <span className="pointer-events-none absolute -bottom-20 right-0 h-64 w-64 rounded-full bg-[#FFF5F7]/60 blur-3xl" />
      <Flower
        size={190}
        stroke={0.7}
        className="pointer-events-none absolute -left-10 bottom-[-50px] text-white/60"
      />
      <Flower
        size={150}
        stroke={0.7}
        className="pointer-events-none absolute -right-8 -top-8 rotate-12 text-white/60"
      />

      <div className="relative">
        {top}
        <p className="text-[12px] uppercase tracking-[0.28em] text-[#B20947] sm:text-[14px]">
          {label}
        </p>
        <h1
          className={`${serif} mt-3 text-[34px] font-medium leading-tight text-[#332B2B] sm:text-[48px]`}
        >
          {title}
        </h1>
        <span className="mx-auto mt-4 block h-[2px] w-14 bg-white/80" />
        {sub && (
          <p
            className={`${serif} mx-auto mt-4 max-w-md text-[18px] italic leading-relaxed text-[#6f6565] sm:text-[20px]`}
          >
            {sub}
          </p>
        )}
        {children && (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:mt-7">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------- Empty state ---------- */
export function EmptyState({
  icon,
  title,
  text,
  href,
  action,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  href: string;
  action: string;
}) {
  return (
    <div className="flex flex-col items-center px-4 py-14 text-center">
      <div className="relative flex h-24 w-20 items-center justify-center rounded-t-full border-2 border-[#E8B8C5] bg-white text-[#B5607A]">
        {icon}
      </div>
      <h2 className={`${serif} mt-6 text-[28px] font-medium text-[#332B2B]`}>
        {title}
      </h2>
      <p className="mt-2 max-w-sm text-[15px] text-[#6f6565]">{text}</p>
      <Link href={href} className={`${outlineBtn} mt-6 px-8`}>
        {action}
      </Link>
    </div>
  );
}

/* ---------- Clean centred page title (Kalki-style layout, Izha colours) ---------- */
export function PageTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="py-8 text-center sm:py-12">
      <h1
        className={`${serif} text-[40px] font-medium leading-tight text-[#332B2B] sm:text-[56px]`}
      >
        {title}
      </h1>
      <span className="mx-auto mt-3 block h-[2px] w-14 bg-[#E8B8C5]" />
      {sub && <p className="mt-4 text-[15px] text-[#6f6565]">{sub}</p>}
    </div>
  );
}

/* ---------- Simple empty message with one button ---------- */
export function EmptyBlock({
  text,
  href,
  action,
}: {
  text: string;
  href: string;
  action: string;
}) {
  return (
    <div className="flex flex-col items-center px-4 pb-16 pt-2 text-center">
      <p className={`${serif} text-[24px] text-[#332B2B] sm:text-[28px]`}>
        {text}
      </p>
      <Link href={href} className={`${solidBtn} mt-6 px-10 py-3.5`}>
        {action}
      </Link>
    </div>
  );
}