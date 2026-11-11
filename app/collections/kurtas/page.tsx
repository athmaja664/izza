"use client";

import CollectionCatalog from "@/components/CollectionCatalog";
import { COLLECTION_META, getProductsBySlug } from "@/lib/products";

export default function KurtasCollectionPage() {
  const meta = COLLECTION_META.kurtas;
  const products = getProductsBySlug("kurtas");

  return (
    <CollectionCatalog
      title={meta.title}
      subtitle={meta.subtitle}
      products={products}
    />
  );
}

