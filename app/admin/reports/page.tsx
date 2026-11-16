"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, LogOut, ShoppingBag, Users } from "lucide-react";
import AdminShell, { inputCls, outlineBtn } from "@/components/admin/AdminShell";
import { serif } from "@/components/izha/ui";
import {
  STAGES,
  readEvents,
  writeEvents,
  type StageType,
  type VisitEvent,
} from "@/lib/visit-tracker";

const CRIMSON = "#B20947";

type Range = "7" | "30" | "all";

type SessionRow = {
  sessionId: string;
  customerName: string;
  firstSeen: string;
  lastSeen: string;
  lastPage: string;
  lastProduct: string;
  reached: number; // index of furthest stage
  converted: boolean;
};

const stageIndex = (t: StageType) => STAGES.findIndex((s) => s.type === t);

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

function sampleEvents(): VisitEvent[] {
  const names = ["Anjali R.", "Meera S.", "Fathima K.", "Divya P.", "Neha J.", "Sana M.", "Riya T.", "Lakshmi V."];
  const products = ["Rose Cotton Kurta", "Maternity Wrap Dress", "Floral Kurta Set", "Embroidered Top"];
  const out: VisitEvent[] = [];
  for (let i = 0; i < 40; i++) {
    const depth = Math.min(4, Math.floor(Math.pow(Math.random(), 1.6) * 5));
    const start = Date.now() - Math.floor(Math.random() * 20 * 86400000);
    const sid = `sample-${i}`;
    const name = Math.random() > 0.5 ? names[i % names.length] : undefined;
    const product = products[i % products.length];
    for (let d = 0; d <= depth; d++) {
      out.push({
        id: `sample-${i}-${d}`,
        sessionId: sid,
        type: STAGES[d].type,
        at: new Date(start + d * 120000).toISOString(),
        page: ["/", `/product/${i}`, "/cart", "/checkout", "/order-success"][d],
        productName: d >= 1 ? product : undefined,
        customerName: d >= 3 ? name : undefined,
      });
    }
  }
  return out;
}

/* ---------- Layout pieces (same structure as the dashboard) ---------- */

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="h-full rounded-sm border border-[#E8CFD2] bg-[#FAF1E4] p-4 transition-colors hover:border-[#B20947]/40 sm:p-6">
      <p className="m-0 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] text-black/50 sm:text-[11px] sm:tracking-[0.25em]">
        {icon} {label}
      </p>
      <p
        className={`${serif} lining-nums mb-0 mt-3 break-words text-[32px] font-medium leading-none sm:mt-4 sm:text-[46px]`}
        style={{ color: CRIMSON }}
      >
        {value}
      </p>
    </div>
  );
}

function Panel({
  title,
  note,
  className = "",
  children,
}: {
  title: string;
  note?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`min-w-0 rounded-sm border border-[#E8CFD2] bg-[#FAF1E4] p-4 sm:p-6 ${className}`}>
      <h2 className={`${serif} m-0 text-[24px] font-medium sm:text-[28px]`} style={{ color: CRIMSON }}>
        {title}
      </h2>
      {note && <p className="mb-0 mt-1 text-[12px] text-black/45">{note}</p>}
      <div className="mt-4 sm:mt-5">{children}</div>
    </section>
  );
}

export default function AdminReportsPage() {
  const [events, setEvents] = useState<VisitEvent[]>([]);
  const [range, setRange] = useState<Range>("30");
  const [onlyDropped, setOnlyDropped] = useState(false);
  // "now" is set in the browser only. Calling Date.now() during render breaks
  // Next.js prerendering (the Vercel build error).
  const [now, setNow] = useState(0);

  useEffect(() => {
    const load = () => {
      setEvents(readEvents());
      setNow(Date.now());
    };
    load();
    window.addEventListener("storage", load);
    window.addEventListener("izha-visit-events-changed", load);
    return () => {
      window.removeEventListener("storage", load);
      window.removeEventListener("izha-visit-events-changed", load);
    };
  }, []);

  const sessions = useMemo<SessionRow[]>(() => {
    const cutoff = range === "all" || !now ? 0 : now - Number(range) * 86400000;
    const map = new Map<string, VisitEvent[]>();
    for (const e of events) {
      if (new Date(e.at).getTime() < cutoff) continue;
      map.set(e.sessionId, [...(map.get(e.sessionId) ?? []), e]);
    }
    const rows: SessionRow[] = [];
    map.forEach((list, sessionId) => {
      const sorted = [...list].sort((a, b) => a.at.localeCompare(b.at));
      const last = sorted[sorted.length - 1];
      const reached = Math.max(...sorted.map((e) => stageIndex(e.type)));
      rows.push({
        sessionId,
        customerName: [...sorted].reverse().find((e) => e.customerName)?.customerName ?? "Guest visitor",
        firstSeen: sorted[0].at,
        lastSeen: last.at,
        lastPage: last.page ?? "-",
        lastProduct: [...sorted].reverse().find((e) => e.productName)?.productName ?? "-",
        reached,
        converted: reached === STAGES.length - 1,
      });
    });
    return rows.sort((a, b) => b.lastSeen.localeCompare(a.lastSeen));
  }, [events, range, now]);

  const funnel = useMemo(
    () =>
      STAGES.map((s, i) => ({
        ...s,
        count: sessions.filter((r) => r.reached >= i).length,
      })),
    [sessions]
  );

  const total = sessions.length;
  const converted = sessions.filter((r) => r.converted).length;
  const dropped = total - converted;
  const convRate = total ? ((converted / total) * 100).toFixed(1) : "0.0";

  const shown = onlyDropped ? sessions.filter((r) => !r.converted) : sessions;

  const exportCsv = () => {
    const head = ["Visitor", "First seen", "Last seen", "Last page", "Last product", "Status"];
    const lines = shown.map((r) =>
      [
        r.customerName,
        r.firstSeen,
        r.lastSeen,
        r.lastPage,
        r.lastProduct,
        r.converted ? "Placed order" : `Dropped after: ${STAGES[r.reached].label}`,
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    );
    const blob = new Blob([[head.join(","), ...lines].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `visitor-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const statCards = [
    { label: "Total visitors", value: String(total), icon: <Users size={14} /> },
    { label: "Placed an order", value: String(converted), icon: <ShoppingBag size={14} /> },
    { label: "Dropped off", value: String(dropped), icon: <LogOut size={14} /> },
    { label: "Conversion rate", value: `${convRate}%`, icon: <ShoppingBag size={14} /> },
  ];

  const statusPill = (r: SessionRow) => (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${
        r.converted ? "bg-[#eef7f0] text-[#3a6b42]" : "bg-[#FFF5F7] text-[#B20947]"
      }`}
    >
      {r.converted ? "Placed order" : `Dropped after: ${STAGES[r.reached].label}`}
    </span>
  );

  return (
    <AdminShell title="Visitor Reports">
      {/* Heading block */}
      <h2
        className={`${serif} mb-2 mt-0 break-words font-medium leading-tight`}
        style={{ color: CRIMSON, fontSize: "clamp(1.75rem, 4vw, 3rem)" }}
      >
        Visitor Reports
      </h2>
      <p className="mb-6 mt-0 text-[14px] text-black/60 sm:text-[15px] md:mb-10">
        See who visited the store and where they dropped off before buying
      </p>

      {/* Counts: two per row on phones */}
      <section aria-label="Visitor counts" className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {statCards.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} />
        ))}
      </section>

      {/* Filters */}
      <div className="mt-4 sm:mt-6">
        <Panel title="Filters" note="Date range, drop-offs and export">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <select
              value={range}
              onChange={(e) => setRange(e.target.value as Range)}
              className={`${inputCls} w-full !py-2 !text-[13px] sm:!w-auto`}
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="all">All time</option>
            </select>

            <label className="flex cursor-pointer items-center gap-2 text-[13px] text-[#332B2B]">
              <input
                type="checkbox"
                checked={onlyDropped}
                onChange={(e) => setOnlyDropped(e.target.checked)}
                className="h-4 w-4 accent-[#B20947]"
              />
              Show only drop-offs
            </label>

            <div className="flex flex-wrap gap-2 sm:ml-auto">
              <button type="button" onClick={exportCsv} className={`${outlineBtn} gap-1.5`}>
                <Download size={14} /> Export CSV
              </button>
              {events.length === 0 && (
                <button
                  type="button"
                  onClick={() => writeEvents(sampleEvents())}
                  className={outlineBtn}
                >
                  Load sample data
                </button>
              )}
            </div>
          </div>
        </Panel>
      </div>

      {/* Funnel */}
      <div className="mt-3 sm:mt-4">
        <Panel title="Where visitors drop off">
          <div className="space-y-4">
            {funnel.map((s, i) => {
              const pct = total ? Math.round((s.count / total) * 100) : 0;
              const lost = i > 0 ? funnel[i - 1].count - s.count : 0;
              return (
                <div key={s.type}>
                  <div className="mb-1.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 text-[13px]">
                    <span className="font-medium text-[#332B2B]">{s.label}</span>
                    <span className="lining-nums text-black/55">
                      {s.count} visitors ({pct}%)
                      {i > 0 && lost > 0 && (
                        <span className="ml-2 font-semibold" style={{ color: CRIMSON }}>
                          −{lost} left here
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#F6DADD]">
                    <div
                      className="h-2 rounded-full"
                      style={{ width: `${pct}%`, background: CRIMSON }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>

      {/* Visitor details */}
      <div className="mt-3 sm:mt-4">
        <Panel title={`Visitor details (${shown.length})`}>
          {shown.length === 0 ? (
            <p className="m-0 text-[14px] text-black/55">
              No visitor data yet. Once customers browse the store, they will appear here.
            </p>
          ) : (
            <>
              {/* Phones: one card per visitor */}
              <ul className="m-0 flex list-none flex-col gap-3 p-0 md:hidden">
                {shown.map((r) => (
                  <li
                    key={r.sessionId}
                    className="min-w-0 rounded-sm border border-[#E8CFD2] bg-[#FFFBF5] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="m-0 min-w-0 break-words text-[14px] font-semibold text-[#332B2B]">
                        {r.customerName}
                      </p>
                      <span className="lining-nums shrink-0 text-[12px] text-black/55">
                        {fmt(r.lastSeen)}
                      </span>
                    </div>
                    <p className="m-0 mt-2 break-all text-[13px] text-black/60">
                      Last page: {r.lastPage}
                    </p>
                    <p className="m-0 mt-0.5 break-words text-[13px] text-black/60">
                      Last product: {r.lastProduct}
                    </p>
                    <div className="mt-3 border-t border-black/5 pt-3">{statusPill(r)}</div>
                  </li>
                ))}
              </ul>

              {/* Tablets and larger: table */}
              <div className="hidden overflow-x-auto rounded-sm border border-[#E8CFD2] bg-[#FFFBF5] md:block">
                <table className="w-full min-w-[640px] text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-black/5 text-[11px] uppercase tracking-[0.12em] text-black/50">
                      <th className="p-3 font-medium">Visitor</th>
                      <th className="p-3 font-medium">Last seen</th>
                      <th className="p-3 font-medium">Last page</th>
                      <th className="p-3 font-medium">Last product</th>
                      <th className="p-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shown.map((r) => (
                      <tr key={r.sessionId} className="border-b border-black/5 last:border-0">
                        <td className="p-3 font-medium text-[#332B2B]">{r.customerName}</td>
                        <td className="lining-nums p-3 text-black/55">{fmt(r.lastSeen)}</td>
                        <td className="p-3 text-black/55">{r.lastPage}</td>
                        <td className="p-3 text-black/55">{r.lastProduct}</td>
                        <td className="p-3">{statusPill(r)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </Panel>
      </div>
    </AdminShell>
  );
}