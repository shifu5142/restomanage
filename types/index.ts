export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "seated"
  | "completed"
  | "cancelled";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "delivered"
  | "completed"
  | "cancelled";

export type TableStatus =
  | "available"
  | "occupied"
  | "reserved"
  | "cleaning"
  | "vip";

export type KitchenStatus = "waiting" | "preparing" | "ready" | "completed";

export type PaymentMethod =
  | "cash"
  | "credit_card"
  | "apple_pay"
  | "google_pay"
  | "gift_card";

export type PaymentStatus = "pending" | "paid" | "refunded" | "failed";

export type EmployeeRole =
  | "owner"
  | "manager"
  | "chef"
  | "sous_chef"
  | "waiter"
  | "cashier"
  | "delivery_driver"
  | "cleaner";

export type MenuCategory =
  | "pizza"
  | "burger"
  | "pasta"
  | "steak"
  | "seafood"
  | "sushi"
  | "salads"
  | "desserts"
  | "drinks"
  | "breakfast"
  | "kids_menu";

export type NotificationType =
  | "reservation"
  | "cancellation"
  | "inventory"
  | "review"
  | "kitchen"
  | "employee"
  | "payment";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  image: string;
  prepTime: number;
  available: boolean;
  popular?: boolean;
  spicy?: boolean;
  vegan?: boolean;
  vegetarian?: boolean;
  kosher?: boolean;
  glutenFree?: boolean;
  allergens: string[];
}

export interface Reservation {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  partySize: number;
  date: string;
  time: string;
  status: ReservationStatus;
  tableId?: string;
  notes?: string;
  specialRequests?: string;
  createdAt: string;
  /** Table hold deposit + per-guest fee total */
  total?: number;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

export interface Order {
  id: string;
  customerName: string;
  tableId?: string;
  items: OrderItem[];
  status: OrderStatus;
  waiterId?: string;
  waiterName?: string;
  kitchenStatus: KitchenStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  total: number;
  tip?: number;
  prepTime: number;
  createdAt: string;
  timeline: { status: string; time: string; note?: string }[];
}

export interface RestaurantTable {
  id: string;
  number: number;
  capacity: number;
  status: TableStatus;
  section: string;
  x: number;
  y: number;
  reservationId?: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: EmployeeRole;
  avatar: string;
  shift: string;
  salary: number;
  status: "active" | "on_break" | "off_duty";
  performance: number;
  attendance: number;
  phone: string;
  hireDate: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  loyaltyPoints: number;
  totalSpent: number;
  visitCount: number;
  favoriteDishes: string[];
  lastVisit: string;
  joinedAt: string;
  rating?: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  supplier: string;
  minStock: number;
  maxStock: number;
  costPerUnit: number;
  lastRestocked: string;
}

export interface Payment {
  id: string;
  orderId: string;
  customerName: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  tip: number;
  date: string;
}

export interface Review {
  id: string;
  customerId: string;
  customerName: string;
  avatar: string;
  rating: number;
  comment: string;
  dish?: string;
  photos?: string[];
  reply?: string;
  date: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface DeliveryOrder {
  id: string;
  orderId: string;
  customerName: string;
  address: string;
  latitude: number;
  longitude: number;
  driverId?: string;
  driverName?: string;
  status: "pending" | "picked_up" | "in_transit" | "delivered";
  estimatedTime: number;
  vehicle?: string;
  total: number;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  channel: "managers" | "kitchen" | "waiters" | "owners" | "support";
  sender: string;
  avatar: string;
  message: string;
  timestamp: string;
}

export interface DashboardStats {
  todayRevenue: number;
  monthlyRevenue: number;
  orders: number;
  reservations: number;
  inventoryAlerts: number;
  topSellingDish: string;
  activeEmployees: number;
  customerSatisfaction: number;
  averageOrderValue: number;
  profit: number;
  expenses: number;
  growth: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}
