import Link from "next/link";
import { PageShell, PageTitle, card, outlineBtn, serif } from "@/components/izha/ui";

const FAQS = [
  {
    q: "Where does Izha Blooms deliver?",
    a: "We deliver across India right to your doorstep — typically 2–4 business days within Kerala and 4–7 business days across the rest of India.",
  },
  {
    q: "Can I order without creating an account?",
    a: "Yes! Guest checkout is available on every order. You can also sign in quickly using your mobile number and OTP if you prefer.",
  },
  {
    q: "How do I choose the right size?",
    a: "Every product page includes a clickable Size Guide right beside Select Size, plus detailed fabric and fit notes. You can also message us on WhatsApp at +91 99957 57612.",
  },
  {
    q: "What are the shipping charges?",
    a: "Orders within Kerala enjoy free delivery, and Pan-India orders unlock free shipping above the active order threshold. Enter your PIN code at checkout to check instantly.",
  },
  {
    q: "How can I track my order?",
    a: "Visit the Track Your Order page using your Order ID (e.g., IZB-1006) or check My Orders inside your Account dashboard.",
  },
];

export default function FaqsPage() {
  return (
    <PageShell>
      <PageTitle
        title="Frequently Asked Questions"
        sub="Quick answers on sizing, Pan-India delivery, orders, and personal assistance."
      />

      <div className="mx-auto mt-10 max-w-3xl space-y-4">
        {FAQS.map((item) => (
          <div key={item.q} className={`${card} p-5 sm:p-6`}>
            <h2 className={`${serif} text-[22px] font-medium text-[#332B2B]`}>
              {item.q}
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-[#6f6565]">{item.a}</p>
          </div>
        ))}

        <div className="pt-4 text-center">
          <Link href="/shop" className={outlineBtn}>
            Explore All Styles
          </Link>
        </div>
      </div>
    </PageShell>
  );
}

