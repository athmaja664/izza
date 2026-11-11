import { notFound } from "next/navigation";
import CollectionCatalog from "@/components/CollectionCatalog";
import { PRODUCTS, type Product } from "@/lib/products";

type CollectionConfig = {
  title: string;
  subtitle: string;
  filter: (p: Product) => boolean;
  showCategoryFilter?: boolean;
};

const EXTRA_COLLECTIONS: Record<string, CollectionConfig> = {
  "ethnic-wear": {
    title: "Ethnic Wear",
    subtitle: "Graceful kurtas and coordinated festive kurta sets",
    filter: (p) => p.categorySlug === "kurtas" || p.categorySlug === "kurta-sets",
    showCategoryFilter: true,
  },
  "casual-wear": {
    title: "Casual Wear",
    subtitle: "Breezy everyday dresses and effortless cotton tops",
    filter: (p) => p.categorySlug === "dresses" || p.categorySlug === "tops",
    showCategoryFilter: true,
  },
  "feeding-friendly-wear": {
    title: "Feeding-Friendly Wear",
    subtitle: "Thoughtful nursing-friendly silhouettes with discreet access",
    filter: (p) => p.categorySlug === "maternity-wear",
  },
  nightwear: {
    title: "Nightwear & Lounge",
    subtitle: "Soft breathable mulmul and pure cotton comfort styles",
    filter: (p) =>
      p.fabric.toLowerCase().includes("mulmul") ||
      p.categorySlug === "dresses" ||
      p.categorySlug === "maternity-wear",
    showCategoryFilter: true,
  },
  "festive-wear": {
    title: "Festive Wear",
    subtitle: "Celebration-ready embroidered kurta sets and silk blends",
    filter: (p) =>
      p.categorySlug === "kurta-sets" ||
      p.name.toLowerCase().includes("festive") ||
      p.craft.toLowerCase().includes("zari") ||
      p.craft.toLowerCase().includes("embroider"),
    showCategoryFilter: true,
  },
  festive: {
    title: "Festive",
    subtitle: "Celebration-ready embroidered kurta sets and silk blends",
    filter: (p) =>
      p.categorySlug === "kurta-sets" ||
      p.name.toLowerCase().includes("festive") ||
      p.craft.toLowerCase().includes("zari") ||
      p.craft.toLowerCase().includes("embroider"),
    showCategoryFilter: true,
  },
  "office-wear": {
    title: "Office Wear",
    subtitle: "Polished cotton kurtas and tailored everyday tops",
    filter: (p) => p.categorySlug === "kurtas" || p.categorySlug === "tops",
    showCategoryFilter: true,
  },
  "co-ord-sets": {
    title: "Co-ord Sets",
    subtitle: "Harmoniously paired kurta sets and coordinated looks",
    filter: (p) => p.categorySlug === "kurta-sets",
  },
  embroidered: {
    title: "Embroidered",
    subtitle: "Handcrafted chikankari, resham & floral threadwork pieces",
    filter: (p) =>
      p.name.toLowerCase().includes("embroider") ||
      p.name.toLowerCase().includes("chikankari") ||
      p.craft.toLowerCase().includes("embroider") ||
      p.craft.toLowerCase().includes("chikankari") ||
      p.craft.toLowerCase().includes("thread"),
    showCategoryFilter: true,
  },
  "new-arrivals": {
    title: "New Arrivals",
    subtitle: "Fresh pastel styles crafted for the season",
    filter: (p) => Boolean(p.isNew),
    showCategoryFilter: true,
  },
};

export function generateStaticParams() {
  return Object.keys(EXTRA_COLLECTIONS).map((slug) => ({ slug }));
}

export default async function DynamicCollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = EXTRA_COLLECTIONS[slug];
  if (!config) {
    notFound();
  }

  return (
    <CollectionCatalog
      title={config.title}
      subtitle={config.subtitle}
      products={PRODUCTS.filter(config.filter)}
      showCategoryFilter={config.showCategoryFilter}
    />
  );
}

