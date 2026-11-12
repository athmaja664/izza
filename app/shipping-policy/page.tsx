import Link from "next/link";
import { PageShell, PageTitle, card, outlineBtn } from "@/components/izha/ui";

export default function ShippingPolicyPage() {
  return (
    <PageShell>
      <PageTitle
        title="Shipping & Delivery"
        sub="Delivered across India straight to your doorstep from Aluva, Kerala."
      />
      <div className={`${card} mx-auto mt-10 max-w-3xl space-y-4 p-6 text-[14px] leading-relaxed text-[#6f6565]`}>
        <p><strong className="text-[#332B2B]">Dispatch Time:</strong> Orders are carefully packed and dispatched within 24–48 business hours.</p>
        <p><strong className="text-[#332B2B]">Kerala Delivery:</strong> 2–4 business days with free doorstep shipping.</p>
        <p><strong className="text-[#332B2B]">Rest of India Delivery:</strong> 4–7 business days. Free shipping applies automatically above our active Pan-India threshold.</p>
        <div className="pt-2"><Link href="/track-order" className={outlineBtn}>Track Your Order</Link></div>
      </div>
    </PageShell>
  );
}

