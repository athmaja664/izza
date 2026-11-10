import HeroCarousel from "@/components/HeroCarousel";
import BestSellers, { type BestSellerProduct } from "@/components/BestSellerProduct";
import ShopByCategory from "@/components/home/ShopByCategory";
import InstagramGallery from "@/components/InstagramGallery";
import NewArrivalBanner from "@/components/NewArrivalBanner";

/* ==================================================================
   IMAGE URLS – paste your image link/path for each product here.
   • Local file:  "/images/yourfile.jpg"   (file must be in public/images)
   • Web link:    "https://..."            (its domain must be added to
                                            images.remotePatterns in next.config.ts)
================================================================== */
const IMG_1 = "/images/catetop.jpg";
const IMG_2 = "/images/co-ords-set.jpg";
const IMG_3 = "/images/causal-waer.jpg";
const IMG_4 = "/images/cateogry1.jpg";

/* TEMPORARY test data – replace with real best-sellers from your database */
const products: BestSellerProduct[] = [
  {
    id: 1,
    name: "Pastel Embroidered Kurta",
    image: IMG_1,
    href: "/shop",
    price: 1499,
    compareAtPrice: 1999,
    inStock: true,
    sizes: [
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: false },
    ],
  },
  {
    id: 2,
    name: "Floral Cotton Set",
    image: IMG_2,
    href: "/shop",
    price: 1299,
    inStock: true,
    sizes: [
      { label: "XS", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: true },
      { label: "XL", inStock: true },
    ],
  },
  {
    id: 3,
    name: "Festive Ethnic Suit",
    image: IMG_3,
    href: "/shop",
    price: 999,
    compareAtPrice: 1299,
    inStock: true, // no "sizes" = all five sizes available
  },
  {
    id: 4,
    name: "Soft Blush Anarkali",
    image: IMG_4,
    href: "/shop",
    price: 1799,
    inStock: false, // OUT OF STOCK, all sizes crossed out
  },
];

export default function Home() {
  return (
    <main>
      <HeroCarousel />
      <ShopByCategory />
      <BestSellers products={products} viewAllHref="/shop" />
      <NewArrivalBanner />
      <InstagramGallery />
    </main>
  );
}