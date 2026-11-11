export type CategoryName =
  | "Dresses"
  | "Kurtas"
  | "Kurta Sets"
  | "Tops"
  | "Maternity Wear";

export type CategorySlug =
  | "dresses"
  | "kurtas"
  | "kurta-sets"
  | "tops"
  | "maternity-wear";

export type ProductReview = {
  id: string;
  name: string;
  place: string;
  rating: number;
  date: string;
  text: string;
};

export type Product = {
  id: string;
  name: string;
  category: CategoryName;
  categorySlug: CategorySlug;
  price: number;
  mrp: number;
  sizes: string[];
  soldOutSizes?: string[];
  image: string;
  gallery: string[];
  isNew?: boolean;
  popularity: number;
  description: string;
  fabric: string;
  craft: string;
  care: string;
  fit: string;
  reviews: ProductReview[];
};

export const COLLECTION_META: Record<
  CategorySlug,
  {
    slug: CategorySlug;
    title: CategoryName;
    subtitle: string;
    heroTag: string;
  }
> = {
  dresses: {
    slug: "dresses",
    title: "Dresses",
    subtitle: "Breezy cotton silhouettes & hand-finished floral dresses",
    heroTag: "Collection",
  },
  kurtas: {
    slug: "kurtas",
    title: "Kurtas",
    subtitle: "Handcrafted embroidered & block-printed everyday kurtas",
    heroTag: "Collection",
  },
  "kurta-sets": {
    slug: "kurta-sets",
    title: "Kurta Sets",
    subtitle: "Coordinated kurtas paired with palazzos & airy dupattas",
    heroTag: "Collection",
  },
  tops: {
    slug: "tops",
    title: "Tops",
    subtitle: "Soft breathable tops with delicate gathers & artisan details",
    heroTag: "Collection",
  },
  "maternity-wear": {
    slug: "maternity-wear",
    title: "Maternity Wear",
    subtitle: "Thoughtful feeding-friendly silhouettes crafted for comfort",
    heroTag: "Collection",
  },
};

export const PRODUCTS: Product[] = [
  /* -------- Core Shop & New Arrivals items (p1 – p12) -------- */
  {
    id: "p1",
    name: "Floral Printed Cotton Dress",
    category: "Dresses",
    categorySlug: "dresses",
    price: 1499,
    mrp: 2499,
    sizes: ["S", "M", "L", "XL"],
    image: "/images/about.jpg",
    gallery: ["/images/about.jpg", "/images/dress.jpg", "/images/inst2.jpg"],
    isNew: true,
    popularity: 95,
    description:
      "Woven in airy 100% pure mul cotton, this floral dress drapes softly with a flattering flared hem and breathable lining for sunny days and intimate gatherings.",
    fabric: "100% Pure Mulmul Cotton with soft cotton lining",
    craft: "Hand-screen floral print with delicate neck piping",
    care: "Gentle cold hand wash separately; dry in shade",
    fit: "Relaxed A-line fit · Midi length (46 inches)",
    reviews: [
      {
        id: "r-p1-1",
        name: "Ananya Menon",
        place: "Kochi",
        rating: 5,
        date: "2 weeks ago",
        text: "The cotton feels cloud-soft even in Kerala humidity. Loved the floral print and neat stitching.",
      },
      {
        id: "r-p1-2",
        name: "Meera Nair",
        place: "Aluva",
        rating: 5,
        date: "1 month ago",
        text: "True to size and so comfortable for brunch and festive mornings. Already ordered another shade!",
      },
    ],
  },
  {
    id: "p2",
    name: "Embroidered Anarkali Kurta",
    category: "Kurtas",
    categorySlug: "kurtas",
    price: 1899,
    mrp: 2999,
    sizes: ["M", "L", "XL", "XXL"],
    image: "/images/cateethnic.jpg",
    gallery: ["/images/cateethnic.jpg", "/images/kurtas.jpg", "/images/kurtas1.jpg"],
    popularity: 88,
    description:
      "Gracefully flared Anarkali kurta accented with fine floral thread embroidery across the bodice and sleeves. Designed to flow effortlessly from daytime pujas to evening dinners.",
    fabric: "Breathable Chanderi Cotton Blend with soft lining",
    craft: "Intricate floral Resham thread embroidery",
    care: "Dry clean or gentle cold wash inside out",
    fit: "Flared Anarkali silhouette · Calf length (47 inches)",
    reviews: [
      {
        id: "r-p2-1",
        name: "Lakshmi Priya",
        place: "Thrissur",
        rating: 5,
        date: "3 weeks ago",
        text: "The embroidery work around the yoke is gorgeous and looks much more expensive than the price.",
      },
    ],
  },
  {
    id: "p3",
    name: "Chikankari Kurta Set with Dupatta",
    category: "Kurta Sets",
    categorySlug: "kurta-sets",
    price: 2799,
    mrp: 3999,
    sizes: ["S", "M", "L"],
    image: "/images/cateogry1.jpg",
    gallery: ["/images/cateogry1.jpg", "/images/kurtasset.jpg", "/images/festive-wear.jpg"],
    isNew: true,
    popularity: 92,
    description:
      "A timeless three-piece kurta set featuring heirloom-inspired chikankari motifs, straight-cut relaxed trousers, and a feather-light scalloped dupatta.",
    fabric: "Soft Cotton Voile kurta & bottom with Kota Doria dupatta",
    craft: "Artisanal Chikankari embroidery with crochet edging",
    care: "Gentle hand wash in mild detergent",
    fit: "Regular straight fit · Kurta 44 inches, Bottom 38 inches",
    reviews: [
      {
        id: "r-p3-1",
        name: "Divya Krishnan",
        place: "Ernakulam",
        rating: 5,
        date: "1 week ago",
        text: "Wore this for a family engagement and received so many compliments. The dupatta drape is lovely.",
      },
      {
        id: "r-p3-2",
        name: "Sneha Varma",
        place: "Calicut",
        rating: 4,
        date: "3 weeks ago",
        text: "Very soft fabric and graceful fit. Delivery was quick as well.",
      },
    ],
  },
  {
    id: "p4",
    name: "Ruffle Sleeve Cotton Top",
    category: "Tops",
    categorySlug: "tops",
    price: 799,
    mrp: 1299,
    sizes: ["XS", "S", "M", "L"],
    image: "/images/catetop.jpg",
    gallery: ["/images/catetop.jpg", "/images/tops.jpg", "/images/inst3.jpg"],
    popularity: 70,
    description:
      "An everyday essential crafted in crisp breathable cotton with feminine flutter ruffle sleeves and subtle pintuck detailing along the front.",
    fabric: "100% Cambric Cotton",
    craft: "Delicate pintucks & soft gathered ruffle sleeves",
    care: "Machine wash gentle cold; warm iron",
    fit: "Easy relaxed fit · Hip length (25 inches)",
    reviews: [
      {
        id: "r-p4-1",
        name: "Rhea Thomas",
        place: "Kottayam",
        rating: 5,
        date: "2 weeks ago",
        text: "Pairs effortlessly with both denim and linen trousers. Light and airy for all-day wear.",
      },
    ],
  },
  {
    id: "p5",
    name: "Feeding Friendly Maternity Kurta",
    category: "Maternity Wear",
    categorySlug: "maternity-wear",
    price: 1699,
    mrp: 2199,
    sizes: ["M", "L", "XL", "XXL"],
    image: "/images/causal-waer.jpg",
    gallery: ["/images/causal-waer.jpg", "/images/feeding-friendly-wear.jpg", "/images/maternity-wear.jpg"],
    popularity: 76,
    description:
      "Designed with discreet dual vertical concealed zippers for effortless nursing, paired with gentle waist gathers that accommodate a growing bump comfortably.",
    fabric: "Ultra-soft Pre-washed Organic Cotton",
    craft: "Concealed nursing zippers & pleated front comfort panel",
    care: "Gentle machine or hand wash",
    fit: "Relaxed maternity & nursing fit · Calf length (45 inches)",
    reviews: [
      {
        id: "r-p5-1",
        name: "Aiswarya Raj",
        place: "Kochi",
        rating: 5,
        date: "10 days ago",
        text: "Finally maternity wear that feels festive and stylish! The hidden zippers are super smooth and convenient.",
      },
    ],
  },
  {
    id: "p6",
    name: "Tiered Maxi Dress",
    category: "Dresses",
    categorySlug: "dresses",
    price: 2499,
    mrp: 3299,
    sizes: ["S", "M", "L"],
    image: "/images/office-wear.jpg",
    gallery: ["/images/office-wear.jpg", "/images/dress.jpg", "/images/about1.jpg"],
    popularity: 84,
    description:
      "Flowing three-tiered maxi silhouette finished with delicate hand-tacked gathers and side pockets for effortless movement.",
    fabric: "100% Cotton Flex with breathable mul lining",
    craft: "Tiered gathering with tonal stitch finish",
    care: "Hand wash cold; line dry in shade",
    fit: "Flowy maxi fit · Length 52 inches",
    reviews: [
      {
        id: "r-p6-1",
        name: "Nandita Pillai",
        place: "Trivandrum",
        rating: 5,
        date: "1 month ago",
        text: "Love the pockets and the way the tiers fall! Super comfortable for travel and get-togethers.",
      },
    ],
  },
  {
    id: "p7",
    name: "Straight Fit Block Print Kurta",
    category: "Kurtas",
    categorySlug: "kurtas",
    price: 1199,
    mrp: 1599,
    sizes: ["S", "M", "L", "XL"],
    image: "/images/co-ords-set.jpg",
    gallery: ["/images/co-ords-set.jpg", "/images/kurtas1.jpg", "/images/kurtas.jpg"],
    popularity: 66,
    description:
      "Crisp straight-fit kurta showcasing artisanal botanical hand-block motifs, finished with mother-of-pearl buttons along the placket.",
    fabric: "100% Pure Cotton 60s Cambric",
    craft: "Traditional hand-block print with shell button placket",
    care: "Gentle cold wash separately",
    fit: "Tailored straight fit · Length 44 inches",
    reviews: [
      {
        id: "r-p7-1",
        name: "Kavya Suresh",
        place: "Aluva",
        rating: 4,
        date: "3 weeks ago",
        text: "Great office wear kurta. Colors stayed bright even after two washes.",
      },
    ],
  },
  {
    id: "p8",
    name: "Festive Silk Kurta Set",
    category: "Kurta Sets",
    categorySlug: "kurta-sets",
    price: 3499,
    mrp: 5999,
    sizes: ["M", "L", "XL"],
    image: "/images/dress.jpg",
    gallery: ["/images/dress.jpg", "/images/kurtasset.jpg", "/images/festive-wear.jpg"],
    isNew: true,
    popularity: 90,
    description:
      "Lustrous rose-toned silk-blend kurta paired with tailored ankle trousers and an organza floral-embroidered dupatta—crafted for celebrations.",
    fabric: "Silk-Cotton Chanderi with full crepe lining & Organza dupatta",
    craft: "Zari & floral Resham embroidery along neckline & cuffs",
    care: "Dry clean recommended",
    fit: "Tailored festive fit · Kurta 45 inches",
    reviews: [
      {
        id: "r-p8-1",
        name: "Shruti Mohan",
        place: "Kochi",
        rating: 5,
        date: "5 days ago",
        text: "The sheen of the fabric and the soft rose tone look dreamy in person. Worth every rupee.",
      },
    ],
  },
  {
    id: "p9",
    name: "Peplum Style Party Top",
    category: "Tops",
    categorySlug: "tops",
    price: 999,
    mrp: 1499,
    sizes: ["XS", "S", "M"],
    image: "/images/festive-wear.jpg",
    gallery: ["/images/festive-wear.jpg", "/images/tops.jpg", "/images/catetop.jpg"],
    popularity: 61,
    description:
      "Flattering flared peplum top featuring a subtle sweetheart neckline, puff sleeves, and gentle waist cinching for effortless evening styling.",
    fabric: "Soft Textured Cotton-Silk Blend",
    craft: "Tailored peplum flare with concealed side zip",
    care: "Gentle cold hand wash",
    fit: "Fitted bodice with flared hem · Length 24 inches",
    reviews: [
      {
        id: "r-p9-1",
        name: "Gayathri Nair",
        place: "Palakkad",
        rating: 5,
        date: "2 weeks ago",
        text: "Very flattering cut! Looks great tucked out over high-waist pants.",
      },
    ],
  },
  {
    id: "p10",
    name: "Wrap Front Maternity Dress",
    category: "Maternity Wear",
    categorySlug: "maternity-wear",
    price: 2199,
    mrp: 2999,
    sizes: ["M", "L", "XL"],
    image: "/images/insta1.png",
    gallery: ["/images/insta1.png", "/images/maternity-wear.jpg", "/images/feeding-friendly-wear.jpg"],
    isNew: true,
    popularity: 80,
    description:
      "Adjustable wrap-front maternity and post-partum dress featuring easy nursing access and an elastic back waist that adapts seamlessly through every trimester and beyond.",
    fabric: "Soft Breathable Modal-Cotton",
    craft: "Adjustable wrap tie with nursing-friendly V-neckline",
    care: "Gentle wash cold; dry flat",
    fit: "Adjustable wrap fit · Midi length (46 inches)",
    reviews: [
      {
        id: "r-p10-1",
        name: "Deepa Mathew",
        place: "Kottayam",
        rating: 5,
        date: "1 week ago",
        text: "Bought this in my third trimester and still wearing it post-delivery. Super easy for feeding!",
      },
    ],
  },
  {
    id: "p11",
    name: "Printed A-Line Midi Dress",
    category: "Dresses",
    categorySlug: "dresses",
    price: 1799,
    mrp: 2299,
    sizes: ["S", "M", "L", "XL"],
    image: "/images/kurtas1.jpg",
    gallery: ["/images/kurtas1.jpg", "/images/dress.jpg", "/images/about2.jpg"],
    popularity: 73,
    description:
      "Clean A-line midi dress featuring botanical print borders, a mandarin collar, and airy three-quarter sleeves.",
    fabric: "100% Pure Cotton Slub",
    craft: "Botanical print placement with fabric-covered buttons",
    care: "Cold hand wash separately",
    fit: "Easy A-line fit · Length 45 inches",
    reviews: [],
  },
  {
    id: "p12",
    name: "Cotton Kurta Set with Palazzo",
    category: "Kurta Sets",
    categorySlug: "kurta-sets",
    price: 2299,
    mrp: 2799,
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: "/images/tops.jpg",
    gallery: ["/images/tops.jpg", "/images/kurtasset.jpg", "/images/co-ords-set.jpg"],
    popularity: 78,
    description:
      "Breezy cotton kurta matched with wide-leg palazzo trousers finished with delicate lace insertion along the hemline.",
    fabric: "100% Mulmul Cotton",
    craft: "Cotton crochet lace trim on sleeves and palazzo hem",
    care: "Gentle cold wash",
    fit: "Relaxed comfort fit · Kurta 44 inches, Palazzo 39 inches",
    reviews: [
      {
        id: "r-p12-1",
        name: "Haritha V",
        place: "Thrissur",
        rating: 5,
        date: "3 weeks ago",
        text: "So airy and light! The lace trim on the palazzo gives it a lovely handmade finish.",
      },
    ],
  },

  /* -------- Additional Dresses (p13 – p15) -------- */
  {
    id: "p13",
    name: "Blush Rose Embroidered Dress",
    category: "Dresses",
    categorySlug: "dresses",
    price: 2199,
    mrp: 2999,
    sizes: ["XS", "S", "M", "L", "XL"],
    image: "/images/dress.jpg",
    gallery: ["/images/dress.jpg", "/images/about3.png", "/images/instagram1.jpg"],
    isNew: true,
    popularity: 91,
    description:
      "Signature Izha Blooms blush-rose dress adorned with delicate floral threadwork across the yoke and bishop sleeves.",
    fabric: "Handloom Cotton Mul with soft cotton voile lining",
    craft: "Hand-guided floral thread embroidery",
    care: "Gentle cold hand wash",
    fit: "Flared fit with side pockets · Length 46 inches",
    reviews: [
      {
        id: "r-p13-1",
        name: "Neha Kurian",
        place: "Kochi",
        rating: 5,
        date: "4 days ago",
        text: "The soft blush shade and embroidery are straight out of a storybook. Fits like a dream!",
      },
    ],
  },
  {
    id: "p14",
    name: "Pleated Pastel Meadow Dress",
    category: "Dresses",
    categorySlug: "dresses",
    price: 1899,
    mrp: 2599,
    sizes: ["S", "M", "L", "XL"],
    image: "/images/about2.jpg",
    gallery: ["/images/about2.jpg", "/images/about4.jpg", "/images/dress.jpg"],
    popularity: 79,
    description:
      "Knife-pleated waist dress crafted in soft pastel cotton with flared sleeves and pearl button accents.",
    fabric: "100% Pure Cotton Cambric",
    craft: "Box-pleat waist construction with artisanal piping",
    care: "Cold wash; steam press gently",
    fit: "Fit and flare · Length 45 inches",
    reviews: [],
  },
  {
    id: "p15",
    name: "Handloom Lace Trim Midi Dress",
    category: "Dresses",
    categorySlug: "dresses",
    price: 2599,
    mrp: 3499,
    sizes: ["S", "M", "L"],
    image: "/images/inst4.jpg",
    gallery: ["/images/inst4.jpg", "/images/about5.jpg", "/images/instagram4.jpg"],
    isNew: true,
    popularity: 85,
    description:
      "Heirloom-inspired handloom midi dress elevated with delicate ivory crochet lace trims along the neckline and tiered skirt.",
    fabric: "Handspun Cotton-Linen",
    craft: "Crochet lace insertion and French seams",
    care: "Gentle hand wash separately",
    fit: "Relaxed midi silhouette · Length 47 inches",
    reviews: [],
  },

  /* -------- Additional Kurtas (p16 – p19) -------- */
  {
    id: "p16",
    name: "Ivory Floral Threadwork Kurta",
    category: "Kurtas",
    categorySlug: "kurtas",
    price: 1799,
    mrp: 2499,
    sizes: ["XS", "S", "M", "L", "XL"],
    image: "/images/kurtas.jpg",
    gallery: ["/images/kurtas.jpg", "/images/kurtas1.jpg", "/images/instagram2.jpg"],
    isNew: true,
    popularity: 93,
    description:
      "Soft ivory cotton kurta scattered with pastel rose floral motifs and scalloped lace edging along the sleeves and hem.",
    fabric: "Pure Cotton Mul with breathable lining",
    craft: "Multi-color Resham floral embroidery",
    care: "Gentle cold hand wash",
    fit: "Straight tailored fit · Length 45 inches",
    reviews: [
      {
        id: "r-p16-1",
        name: "Sreelakshmi K",
        place: "Aluva",
        rating: 5,
        date: "1 week ago",
        text: "Such neat embroidery and zero itchiness inside because of the soft lining.",
      },
    ],
  },
  {
    id: "p17",
    name: "Pastel Rose Pintuck Kurta",
    category: "Kurtas",
    categorySlug: "kurtas",
    price: 1499,
    mrp: 2199,
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: "/images/kurtas1.jpg",
    gallery: ["/images/kurtas1.jpg", "/images/kurtas.jpg", "/images/cateethnic.jpg"],
    popularity: 82,
    description:
      "Refined everyday kurta detailed with fine vertical pintucks at the front yoke, wooden buttons, and comfortable side slits.",
    fabric: "100% Breathable Slub Cotton",
    craft: "Hand-stitched pintucks and French knot accents",
    care: "Machine wash cold gentle",
    fit: "Comfort straight fit · Length 44 inches",
    reviews: [],
  },
  {
    id: "p18",
    name: "Festive Zari Border Kurta",
    category: "Kurtas",
    categorySlug: "kurtas",
    price: 2199,
    mrp: 2999,
    sizes: ["M", "L", "XL"],
    image: "/images/festive-wear.jpg",
    gallery: ["/images/festive-wear.jpg", "/images/cateethnic.jpg", "/images/instagram3.jpg"],
    isNew: true,
    popularity: 86,
    description:
      "Rich festive kurta framed with subtle antique zari weaves along the neckline and cuffs, designed to shine under warm evening lights.",
    fabric: "Chanderi Silk-Cotton with full lining",
    craft: "Woven zari border with hand-tacked potli buttons",
    care: "Dry clean only",
    fit: "Graceful A-line fit · Length 46 inches",
    reviews: [],
  },
  {
    id: "p19",
    name: "Breezy Chanderi A-Line Kurta",
    category: "Kurtas",
    categorySlug: "kurtas",
    price: 1599,
    mrp: 2199,
    sizes: ["S", "M", "L", "XL"],
    image: "/images/inst2.jpg",
    gallery: ["/images/inst2.jpg", "/images/kurtas.jpg", "/images/about1.jpg"],
    popularity: 74,
    description:
      "Lightweight A-line kurta with soft pastel stripes and side pockets, effortlessly styled with palazzos or straight pants.",
    fabric: "Soft Chanderi Cotton",
    craft: "Subtle woven texture with scalloped neck",
    care: "Gentle cold hand wash",
    fit: "Relaxed A-line · Length 45 inches",
    reviews: [],
  },

  /* -------- Additional Kurta Sets (p20 – p22) -------- */
  {
    id: "p20",
    name: "Rosebud Embroidered Kurta Set",
    category: "Kurta Sets",
    categorySlug: "kurta-sets",
    price: 2999,
    mrp: 4299,
    sizes: ["XS", "S", "M", "L", "XL"],
    image: "/images/kurtasset.jpg",
    gallery: ["/images/kurtasset.jpg", "/images/cateogry1.jpg", "/images/instagram5.jpg"],
    isNew: true,
    popularity: 94,
    description:
      "Our signature three-piece rosebud kurta set featuring hand-embroidered vine motifs, straight cotton trousers, and a soft organza floral dupatta.",
    fabric: "Chanderi Silk-Cotton kurta, Cotton pants & Organza dupatta",
    craft: "Hand-embroidered rosebuds with scalloped dupatta border",
    care: "Dry clean or gentle cold hand wash",
    fit: "Classic straight fit · Kurta 45 inches, Pants 38 inches",
    reviews: [
      {
        id: "r-p20-1",
        name: "Arathi Menon",
        place: "Kochi",
        rating: 5,
        date: "6 days ago",
        text: "Absolutely obsessed with this set! The rose embroidery looks handcrafted and delicate.",
      },
    ],
  },
  {
    id: "p21",
    name: "Mulmul Printed Kurta & Dupatta Set",
    category: "Kurta Sets",
    categorySlug: "kurta-sets",
    price: 2499,
    mrp: 3399,
    sizes: ["S", "M", "L", "XL"],
    image: "/images/inst5.png",
    gallery: ["/images/inst5.png", "/images/kurtasset.jpg", "/images/co-ords-set.jpg"],
    popularity: 83,
    description:
      "Feather-light mulmul kurta set in muted floral hues, paired with relaxed trousers and a printed mul dupatta edged in tassels.",
    fabric: "100% Pure Mulmul Cotton",
    craft: "Botanical print with hand-knotted tassel edges",
    care: "Cold hand wash separately",
    fit: "Easy relaxed fit · Kurta 44 inches",
    reviews: [],
  },
  {
    id: "p22",
    name: "Ivory Scallop Hem Kurta Set",
    category: "Kurta Sets",
    categorySlug: "kurta-sets",
    price: 3199,
    mrp: 4499,
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: "/images/about4.jpg",
    gallery: ["/images/about4.jpg", "/images/kurtasset.jpg", "/images/cateethnic.jpg"],
    isNew: true,
    popularity: 87,
    description:
      "Refined ivory kurta set accentuated with scalloped embroidered borders at the kurta hem, sleeves, and straight pants.",
    fabric: "Soft Cotton Linen Blend",
    craft: "Cutwork scalloped embroidery",
    care: "Gentle hand wash or dry clean",
    fit: "Tailored comfort fit · Kurta 44 inches",
    reviews: [],
  },

  /* -------- Additional Tops (p23 – p26) -------- */
  {
    id: "p23",
    name: "Embroidered Boho Cotton Top",
    category: "Tops",
    categorySlug: "tops",
    price: 1099,
    mrp: 1599,
    sizes: ["XS", "S", "M", "L", "XL"],
    image: "/images/tops.jpg",
    gallery: ["/images/tops.jpg", "/images/catetop.jpg", "/images/inst3.jpg"],
    isNew: true,
    popularity: 89,
    description:
      "Airy bohemian-inspired cotton top finished with rose floral embroidery across the neckline and gently puffed blouson sleeves.",
    fabric: "100% Organic Cotton Gauze",
    craft: "Hand-guided floral thread embroidery",
    care: "Gentle cold hand wash",
    fit: "Relaxed easy fit · Length 25 inches",
    reviews: [
      {
        id: "r-p23-1",
        name: "Fathima Zuhra",
        place: "Ernakulam",
        rating: 5,
        date: "1 week ago",
        text: "So pretty and light! Love the embroidery detail on the sleeves too.",
      },
    ],
  },
  {
    id: "p24",
    name: "Gathered Yoke Floral Top",
    category: "Tops",
    categorySlug: "tops",
    price: 899,
    mrp: 1399,
    sizes: ["XS", "S", "M", "L"],
    image: "/images/inst3.jpg",
    gallery: ["/images/inst3.jpg", "/images/tops.jpg", "/images/catetop.jpg"],
    popularity: 77,
    description:
      "Soft gathered yoke blouse featuring delicate floral motifs, tie-up tassel neckline, and breathable three-quarter sleeves.",
    fabric: "100% Soft Mul Cotton",
    craft: "Gathered yoke with hand-tied cotton tassels",
    care: "Cold hand wash",
    fit: "Flowy relaxed fit · Length 24 inches",
    reviews: [],
  },
  {
    id: "p25",
    name: "Lace Trim Mandarin Collar Top",
    category: "Tops",
    categorySlug: "tops",
    price: 1199,
    mrp: 1699,
    sizes: ["S", "M", "L", "XL"],
    image: "/images/inst6.jpg",
    gallery: ["/images/inst6.jpg", "/images/office-wear.jpg", "/images/tops.jpg"],
    isNew: true,
    popularity: 81,
    description:
      "Polished work-to-weekend cotton top elevated with a crisp mandarin collar and delicate crochet lace trim along the button placket.",
    fabric: "100% Cotton Poplin",
    craft: "Crochet lace insertion with shell buttons",
    care: "Machine wash gentle cold",
    fit: "Tailored smart-casual fit · Length 26 inches",
    reviews: [],
  },
  {
    id: "p26",
    name: "Pleated Pastel Sleeveless Top",
    category: "Tops",
    categorySlug: "tops",
    price: 849,
    mrp: 1199,
    sizes: ["XS", "S", "M", "L"],
    image: "/images/about5.jpg",
    gallery: ["/images/about5.jpg", "/images/catetop.jpg", "/images/tops.jpg"],
    popularity: 68,
    description:
      "Minimal pleated summer top in dusty rose hues, designed for effortless layering under blazers or pairing with breezy skirts.",
    fabric: "Cotton-Linen Blend",
    craft: "Knife-pleated front detail",
    care: "Gentle cold wash",
    fit: "Regular fit · Length 23 inches",
    reviews: [],
  },

  /* -------- Additional Maternity Wear (p27 – p30) -------- */
  {
    id: "p27",
    name: "Blossom Nursing Friendly Kurta",
    category: "Maternity Wear",
    categorySlug: "maternity-wear",
    price: 1899,
    mrp: 2599,
    sizes: ["M", "L", "XL", "XXL"],
    image: "/images/maternity-wear.jpg",
    gallery: ["/images/maternity-wear.jpg", "/images/feeding-friendly-wear.jpg", "/images/causal-waer.jpg"],
    isNew: true,
    popularity: 91,
    description:
      "Thoughtfully tailored maternity and nursing kurta with dual concealed side-bust zippers, gentle empire pleats, and pure breathable cotton comfort.",
    fabric: "100% Pre-washed Soft Mulmul with Cotton Lining",
    craft: "Hidden smooth nursing zippers & empire waist gathers",
    care: "Gentle cold hand or machine wash",
    fit: "Bump & nursing friendly · Length 46 inches",
    reviews: [
      {
        id: "r-p27-1",
        name: "Swathi Menon",
        place: "Kochi",
        rating: 5,
        date: "5 days ago",
        text: "The softest fabric for both mom and baby! Zippers are completely invisible from outside.",
      },
    ],
  },
  {
    id: "p28",
    name: "Dual-Zip Comfort Maternity Dress",
    category: "Maternity Wear",
    categorySlug: "maternity-wear",
    price: 2099,
    mrp: 2799,
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: "/images/feeding-friendly-wear.jpg",
    gallery: ["/images/feeding-friendly-wear.jpg", "/images/maternity-wear.jpg", "/images/insta1.png"],
    isNew: true,
    popularity: 85,
    description:
      "Flowy midi maternity dress crafted with discreet dual feeding zippers, deep side pockets, and adjustable back tie for every stage of motherhood.",
    fabric: "Breathable Pure Cambric Cotton",
    craft: "Discreet vertical nursing openings & deep pockets",
    care: "Cold hand wash",
    fit: "Adaptable maternity fit · Length 47 inches",
    reviews: [],
  },
  {
    id: "p29",
    name: "Pastel Pleated Maternity Kurta Set",
    category: "Maternity Wear",
    categorySlug: "maternity-wear",
    price: 2599,
    mrp: 3499,
    sizes: ["M", "L", "XL", "XXL"],
    image: "/images/nightwear.jpg",
    gallery: ["/images/nightwear.jpg", "/images/maternity-wear.jpg", "/images/feeding-friendly-wear.jpg"],
    popularity: 80,
    description:
      "Complete two-piece maternity kurta & soft elastic-waist palazzo set, with concealed feeding zippers and ultra-soft breathable weave.",
    fabric: "100% Organic Cotton",
    craft: "Concealed nursing zippers + adjustable belly-friendly waistband",
    care: "Gentle wash cold",
    fit: "Relaxed maternity set · Kurta 45 inches, Pants 39 inches",
    reviews: [],
  },
  {
    id: "p30",
    name: "Soft Mulmul Feeding Tiered Dress",
    category: "Maternity Wear",
    categorySlug: "maternity-wear",
    price: 1999,
    mrp: 2699,
    sizes: ["S", "M", "L", "XL"],
    image: "/images/about3.png",
    gallery: ["/images/about3.png", "/images/maternity-wear.jpg", "/images/insta1.png"],
    popularity: 74,
    description:
      "Soft tiered cotton dress featuring hidden nursing access under the ruffled bodice tier—styled so beautifully you’ll keep wearing it long after.",
    fabric: "100% Pure Mulmul Cotton",
    craft: "Hidden horizontal nursing panel under bodice ruffle",
    care: "Gentle cold hand wash",
    fit: "Tiered maternity & post-partum fit · Length 46 inches",
    reviews: [],
  },
];

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getProductsBySlug(slug: CategorySlug): Product[] {
  return PRODUCTS.filter((p) => p.categorySlug === slug);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const sameCategory = PRODUCTS.filter(
    (p) => p.id !== product.id && p.categorySlug === product.categorySlug
  );
  const others = PRODUCTS.filter(
    (p) => p.id !== product.id && p.categorySlug !== product.categorySlug
  );
  return [...sameCategory, ...others].slice(0, limit);
}

