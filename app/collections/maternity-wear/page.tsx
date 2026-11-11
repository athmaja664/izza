"use client";

import CollectionCatalog from "@/components/CollectionCatalog";
import { COLLECTION_META, getProductsBySlug } from "@/lib/products";

export default function MaternityWearCollectionPage() {
  const meta = COLLECTION_META["maternity-wear"];
  const products = getProductsBySlug("maternity-wear");

  return (
    <CollectionCatalog
      title={meta.title}
      subtitle={meta.subtitle}
      products={products}
    />
  );
}

