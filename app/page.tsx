import HeroCarousel from "@/components/HeroCarousel";
import BestSellers, { type BestSellerProduct } from "@/components/BestSellerProduct";
import ShopByCategory from "@/components/home/ShopByCategory";
import InstagramGallery from "@/components/InstagramGallery";
import NewArrivalBanner from "@/components/NewArrivalBanner";
import AboutSection from "@/components/AboutSection";
import ReviewsSection from "@/components/ReviewsSection";
import { PRODUCTS } from "@/lib/products";

const BEST_SELLER_IDS = ["p2", "p3", "p1", "p20"];

const products: BestSellerProduct[] = BEST_SELLER_IDS.map((id) => {
  const item = PRODUCTS.find((p) => p.id === id) ?? PRODUCTS[0];
  return {
    id: item.id,
    name: item.name,
    image: item.image,
    href: `/product/${item.id}`,
    price: item.price,
    compareAtPrice: item.mrp,
    inStock: true,
    sizes: item.sizes.map((label) => ({
      label,
      inStock: !(item.soldOutSizes ?? []).includes(label),
    })),
  };
});

export default function Home() {
  return (
    <main>
      <HeroCarousel />
      <ShopByCategory />
      <NewArrivalBanner />
      <BestSellers products={products} viewAllHref="/shop" />
      <AboutSection/>
      <InstagramGallery />
      <ReviewsSection/>
    </main>
  );
}