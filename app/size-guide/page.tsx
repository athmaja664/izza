import Link from "next/link";
import { PageShell, PageTitle, card, cardCream, outlineBtn, serif } from "@/components/izha/ui";

const CHART = [
  { size: "XS", bust: '32" / 81 cm', waist: '26" / 66 cm', hip: '35" / 89 cm', uk: "6" },
  { size: "S", bust: '34" / 86 cm', waist: '28" / 71 cm', hip: '37" / 94 cm', uk: "8" },
  { size: "M", bust: '36" / 91 cm', waist: '30" / 76 cm', hip: '39" / 99 cm', uk: "10" },
  { size: "L", bust: '38" / 97 cm', waist: '32" / 81 cm', hip: '41" / 104 cm', uk: "12" },
  { size: "XL", bust: '40" / 102 cm', waist: '34" / 86 cm', hip: '43" / 109 cm', uk: "14" },
  { size: "XXL", bust: '42" / 107 cm', waist: '36" / 91 cm', hip: '45" / 114 cm', uk: "16" },
  { size: "XXXL", bust: '44" / 112 cm', waist: '38" / 97 cm', hip: '47" / 119 cm', uk: "18" },
];

export default function SizeGuidePage() {
  return (
    <PageShell>
      <PageTitle
        title="Size Guide"
        sub="Clear measurements for kurtas, dresses, kurta sets, tops & maternity wear."
      />

      <div className={`${card} mt-10 overflow-hidden p-5 sm:p-8`}>
        <h2 className={`${serif} text-[26px] font-medium text-[#332B2B]`}>
          Women&apos;s Body Measurement Chart
        </h2>
        <p className="mt-1 text-[14px] text-[#6f6565]">
          Measurements are listed in inches and centimetres. If you prefer a relaxed fit or sit between two sizes, we recommend sizing up.
        </p>

        <div className="mt-5 overflow-x-auto rounded-xl border border-[#E8CFD2]">
          <table className="w-full min-w-[520px] text-left text-[14px]">
            <thead className="bg-[#FFF5F7] text-[11px] uppercase tracking-[0.14em] text-[#B20947]">
              <tr>
                <th className="px-4 py-3">Size</th>
                <th className="px-4 py-3">Bust</th>
                <th className="px-4 py-3">Waist</th>
                <th className="px-4 py-3">Hip</th>
                <th className="px-4 py-3">UK Equivalent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8CFD2] bg-white text-[#332B2B]">
              {CHART.map((r) => (
                <tr key={r.size} className="hover:bg-[#FCF8F3]">
                  <td className="px-4 py-3 font-semibold">{r.size}</td>
                  <td className="px-4 py-3">{r.bust}</td>
                  <td className="px-4 py-3">{r.waist}</td>
                  <td className="px-4 py-3">{r.hip}</td>
                  <td className="px-4 py-3">{r.uk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={`${cardCream} mt-6 grid gap-4 p-5 sm:grid-cols-3`}>
          <div>
            <h3 className={`${serif} text-[20px] font-medium text-[#B20947]`}>Bust</h3>
            <p className="mt-1 text-[13px] text-[#6f6565]">
              Measure around the fullest part of your bust keeping the tape comfortably level.
            </p>
          </div>
          <div>
            <h3 className={`${serif} text-[20px] font-medium text-[#B20947]`}>Waist</h3>
            <p className="mt-1 text-[13px] text-[#6f6565]">
              Measure around the narrowest part of your natural waistline without pulling tight.
            </p>
          </div>
          <div>
            <h3 className={`${serif} text-[20px] font-medium text-[#B20947]`}>Hip</h3>
            <p className="mt-1 text-[13px] text-[#6f6565]">
              Stand with feet together and measure around the widest part of your hips.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/collections" className={outlineBtn}>
            Explore Collections
          </Link>
          <a
            href="https://wa.me/919995757612?text=Hi%20IZHA%20BLOOMS,%20I%20need%20help%20choosing%20my%20size."
            target="_blank"
            rel="noopener noreferrer"
            className={outlineBtn}
          >
            Ask Sizing Help on WhatsApp
          </a>
        </div>
      </div>
    </PageShell>
  );
}

