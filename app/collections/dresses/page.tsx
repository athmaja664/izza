"use client";

import CollectionCatalog from "@/components/CollectionCatalog";
import { COLLECTION_META, getProductsBySlug } from "@/lib/products";

export default function DressesCollectionPage() {
  const meta = COLLECTION_META.dresses;
  const products = getProductsBySlug("dresses");

  return (
    <CollectionCatalog
      title={meta.title}
      subtitle={meta.subtitle}
      products={products}
    />
  );
}

