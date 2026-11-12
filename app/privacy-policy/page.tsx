import { PageShell, PageTitle, card } from "@/components/izha/ui";

export default function PrivacyPolicyPage() {
  return (
    <PageShell>
      <PageTitle
        title="Privacy Policy"
        sub="How Izha Blooms protects your personal & delivery details."
      />
      <div className={`${card} mx-auto mt-10 max-w-3xl space-y-4 p-6 text-[14px] leading-relaxed text-[#6f6565]`}>
        <p>We respect your privacy and only collect contact and delivery information needed to fulfil orders, share tracking updates, and assist you personally.</p>
        <p>For privacy inquiries, write to <strong className="text-[#332B2B]">izhablooms@gmail.com</strong>.</p>
      </div>
    </PageShell>
  );
}

