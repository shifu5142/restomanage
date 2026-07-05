import type {
  ChartDataPoint,
  Customer,
  DashboardStats,
  DeliveryOrder,
  Employee,
  EmployeeRole,
  InventoryItem,
  KitchenStatus,
  MenuCategory,
  MenuItem,
  Notification,
  Order,
  OrderStatus,
  Payment,
  PaymentMethod,
  Reservation,
  ReservationStatus,
  RestaurantTable,
  Review,
  TableStatus,
  ChatMessage,
} from "@/types";
import {
  AVATARS,
  FOOD_IMAGES,
  MENU_CATEGORIES,
} from "@/lib/constants";
import { DELIVERY_LOCATIONS } from "@/lib/delivery/locations";

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const rand = seededRandom(42);
const pick = <T>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];
const pickN = <T>(arr: T[], n: number): T[] => {
  const copy = [...arr];
  const result: T[] = [];
  for (let i = 0; i < n && copy.length; i++) {
    const idx = Math.floor(rand() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
};

const FIRST = ["James", "Maria", "David", "Sarah", "Michael", "Emma", "Robert", "Lisa", "William", "Jennifer", "Thomas", "Anna", "Daniel", "Sophie", "Chris"];
const LAST = ["Anderson", "Martinez", "Thompson", "Garcia", "Wilson", "Brown", "Davis", "Miller", "Taylor", "Moore", "Jackson", "White", "Harris", "Clark", "Lewis"];

const DISH_NAMES: Record<MenuCategory, string[]> = {
  pizza: ["Margherita", "Pepperoni Supreme", "Truffle Mushroom", "Quattro Formaggi", "Diavola"],
  burger: ["Classic Smash", "Wagyu Deluxe", "BBQ Bacon", "Veggie Garden", "Double Stack"],
  pasta: ["Carbonara", "Bolognese", "Truffle Tagliatelle", "Penne Arrabbiata", "Lobster Ravioli"],
  steak: ["Ribeye 12oz", "Filet Mignon", "NY Strip", "Tomahawk", "Surf & Turf"],
  seafood: ["Grilled Salmon", "Lobster Tail", "Seafood Paella", "Tuna Tartare", "Oysters Rockefeller"],
  sushi: ["Dragon Roll", "Rainbow Roll", "Salmon Nigiri", "Spicy Tuna", "Omakase Platter"],
  salads: ["Caesar", "Greek", "Quinoa Power", "Caprese", "Asian Slaw"],
  desserts: ["Tiramisu", "Crème Brûlée", "Chocolate Lava", "Panna Cotta", "Cheesecake"],
  drinks: ["Old Fashioned", "Espresso Martini", "House Wine", "Craft IPA", "Fresh Lemonade"],
  breakfast: ["Eggs Benedict", "Avocado Toast", "French Toast", "Full English", "Acai Bowl"],
  kids_menu: ["Chicken Tenders", "Mac & Cheese", "Mini Burger", "Pasta Butter", "Fish Fingers"],
};

const DESCRIPTIONS = [
  "House-made with locally sourced ingredients and chef's signature touch.",
  "A customer favorite, perfectly balanced flavors and elegant presentation.",
  "Slow-cooked to perfection with aromatic herbs and premium spices.",
  "Fresh daily preparation with seasonal produce from local farms.",
  "Award-winning recipe crafted by our executive chef.",
];

const SUPPLIERS = ["Fresh Farms Co.", "Ocean Harvest", "Prime Meats Ltd.", "Valley Produce", "Artisan Foods"];
const ALLERGENS = ["gluten", "dairy", "nuts", "shellfish", "eggs", "soy"];
const UNITS = ["kg", "lbs", "units", "liters", "boxes"];

function genName(): string {
  return `${pick(FIRST)} ${pick(LAST)}`;
}

function genDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split("T")[0];
}

function genDateTime(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(Math.floor(rand() * 14) + 8, Math.floor(rand() * 4) * 15, 0, 0);
  return d.toISOString();
}

function genTime(): string {
  const h = Math.floor(rand() * 10) + 11;
  const m = pick(["00", "15", "30", "45"]);
  return `${h.toString().padStart(2, "0")}:${m}`;
}

export function generateMenuItems(count = 50): MenuItem[] {
  const items: MenuItem[] = [];
  let id = 1;
  for (const category of MENU_CATEGORIES) {
    const names = DISH_NAMES[category];
    const perCat = Math.ceil(count / MENU_CATEGORIES.length);
    for (let i = 0; i < perCat && items.length < count; i++) {
      const name = names[i % names.length];
      items.push({
        id: `menu-${id++}`,
        name: i > 0 ? `${name} ${i + 1}` : name,
        description: pick(DESCRIPTIONS),
        price: Math.round((8 + rand() * 45) * 100) / 100,
        category,
        image: FOOD_IMAGES[items.length % FOOD_IMAGES.length],
        prepTime: Math.floor(rand() * 35) + 5,
        available: rand() > 0.08,
        popular: rand() > 0.7,
        spicy: rand() > 0.75,
        vegan: rand() > 0.85,
        vegetarian: rand() > 0.8,
        kosher: rand() > 0.9,
        glutenFree: rand() > 0.8,
        allergens: pickN(ALLERGENS, Math.floor(rand() * 3)),
      });
    }
  }
  return items.slice(0, count);
}

export function generateReservations(count = 300): Reservation[] {
  const statuses: ReservationStatus[] = ["pending", "confirmed", "seated", "completed", "cancelled"];
  return Array.from({ length: count }, (_, i) => ({
    id: `res-${i + 1}`,
    customerName: genName(),
    customerEmail: `customer${i + 1}@email.com`,
    customerPhone: `+1 (555) ${String(100 + Math.floor(rand() * 900))}-${String(1000 + Math.floor(rand() * 9000))}`,
    partySize: Math.floor(rand() * 8) + 1,
    date: genDate(Math.floor(rand() * 60) - 10),
    time: genTime(),
    status: pick(statuses),
    tableId: rand() > 0.3 ? `table-${Math.floor(rand() * 20) + 1}` : undefined,
    notes: rand() > 0.6 ? "Window seat preferred" : undefined,
    specialRequests: rand() > 0.7 ? "Birthday celebration" : undefined,
    createdAt: genDateTime(Math.floor(rand() * 30)),
  }));
}

export function generateOrders(count = 200, menuItems: MenuItem[]): Order[] {
  const statuses: OrderStatus[] = ["pending", "confirmed", "preparing", "ready", "delivered", "completed", "cancelled"];
  const kitchenStatuses: KitchenStatus[] = ["waiting", "preparing", "ready", "completed"];
  const methods: PaymentMethod[] = ["cash", "credit_card", "apple_pay", "google_pay", "gift_card"];

  return Array.from({ length: count }, (_, i) => {
    const itemCount = Math.floor(rand() * 4) + 1;
    const items = pickN(menuItems, itemCount).map((m) => ({
      menuItemId: m.id,
      name: m.name,
      quantity: Math.floor(rand() * 3) + 1,
      price: m.price,
    }));
    const total = items.reduce((s, it) => s + it.price * it.quantity, 0);
    const status = pick(statuses);
    const created = genDateTime(Math.floor(rand() * 14));

    return {
      id: `ord-${i + 1}`,
      customerName: genName(),
      tableId: rand() > 0.2 ? `table-${Math.floor(rand() * 20) + 1}` : undefined,
      items,
      status,
      waiterId: `emp-${Math.floor(rand() * 10) + 5}`,
      waiterName: genName(),
      kitchenStatus: pick(kitchenStatuses),
      paymentStatus: status === "cancelled" ? "failed" as const : rand() > 0.15 ? "paid" as const : "pending" as const,
      paymentMethod: pick(methods),
      total: Math.round(total * 100) / 100,
      tip: Math.round(total * rand() * 0.2 * 100) / 100,
      prepTime: Math.floor(rand() * 40) + 10,
      createdAt: created,
      timeline: [
        { status: "Order Placed", time: created },
        { status: "Confirmed", time: created, note: "Kitchen notified" },
        { status: "Preparing", time: created },
        { status: "Ready", time: created },
      ],
    };
  });
}

export function generateTables(count = 24): RestaurantTable[] {
  const statuses: TableStatus[] = ["available", "occupied", "reserved", "cleaning", "vip"];
  const sections = ["Main Hall", "Patio", "Private Room", "Bar"];
  return Array.from({ length: count }, (_, i) => ({
    id: `table-${i + 1}`,
    number: i + 1,
    capacity: pick([2, 2, 4, 4, 4, 6, 6, 8]),
    status: pick(statuses),
    section: pick(sections),
    x: (i % 6) * 120 + 40,
    y: Math.floor(i / 6) * 120 + 40,
    reservationId: rand() > 0.6 ? `res-${Math.floor(rand() * 50) + 1}` : undefined,
  }));
}

export function generateEmployees(count = 25): Employee[] {
  const roles: EmployeeRole[] = ["owner", "manager", "chef", "sous_chef", "waiter", "cashier", "delivery_driver", "cleaner"];
  const shifts = ["Morning (6AM-2PM)", "Afternoon (2PM-10PM)", "Evening (5PM-1AM)"];
  const statuses = ["active", "on_break", "off_duty"] as const;

  return Array.from({ length: count }, (_, i) => ({
    id: `emp-${i + 1}`,
    name: genName(),
    email: `employee${i + 1}@restoflow.com`,
    role: i === 0 ? "owner" : pick(roles),
    avatar: AVATARS[i % AVATARS.length],
    shift: pick(shifts),
    salary: Math.floor(30000 + rand() * 70000),
    status: pick([...statuses]),
    performance: Math.round((70 + rand() * 30) * 10) / 10,
    attendance: Math.round((85 + rand() * 15) * 10) / 10,
    phone: `+1 (555) ${String(100 + Math.floor(rand() * 900))}-${String(1000 + Math.floor(rand() * 9000))}`,
    hireDate: genDate(Math.floor(rand() * 1000) + 100),
  }));
}

export function generateCustomers(count = 150, menuItems: MenuItem[]): Customer[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `cust-${i + 1}`,
    name: genName(),
    email: `customer${i + 1}@email.com`,
    phone: `+1 (555) ${String(100 + Math.floor(rand() * 900))}-${String(1000 + Math.floor(rand() * 9000))}`,
    avatar: AVATARS[i % AVATARS.length],
    loyaltyPoints: Math.floor(rand() * 5000),
    totalSpent: Math.round(rand() * 5000 * 100) / 100,
    visitCount: Math.floor(rand() * 50) + 1,
    favoriteDishes: pickN(menuItems, 3).map((m) => m.name),
    lastVisit: genDate(Math.floor(rand() * 30)),
    joinedAt: genDate(Math.floor(rand() * 365) + 30),
    rating: Math.round((3 + rand() * 2) * 10) / 10,
  }));
}

export function generateInventory(count = 40): InventoryItem[] {
  const categories = ["Produce", "Meat", "Seafood", "Dairy", "Dry Goods", "Beverages", "Spices"];
  const names = ["Tomatoes", "Olive Oil", "Salmon Fillet", "Ribeye", "Mozzarella", "Flour", "Basil", "Butter", "Wine", "Lemons", "Garlic", "Cream", "Pasta", "Rice", "Chicken Breast"];

  return Array.from({ length: count }, (_, i) => {
    const min = Math.floor(rand() * 20) + 5;
    const max = min + Math.floor(rand() * 80) + 20;
    const qty = Math.floor(rand() * max);
    return {
      id: `inv-${i + 1}`,
      name: names[i % names.length] + (i >= names.length ? ` #${Math.floor(i / names.length) + 1}` : ""),
      category: pick(categories),
      quantity: qty,
      unit: pick(UNITS),
      supplier: pick(SUPPLIERS),
      minStock: min,
      maxStock: max,
      costPerUnit: Math.round(rand() * 50 * 100) / 100,
      lastRestocked: genDate(Math.floor(rand() * 14)),
    };
  });
}

export function generatePayments(orders: Order[]): Payment[] {
  return orders
    .filter((o) => o.paymentStatus === "paid")
    .slice(0, 80)
    .map((o, i) => ({
      id: `pay-${i + 1}`,
      orderId: o.id,
      customerName: o.customerName,
      amount: o.total,
      method: o.paymentMethod ?? "credit_card",
      status: o.paymentStatus,
      tip: o.tip ?? 0,
      date: o.createdAt,
    }));
}

export function generateReviews(count = 60, customers: Customer[]): Review[] {
  const comments = [
    "Absolutely incredible dining experience! The food was exceptional.",
    "Great atmosphere and friendly staff. Will definitely return.",
    "The pasta was perfectly al dente. Highly recommend!",
    "Beautiful presentation and amazing flavors throughout.",
    "A bit noisy but the food more than made up for it.",
    "Best steak I've had in years. Perfectly cooked.",
    "Lovely evening with outstanding service from our waiter.",
  ];

  return Array.from({ length: count }, (_, i) => {
    const customer = customers[i % customers.length];
    return {
      id: `rev-${i + 1}`,
      customerId: customer.id,
      customerName: customer.name,
      avatar: customer.avatar,
      rating: Math.floor(rand() * 2) + 4,
      comment: pick(comments),
      dish: rand() > 0.5 ? pick(customer.favoriteDishes) : undefined,
      photos: rand() > 0.7 ? [FOOD_IMAGES[i % FOOD_IMAGES.length]] : undefined,
      reply: rand() > 0.6 ? "Thank you for your wonderful review! We hope to see you again soon." : undefined,
      date: genDateTime(Math.floor(rand() * 60)),
    };
  });
}

export function generateNotifications(count = 30): Notification[] {
  const types = ["reservation", "cancellation", "inventory", "review", "kitchen", "employee", "payment"] as const;
  const titles = {
    reservation: "New Reservation",
    cancellation: "Reservation Cancelled",
    inventory: "Low Inventory Alert",
    review: "New Review Received",
    kitchen: "Kitchen Alert",
    employee: "Employee Check-in",
    payment: "Payment Completed",
  };

  return Array.from({ length: count }, (_, i) => {
    const type = pick([...types]);
    return {
      id: `notif-${i + 1}`,
      type,
      title: titles[type],
      message: `You have a new ${type} notification requiring your attention.`,
      read: rand() > 0.4,
      createdAt: genDateTime(Math.floor(rand() * 7)),
    };
  });
}

export function generateDeliveryOrders(orders: Order[]): DeliveryOrder[] {
  return orders
    .filter((o) => !o.tableId)
    .slice(0, 30)
    .map((o, i) => {
      const location = DELIVERY_LOCATIONS[i % DELIVERY_LOCATIONS.length];

      return {
        id: `del-${i + 1}`,
        orderId: o.id,
        customerName: o.customerName,
        address: location.address,
        latitude: location.latitude,
        longitude: location.longitude,
        driverId: rand() > 0.3 ? `emp-${Math.floor(rand() * 5) + 20}` : undefined,
        driverName: rand() > 0.3 ? genName() : undefined,
        status: pick(["pending", "picked_up", "in_transit", "delivered"] as const),
        estimatedTime: Math.floor(rand() * 40) + 15,
        vehicle: pick(["Toyota Prius", "Honda Civic", "Ford Transit", "Bike"]),
        total: o.total,
        createdAt: o.createdAt,
      };
    });
}

export function generateChatMessages(): ChatMessage[] {
  const channels = ["managers", "kitchen", "waiters", "owners", "support"] as const;
  const messages = [
    "Table 7 needs extra napkins",
    "Order #142 is ready for pickup",
    "Running low on salmon fillets",
    "VIP guest arriving at 7pm",
    "Shift change in 30 minutes",
    "New reservation for party of 8",
    "Kitchen printer needs paper",
  ];

  return Array.from({ length: 40 }, (_, i) => ({
    id: `msg-${i + 1}`,
    channel: pick([...channels]),
    sender: genName(),
    avatar: AVATARS[i % AVATARS.length],
    message: pick(messages),
    timestamp: genDateTime(Math.floor(rand() * 3)),
  }));
}

export function generateChartData(days = 7): ChartDataPoint[] {
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return dayNames.slice(0, days).map((name) => ({
    name,
    value: Math.floor(3000 + rand() * 8000),
    revenue: Math.floor(3000 + rand() * 8000),
    orders: Math.floor(40 + rand() * 80),
    reservations: Math.floor(15 + rand() * 40),
    profit: Math.floor(1500 + rand() * 4000),
  }));
}

export function generateHourlyData(): ChartDataPoint[] {
  return Array.from({ length: 12 }, (_, i) => ({
    name: `${i + 11}:00`,
    value: Math.floor(5 + rand() * 45),
    orders: Math.floor(5 + rand() * 45),
  }));
}

export function generateCategorySales(menuItems: MenuItem[]): ChartDataPoint[] {
  const map = new Map<string, number>();
  for (const cat of MENU_CATEGORIES) {
    map.set(cat, Math.floor(500 + rand() * 5000));
  }
  return Array.from(map.entries()).map(([name, value]) => ({
    name: name.replace("_", " "),
    value,
  }));
}

export function getDashboardStats(orders: Order[], reservations: Reservation[], inventory: InventoryItem[], employees: Employee[]): DashboardStats {
  const todayOrders = orders.filter((o) => o.createdAt.startsWith(new Date().toISOString().split("T")[0]));
  const todayRevenue = todayOrders.reduce((s, o) => s + o.total, 0) || 8420;
  const monthlyRevenue = orders.reduce((s, o) => s + o.total, 0);

  return {
    todayRevenue,
    monthlyRevenue: monthlyRevenue || 124500,
    orders: todayOrders.length || 47,
    reservations: reservations.filter((r) => r.status === "confirmed" || r.status === "pending").length || 23,
    inventoryAlerts: inventory.filter((i) => i.quantity <= i.minStock).length || 5,
    topSellingDish: "Truffle Mushroom Pizza",
    activeEmployees: employees.filter((e) => e.status === "active").length || 18,
    customerSatisfaction: 4.7,
    averageOrderValue: Math.round((todayRevenue / (todayOrders.length || 1)) * 100) / 100 || 68.5,
    profit: Math.round(monthlyRevenue * 0.32),
    expenses: Math.round(monthlyRevenue * 0.68),
    growth: 12.4,
  };
}

// Singleton data
const menuItems = generateMenuItems(50);
const reservations = generateReservations(300);
const orders = generateOrders(200, menuItems);
const tables = generateTables(24);
const employees = generateEmployees(25);
const customers = generateCustomers(150, menuItems);
const inventory = generateInventory(40);
const payments = generatePayments(orders);
const reviews = generateReviews(60, customers);
const notifications = generateNotifications(30);
const deliveryOrders = generateDeliveryOrders(orders);
const chatMessages = generateChatMessages();
const weeklyChartData = generateChartData(7);
const hourlyData = generateHourlyData();
const categorySales = generateCategorySales(menuItems);
const dashboardStats = getDashboardStats(orders, reservations, inventory, employees);

export const mockData = {
  menuItems,
  reservations,
  orders,
  tables,
  employees,
  customers,
  inventory,
  payments,
  reviews,
  notifications,
  deliveryOrders,
  chatMessages,
  weeklyChartData,
  hourlyData,
  categorySales,
  dashboardStats,
};

export default mockData;
