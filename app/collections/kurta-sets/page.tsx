"use client";

import CollectionCatalog from "@/components/CollectionCatalog";
import { COLLECTION_META, getProductsBySlug } from "@/lib/products";

export default function KurtaSetsCollectionPage() {
  const meta = COLLECTION_META["kurta-sets"];
  const products = getProductsBySlug("kurta-sets");

  return (
    <CollectionCatalog
      title={meta.title}
      subtitle={meta.subtitle}
      products={products}
    />
  );
}

