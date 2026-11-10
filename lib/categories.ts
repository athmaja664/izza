export type Category = {
  id: string;
  name: string;
  href: string;
  image: string;
  objectPosition?: string; // keeps the clothing visible inside the arch
};

export const CATEGORIES: Category[] = [
  { id: "dresses", name: "Dresses", href: "/collections/dresses", image: "/images/cateogry1.jpg" },
  { id: "tops", name: "Tops", href: "/collections/tops", image: "/images/catetop.jpg" },
  { id: "ethnic-wear", name: "Ethnic Wear", href: "/collections/ethnic-wear", image: "/images/cateethnic.jpg" },
  { id: "casual-wear", name: "Casual Wear", href: "/collections/casual-wear", image: "/images/causal-waer.jpg" },
  { id: "maternity-wear", name: "Maternity Wear", href: "/collections/maternity-wear", image: "/images/maternity-wear.jpg" },
  { id: "feeding-friendly-wear", name: "Feeding-Friendly Wear", href: "/collections/feeding-friendly-wear", image: "/images/feeding-friendly-wear.jpg" },
  { id: "nightwear", name: "Nightwear", href: "/collections/nightwear", image: "/images/nightwear.jpg" },
  { id: "festive-wear", name: "Festive Wear", href: "/collections/festive-wear", image: "/images/festive-wear.jpg" },
  { id: "office-wear", name: "Office Wear", href: "/collections/office-wear", image: "/images/office-wear.jpg" },
  { id: "co-ord-sets", name: "Co-ord Sets", href: "/collections/co-ord-sets", image: "/images/co-ords-set.jpg" },
];