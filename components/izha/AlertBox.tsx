"use client";

import type { ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

export type AlertVariant = "error" | "success" | "info";

const STYLES: Record<
  AlertVariant,
  { wrap: string; iconWrap: string; title: string; text: string }
> = {
  error: {
    wrap: "border-[#E99A9F] border-l-4 border-l-[#B20947] bg-[#FDEEEF] text-[#7D1238]",
    iconWrap: "text-[#B20947]",
    title: "text-[#92083B]",
    text: "text-[#6E1835]",
  },
  success: {
    wrap: "border-[#B9D8BF] border-l-4 border-l-[#3A6B42] bg-[#EEF7F0] text-[#2B4E31]",
    iconWrap: "text-[#3A6B42]",
    title: "text-[#2A5331]",
    text: "text-[#325A39]",
  },
  info: {
    wrap: "border-[#E8B8C5] border-l-4 border-l-[#8F3057] bg-[#FAF3E8] text-[#332B2B]",
    iconWrap: "text-[#8F3057]",
    title: "text-[#332B2B]",
    text: "text-[#5C4E4E]",
  },
};

export default function AlertBox({
  variant = "error",
  title,
  message,
  onClose,
  action,
  className = "",
}: {
  variant?: AlertVariant;
  title?: string;
  message: string;
  onClose?: () => void;
  action?: ReactNode;
  className?: string;
}) {
  const s = STYLES[variant];
  const Icon =
    variant === "success" ? CheckCircle2 : variant === "info" ? Info : AlertCircle;

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-[13px] shadow-sm ${s.wrap} ${className}`}
    >
      <Icon size={18} className={`mt-0.5 shrink-0 ${s.iconWrap}`} />
      <div className="min-w-0 flex-1">
        {title && <p className={`text-[13px] font-semibold ${s.title}`}>{title}</p>}
        <p className={`leading-snug ${title ? "mt-0.5" : "font-medium"} ${s.text}`}>
          {message}
        </p>
        {action && <div className="mt-2">{action}</div>}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss alert"
          className="shrink-0 rounded-lg p-1 opacity-70 transition-opacity hover:bg-black/5 hover:opacity-100"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}

