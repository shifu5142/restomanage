import {
  BarChart3,
  Bot,
  CalendarDays,
  ChefHat,
  ClipboardList,
  CreditCard,
  FileText,
  HeadphonesIcon,
  LayoutDashboard,
  MessageSquare,
  Package,
  Settings,
  ShoppingCart,
  Star,
  Truck,
  Users,
  UtensilsCrossed,
} from "lucide-react";

export const APP_NAME = "RestoFlow";
export const APP_TAGLINE = "Premium Restaurant Management";

export const NAV_ITEMS = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Reservations", href: "/reservations", icon: CalendarDays },
  { title: "Orders", href: "/orders", icon: ClipboardList },
  { title: "Tables", href: "/tables", icon: UtensilsCrossed, adminOnly: true },
  { title: "Menu", href: "/menu", icon: ChefHat },
  { title: "Cart", href: "/cart", icon: ShoppingCart },
  { title: "Inventory", href: "/inventory", icon: Package, adminOnly: true },
  { title: "Employees", href: "/employees", icon: Users, adminOnly: true },
  { title: "Customers", href: "/customers", icon: Users, adminOnly: true },
  { title: "Kitchen", href: "/kitchen", icon: ChefHat, adminOnly: true },
  { title: "Delivery", href: "/delivery", icon: Truck, adminOnly: true },
  { title: "Payments", href: "/payments", icon: CreditCard, adminOnly: true },
  { title: "Reports", href: "/reports", icon: FileText, adminOnly: true },
  { title: "Analytics", href: "/analytics", icon: BarChart3, adminOnly: true },
  { title: "Reviews", href: "/reviews", icon: Star },
  { title: "AI Tools", href: "/ai-tools", icon: Bot, adminOnly: true },
  { title: "Settings", href: "/settings", icon: Settings },
  { title: "Support", href: "/support", icon: HeadphonesIcon },
] as const;

export const CUSTOMER_NAV_HREFS = [
  "/dashboard",
  "/menu",
  "/cart",
  "/orders",
  "/reservations",
  "/reviews",
  "/settings",
  "/support",
] as const;

export const MARKETING_NAV = [
  { title: "Home", href: "/" },
  { title: "Features", href: "/features" },
  { title: "Pricing", href: "/pricing" },
  { title: "About", href: "/about" },
  { title: "Contact", href: "/contact" },
] as const;

export const MENU_CATEGORIES = [
  "pizza",
  "burger",
  "pasta",
  "steak",
  "seafood",
  "sushi",
  "salads",
  "desserts",
  "drinks",
  "breakfast",
  "kids_menu",
] as const;

export const FOOD_IMAGES = [
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1493770348161-369560ae357d?w=400&h=300&fit=crop",
];

export const RESTAURANT_BG =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&h=1080&fit=crop";

export const AVATARS = [
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
];

export const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  confirmed: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  seated: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
  preparing: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
  ready: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  completed: "bg-slate-500/15 text-slate-600 dark:text-slate-400",
  delivered: "bg-teal-500/15 text-teal-600 dark:text-teal-400",
  cancelled: "bg-red-500/15 text-red-600 dark:text-red-400",
  available: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  occupied: "bg-red-500/15 text-red-600 dark:text-red-400",
  reserved: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  cleaning: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  vip: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  paid: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  active: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
};

export const CHAT_CHANNELS = [
  { id: "managers", label: "Managers", icon: MessageSquare },
  { id: "kitchen", label: "Kitchen", icon: ChefHat },
  { id: "waiters", label: "Waiters", icon: Users },
  { id: "owners", label: "Owners", icon: Users },
  { id: "support", label: "Support", icon: HeadphonesIcon },
] as const;
