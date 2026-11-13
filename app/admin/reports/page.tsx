"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, LogOut, ShoppingBag, Users } from "lucide-react";
import AdminShell, { card, cardCream, inputCls, outlineBtn } from "@/components/admin/AdminShell";
import { serif } from "@/components/izha/ui";
import {
  STAGES,
  readEvents,
  writeEvents,
  type StageType,
  type VisitEvent,
} from "@/lib/visit-tracker";

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
    { label: "Total visitors", value: total, icon: Users },
    { label: "Placed an order", value: converted, icon: ShoppingBag },
    { label: "Dropped off", value: dropped, icon: LogOut },
    { label: "Conversion rate", value: `${convRate}%`, icon: ShoppingBag },
  ];

  return (
    <AdminShell
      title="Visitor Reports"
      subtitle="See who visited the store and where they dropped off before buying"
    >
      {/* Filters */}
      <div className={`${card} mb-5 flex flex-wrap items-center gap-3 p-4`}>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value as Range)}
          className={`${inputCls} !w-auto !py-2 !text-[13px]`}
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

        <div className="ml-auto flex flex-wrap gap-2">
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

      {/* Stat cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon }) => (
          <div key={label} className={`${card} p-4`}>
            <Icon size={18} className="text-[#B20947]" />
            <p className={`${serif} mt-2 text-[28px] font-medium text-[#332B2B]`}>{value}</p>
            <p className="text-[12px] text-[#6f6565]">{label}</p>
          </div>
        ))}
      </div>

      {/* Funnel */}
      <section className={`${card} mb-6 p-4 sm:p-5`}>
        <h2 className={`${serif} text-[22px] font-medium text-[#332B2B]`}>Where visitors drop off</h2>
        <div className="mt-4 space-y-3">
          {funnel.map((s, i) => {
            const pct = total ? Math.round((s.count / total) * 100) : 0;
            const lost = i > 0 ? funnel[i - 1].count - s.count : 0;
            return (
              <div key={s.type}>
                <div className="mb-1 flex flex-wrap items-center justify-between gap-2 text-[13px]">
                  <span className="font-medium text-[#332B2B]">{s.label}</span>
                  <span className="text-[#6f6565]">
                    {s.count} visitors ({pct}%)
                    {i > 0 && lost > 0 && (
                      <span className="ml-2 font-semibold text-[#B20947]">−{lost} left here</span>
                    )}
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-[#F9E3E9]">
                  <div
                    className="h-full rounded-full bg-[#B20947]"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Visitor table */}
      <section className="space-y-3">
        <h2 className={`${serif} text-[22px] font-medium text-[#332B2B]`}>
          Visitor details ({shown.length})
        </h2>

        {shown.length === 0 && (
          <div className={`${cardCream} p-8 text-center text-[14px] text-[#6f6565]`}>
            No visitor data yet. Once customers browse the store, they will appear here.
          </div>
        )}

        {shown.length > 0 && (
          <div className={`${card} overflow-x-auto`}>
            <table className="w-full min-w-[720px] text-left text-[13px]">
              <thead>
                <tr className="border-b border-[#F3E3E8] text-[#6f6565]">
                  <th className="p-3 font-medium">Visitor</th>
                  <th className="p-3 font-medium">Last seen</th>
                  <th className="p-3 font-medium">Last page</th>
                  <th className="p-3 font-medium">Last product</th>
                  <th className="p-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((r) => (
                  <tr key={r.sessionId} className="border-b border-[#F9EEF1] last:border-0">
                    <td className="p-3 font-medium text-[#332B2B]">{r.customerName}</td>
                    <td className="p-3 text-[#6f6565]">{fmt(r.lastSeen)}</td>
                    <td className="p-3 text-[#6f6565]">{r.lastPage}</td>
                    <td className="p-3 text-[#6f6565]">{r.lastProduct}</td>
                    <td className="p-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                          r.converted
                            ? "bg-[#eef7f0] text-[#3a6b42]"
                            : "bg-[#FFF5F7] text-[#B20947]"
                        }`}
                      >
                        {r.converted ? "Placed order" : `Dropped after: ${STAGES[r.reached].label}`}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AdminShell>
  );
}