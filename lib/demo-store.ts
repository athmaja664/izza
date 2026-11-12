import { CATEGORIES, type Category } from "@/lib/categories";
import { PRODUCTS, type Product } from "@/lib/products";
import { type Address } from "@/lib/izha-store";

export type HeroSlide = {
  id: string;
  image: string;
  imageAlt: string;
  imagePosition: string;
  eyebrow: string;
  title: string;
  text: string;
  cta: string;
  href: string;
  textColor: string;
  accentColor: string;
};

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: "slide-1",
    image: "/images/hero5.png",
    imageAlt: "Izha Blooms new festive collection",
    imagePosition: "right center",
    eyebrow: "New Festive Collection",
    title: "Where Every Thread Blooms",
    text: "Handcrafted embroidered kurtas in soft rose shades, made for your most beautiful moments.",
    cta: "Shop Now",
    href: "/shop",
    textColor: "#3A1426",
    accentColor: "#8F3057",
  },
  {
    id: "slide-2",
    image: "/images/hero4.png",
    imageAlt: "Embroidered kurtas in soft rose shades",
    imagePosition: "right center",
    eyebrow: "Season of Elegance",
    title: "Embroidered Kurtas, Made to Be Loved",
    text: "Soft rose shades and fine handwork for every celebration this season.",
    cta: "Shop Now",
    href: "/shop",
    textColor: "#3A1426",
    accentColor: "#8F3057",
  },
];

export const DEFAULT_CATEGORIES: Category[] = CATEGORIES;

export type InstagramPost = {
  id: string;
  image: string;
  alt: string;
  postUrl: string;
};

export const DEFAULT_INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: "ig-1",
    image: "/images/inst6.jpg",
    alt: "Embroidered kurta in soft pastel shades",
    postUrl: "https://www.instagram.com/izhablooms/",
  },
  {
    id: "ig-2",
    image: "/images/inst2.jpg",
    alt: "Close-up of intricate embroidery and fabric detail",
    postUrl: "https://www.instagram.com/izhablooms/",
  },
  {
    id: "ig-3",
    image: "/images/inst3.jpg",
    alt: "Ethnic outfit styled for a festive occasion",
    postUrl: "https://www.instagram.com/izhablooms/",
  },
  {
    id: "ig-4",
    image: "/images/inst4.jpg",
    alt: "Collection of women's ethnic wear in soft colours",
    postUrl: "https://www.instagram.com/izhablooms/",
  },
  {
    id: "ig-5",
    image: "/images/inst5.png",
    alt: "Fashion product photography with floral styling",
    postUrl: "https://www.instagram.com/izhablooms/",
  },
];

export const ALL_CLOTH_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"] as const;

export type AdminProduct = Product & {
  color: string;
  stock: number;
  soldCount: number;
};

const COLOR_CYCLE = [
  "Dusty Rose",
  "Ivory Cream",
  "Pastel Blush",
  "Sage Mist",
  "Rosewood Plum",
  "Sandstone Beige",
];

export const DEFAULT_ADMIN_PRODUCTS: AdminProduct[] = PRODUCTS.map((p, idx) => ({
  ...p,
  color: COLOR_CYCLE[idx % COLOR_CYCLE.length],
  stock: idx === 7 ? 3 : idx === 11 ? 0 : 12 + ((idx * 5) % 24),
  soldCount: 8 + ((idx * 7) % 36),
}));

export type Coupon = {
  id: string;
  code: string;
  type: "percent" | "flat";
  value: number;
  minOrder: number;
  firstOrderOnly: boolean;
  active: boolean;
  expiry: string;
  usedCount: number;
};

export const DEFAULT_COUPONS: Coupon[] = [
  {
    id: "cpn-1",
    code: "BLOOM10",
    type: "percent",
    value: 10,
    minOrder: 999,
    firstOrderOnly: false,
    active: true,
    expiry: "2026-12-31",
    usedCount: 42,
  },
  {
    id: "cpn-2",
    code: "FIRST15",
    type: "percent",
    value: 15,
    minOrder: 1299,
    firstOrderOnly: true,
    active: true,
    expiry: "2026-12-31",
    usedCount: 28,
  },
  {
    id: "cpn-3",
    code: "IZHA200",
    type: "flat",
    value: 200,
    minOrder: 1799,
    firstOrderOnly: false,
    active: true,
    expiry: "2026-11-30",
    usedCount: 19,
  },
];

export type OfferSettings = {
  firstOrderEnabled: boolean;
  firstOrderDiscountPct: number;
  comboEnabled: boolean;
  comboTitle: string;
  comboMinItems: number;
  comboDiscountPct: number;
  freeShippingKerala: boolean;
  outsideKeralaShipping: number;
  freeShippingThreshold: number;
  metaPixelId: string;
};

export const DEFAULT_OFFER_SETTINGS: OfferSettings = {
  firstOrderEnabled: true,
  firstOrderDiscountPct: 10,
  comboEnabled: true,
  comboTitle: "Buy 2+ Pieces & Get 15% Off",
  comboMinItems: 2,
  comboDiscountPct: 15,
  freeShippingKerala: true,
  outsideKeralaShipping: 79,
  freeShippingThreshold: 1499,
  metaPixelId: "109482736154290",
};

export type OrderStatus = "Processing" | "Packed" | "Shipped" | "Delivered" | "Cancelled";
export type TrafficSource = "Meta Ads" | "Instagram" | "Direct";

export type DemoOrderItem = {
  id: string;
  name: string;
  image: string;
  size: string;
  qty: number;
  price: number;
};

export type DemoOrder = {
  id: string;
  createdAt: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  items: DemoOrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shipping: number;
  total: number;
  paymentMethod: "UPI" | "Card" | "NetBanking" | "Cash on Delivery";
  paymentStatus: "Paid" | "COD Pending";
  paymentRef: string;
  status: OrderStatus;
  source: TrafficSource;
};

export type DemoCustomer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  pincode: string;
  address: string;
  joinedAt: string;
  source: TrafficSource;
  savedAddresses: Address[];
};

export const DEFAULT_CUSTOMERS: DemoCustomer[] = [
  {
    id: "cust-1",
    name: "Ananya Menon",
    email: "ananya.menon@example.com",
    phone: "9847011223",
    city: "Kochi",
    state: "Kerala",
    pincode: "682016",
    address: "14B Jasmine Villa, Panampilly Nagar",
    joinedAt: "2026-09-18",
    source: "Meta Ads",
    savedAddresses: [
      {
        id: "addr-1",
        label: "Home",
        name: "Ananya Menon",
        phone: "9847011223",
        line: "14B Jasmine Villa, Panampilly Nagar",
        city: "Kochi, Kerala",
        pincode: "682016",
        isDefault: true,
      },
    ],
  },
  {
    id: "cust-2",
    name: "Divya Krishnan",
    email: "divya.krishnan@example.com",
    phone: "9995123456",
    city: "Aluva",
    state: "Kerala",
    pincode: "683101",
    address: "Rose Garden Apartments, Bank Junction",
    joinedAt: "2026-10-02",
    source: "Instagram",
    savedAddresses: [
      {
        id: "addr-2",
        label: "Home",
        name: "Divya Krishnan",
        phone: "9995123456",
        line: "Rose Garden Apartments, Bank Junction",
        city: "Aluva, Kerala",
        pincode: "683101",
        isDefault: true,
      },
    ],
  },
  {
    id: "cust-3",
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    phone: "9820456789",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560038",
    address: "42, 12th Main Road, Indiranagar",
    joinedAt: "2026-10-19",
    source: "Meta Ads",
    savedAddresses: [
      {
        id: "addr-3",
        label: "Work",
        name: "Priya Sharma",
        phone: "9820456789",
        line: "42, 12th Main Road, Indiranagar",
        city: "Bengaluru, Karnataka",
        pincode: "560038",
        isDefault: true,
      },
    ],
  },
  {
    id: "cust-4",
    name: "Meera Nair",
    email: "meera.nair@example.com",
    phone: "9447890123",
    city: "Thrissur",
    state: "Kerala",
    pincode: "680001",
    address: "Grace Enclave, Swaraj Round East",
    joinedAt: "2026-10-27",
    source: "Direct",
    savedAddresses: [],
  },
  {
    id: "cust-5",
    name: "Aiswarya Raj",
    email: "aiswarya.raj@example.com",
    phone: "9745012345",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600020",
    address: "18 Karpagam Avenue, Adyar",
    joinedAt: "2026-11-04",
    source: "Meta Ads",
    savedAddresses: [],
  },
  {
    id: "cust-6",
    name: "Lakshmi Priya",
    email: "lakshmi.p@example.com",
    phone: "9895667788",
    city: "Calicut",
    state: "Kerala",
    pincode: "673001",
    address: "22 Beach Road, Nadakkavu",
    joinedAt: "2026-11-09",
    source: "Instagram",
    savedAddresses: [],
  },
];

export const DEFAULT_ORDERS: DemoOrder[] = [
  {
    id: "IZB-1006",
    createdAt: "2026-11-11 14:20",
    customerId: "cust-6",
    customerName: "Lakshmi Priya",
    customerPhone: "9895667788",
    customerEmail: "lakshmi.p@example.com",
    address: "22 Beach Road, Nadakkavu",
    city: "Calicut",
    state: "Kerala",
    pincode: "673001",
    items: [
      {
        id: "p20",
        name: "Rosebud Embroidered Kurta Set",
        image: "/images/kurtasset.jpg",
        size: "M",
        qty: 1,
        price: 2999,
      },
    ],
    subtotal: 2999,
    discount: 300,
    couponCode: "BLOOM10",
    shipping: 0,
    total: 2699,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    paymentRef: "UPI-43198201",
    status: "Processing",
    source: "Instagram",
  },
  {
    id: "IZB-1005",
    createdAt: "2026-11-10 18:45",
    customerId: "cust-5",
    customerName: "Aiswarya Raj",
    customerPhone: "9745012345",
    customerEmail: "aiswarya.raj@example.com",
    address: "18 Karpagam Avenue, Adyar",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600020",
    items: [
      {
        id: "p5",
        name: "Feeding Friendly Maternity Kurta",
        image: "/images/causal-waer.jpg",
        size: "L",
        qty: 1,
        price: 1699,
      },
      {
        id: "p4",
        name: "Ruffle Sleeve Cotton Top",
        image: "/images/catetop.jpg",
        size: "M",
        qty: 1,
        price: 799,
      },
    ],
    subtotal: 2498,
    discount: 375,
    couponCode: "FIRST15",
    shipping: 0,
    total: 2123,
    paymentMethod: "Card",
    paymentStatus: "Paid",
    paymentRef: "CARD-882910",
    status: "Packed",
    source: "Meta Ads",
  },
  {
    id: "IZB-1004",
    createdAt: "2026-11-08 11:10",
    customerId: "cust-3",
    customerName: "Priya Sharma",
    customerPhone: "9820456789",
    customerEmail: "priya.sharma@example.com",
    address: "42, 12th Main Road, Indiranagar",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560038",
    items: [
      {
        id: "p1",
        name: "Floral Printed Cotton Dress",
        image: "/images/about.jpg",
        size: "S",
        qty: 1,
        price: 1499,
      },
    ],
    subtotal: 1499,
    discount: 0,
    shipping: 79,
    total: 1578,
    paymentMethod: "NetBanking",
    paymentStatus: "Paid",
    paymentRef: "NB-774120",
    status: "Shipped",
    source: "Meta Ads",
  },
  {
    id: "IZB-1003",
    createdAt: "2026-11-05 16:05",
    customerId: "cust-4",
    customerName: "Meera Nair",
    customerPhone: "9447890123",
    customerEmail: "meera.nair@example.com",
    address: "Grace Enclave, Swaraj Round East",
    city: "Thrissur",
    state: "Kerala",
    pincode: "680001",
    items: [
      {
        id: "p2",
        name: "Embroidered Anarkali Kurta",
        image: "/images/cateethnic.jpg",
        size: "L",
        qty: 1,
        price: 1899,
      },
    ],
    subtotal: 1899,
    discount: 200,
    couponCode: "IZHA200",
    shipping: 0,
    total: 1699,
    paymentMethod: "Cash on Delivery",
    paymentStatus: "COD Pending",
    paymentRef: "COD-1003",
    status: "Delivered",
    source: "Direct",
  },
  {
    id: "IZB-1002",
    createdAt: "2026-11-02 09:30",
    customerId: "cust-2",
    customerName: "Divya Krishnan",
    customerPhone: "9995123456",
    customerEmail: "divya.krishnan@example.com",
    address: "Rose Garden Apartments, Bank Junction",
    city: "Aluva",
    state: "Kerala",
    pincode: "683101",
    items: [
      {
        id: "p3",
        name: "Chikankari Kurta Set with Dupatta",
        image: "/images/cateogry1.jpg",
        size: "M",
        qty: 1,
        price: 2799,
      },
    ],
    subtotal: 2799,
    discount: 280,
    couponCode: "BLOOM10",
    shipping: 0,
    total: 2519,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    paymentRef: "UPI-39021144",
    status: "Delivered",
    source: "Instagram",
  },
  {
    id: "IZB-1001",
    createdAt: "2026-10-28 19:12",
    customerId: "cust-1",
    customerName: "Ananya Menon",
    customerPhone: "9847011223",
    customerEmail: "ananya.menon@example.com",
    address: "14B Jasmine Villa, Panampilly Nagar",
    city: "Kochi",
    state: "Kerala",
    pincode: "682016",
    items: [
      {
        id: "p8",
        name: "Festive Silk Kurta Set",
        image: "/images/festive-wear.jpg",
        size: "M",
        qty: 1,
        price: 3299,
      },
    ],
    subtotal: 3299,
    discount: 330,
    couponCode: "BLOOM10",
    shipping: 0,
    total: 2969,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    paymentRef: "UPI-22014890",
    status: "Delivered",
    source: "Meta Ads",
  },
];

export type AdminProfile = {
  name: string;
  role: string;
  email: string;
  phone: string;
  whatsapp: string;
  location: string;
  instagram: string;
  facebook: string;
  bio: string;
};

export const DEFAULT_ADMIN_PROFILE: AdminProfile = {
  name: "Izha Blooms Studio",
  role: "Store Owner & Curator",
  email: "izhablooms@gmail.com",
  phone: "9995757612",
  whatsapp: "919995757612",
  location: "Aluva, Kerala, India",
  instagram: "@izhablooms",
  facebook: "facebook.com/izhablooms",
  bio: "Managing collections, custom orders, inventory, and Pan-India shipping from our studio in Aluva, Kerala.",
};

export const MONTHLY_REVENUE_SERIES = [
  { month: "Jun", revenue: 38400, orders: 21 },
  { month: "Jul", revenue: 46200, orders: 26 },
  { month: "Aug", revenue: 54800, orders: 31 },
  { month: "Sep", revenue: 62500, orders: 36 },
  { month: "Oct", revenue: 74900, orders: 43 },
  { month: "Nov", revenue: 88200, orders: 49 },
];

export function generateCouponCode(prefix = "IZHA"): string {
  const words = ["BLOOM", "ROSE", "SILK", "FEST", "GLOW", "THREAD"];
  const word = words[Math.floor(Math.random() * words.length)];
  const num = Math.floor(10 + Math.random() * 89);
  return `${prefix}-${word}${num}`;
}

export function checkIndiaPincode(
  pincode: string,
  subtotal: number,
  offers: OfferSettings
): {
  valid: boolean;
  serviceable: boolean;
  region: "Kerala" | "India" | "";
  eta: string;
  shipping: number;
  message: string;
} {
  const clean = pincode.trim();
  if (!/^[1-8]\d{5}$/.test(clean)) {
    return {
      valid: false,
      serviceable: false,
      region: "",
      eta: "",
      shipping: offers.outsideKeralaShipping,
      message: "Enter a valid 6-digit Indian PIN code (e.g., 683101 or 560001).",
    };
  }
  const isKerala = /^6[7-9]\d{4}$/.test(clean);
  if (isKerala) {
    const free = offers.freeShippingKerala || subtotal >= offers.freeShippingThreshold;
    return {
      valid: true,
      serviceable: true,
      region: "Kerala",
      eta: "2–4 business days",
      shipping: free ? 0 : offers.outsideKeralaShipping,
      message: free
        ? "Serviceable in Kerala · Free doorstep delivery in 2–4 business days."
        : `Serviceable in Kerala · Delivery in 2–4 business days (₹${offers.outsideKeralaShipping} shipping).`,
    };
  }
  const free = subtotal >= offers.freeShippingThreshold;
  return {
    valid: true,
    serviceable: true,
    region: "India",
    eta: "4–7 business days",
    shipping: free ? 0 : offers.outsideKeralaShipping,
    message: free
      ? "Pan-India delivery available · Free shipping unlocked (4–7 business days)."
      : `Pan-India delivery available · ₹${offers.outsideKeralaShipping} shipping (Free above ₹${offers.freeShippingThreshold.toLocaleString("en-IN")}) · 4–7 business days.`,
  };
}

