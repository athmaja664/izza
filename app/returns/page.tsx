import Link from "next/link";
import { PageShell, PageTitle, card, outlineBtn } from "@/components/izha/ui";

export default function ReturnsPage() {
  return (
    <PageShell>
      <PageTitle
        title="Returns & Exchange"
        sub="Hassle-free size exchanges and support from our studio team."
      />
      <div className={`${card} mx-auto mt-10 max-w-3xl space-y-4 p-6 text-[14px] leading-relaxed text-[#6f6565]`}>
        <p><strong className="text-[#332B2B]">7-Day Exchange:</strong> Unworn pieces with original tags intact may be requested for size exchange within 7 days of delivery.</p>
        <p><strong className="text-[#332B2B]">Need Help?</strong> Reach us on WhatsApp at +91 99957 57612 or email izhablooms@gmail.com with your Order ID.</p>
        <div className="pt-2"><Link href="/size-guide" className={outlineBtn}>View Size Guide</Link></div>
      </div>
    </PageShell>
  );
}

