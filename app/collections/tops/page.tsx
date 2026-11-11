"use client";

import CollectionCatalog from "@/components/CollectionCatalog";
import { COLLECTION_META, getProductsBySlug } from "@/lib/products";

export default function TopsCollectionPage() {
  const meta = COLLECTION_META.tops;
  const products = getProductsBySlug("tops");

  return (
    <CollectionCatalog
      title={meta.title}
      subtitle={meta.subtitle}
      products={products}
    />
  );
}

