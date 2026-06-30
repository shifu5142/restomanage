export const ADMIN_EMAIL = "tigerbomm5142@gmail.com";

export type UserRole = "admin" | "customer";

export const ADMIN_ONLY_ROUTES = [
  "/tables",
  "/inventory",
  "/employees",
  "/customers",
  "/kitchen",
  "/delivery",
  "/payments",
  "/reports",
  "/analytics",
  "/ai-tools",
] as const;

export const CUSTOMER_ROUTES = [
  "/dashboard",
  "/menu",
  "/cart",
  "/orders",
  "/reservations",
  "/reviews",
  "/settings",
  "/support",
] as const;

export function isAdminEmail(email: string | null | undefined): boolean {
  return email === ADMIN_EMAIL;
}

export function getUserRole(email: string | null | undefined): UserRole {
  return isAdminEmail(email) ? "admin" : "customer";
}

export function isAdminOnlyRoute(pathname: string): boolean {
  return ADMIN_ONLY_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}
