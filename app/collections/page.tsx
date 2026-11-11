"use client";

import CollectionCatalog from "@/components/CollectionCatalog";
import { PRODUCTS } from "@/lib/products";

export default function CollectionsPage() {
  return (
    <CollectionCatalog
      title="Collections"
      subtitle="Explore Dresses, Kurtas, Kurta Sets, Tops & Maternity Wear"
      products={PRODUCTS}
      showCategoryFilter
    />
  );
}

