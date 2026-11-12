import { PageShell, PageTitle, card } from "@/components/izha/ui";

export default function TermsPage() {
  return (
    <PageShell>
      <PageTitle
        title="Terms & Conditions"
        sub="Store guidelines for shopping with Izha Blooms · Izha Designs, Aluva."
      />
      <div className={`${card} mx-auto mt-10 max-w-3xl space-y-4 p-6 text-[14px] leading-relaxed text-[#6f6565]`}>
        <p>All product photography, embroidered designs, and branding belong to Izha Designs (Izha Blooms), Aluva, Kerala, India.</p>
        <p>Prices are inclusive of applicable taxes and subject to active store offers or coupon terms.</p>
      </div>
    </PageShell>
  );
}

