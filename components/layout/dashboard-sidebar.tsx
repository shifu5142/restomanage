"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { APP_NAME, NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { LogOut, Utensils } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useRole } from "@/hooks/use-role";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdmin, loading } = useRole();
  const { itemCount } = useCart();

  const navItems = NAV_ITEMS.filter(
    (item) => !("adminOnly" in item && item.adminOnly) || isAdmin
  );

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
      return;
    }
    router.push("/auth/login");
  };

  return (
    <Sidebar className="border-r border-white/10 bg-sidebar/80 backdrop-blur-xl">
      <SidebarHeader className="border-b border-white/10 p-4">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25">
            <Utensils className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-tight">{APP_NAME}</span>
            <span className="text-[10px] text-muted-foreground">
              {isAdmin ? "Restaurant OS" : "Dine & Order"}
            </span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {isAdmin ? "Management" : "Your Experience"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <SidebarMenuItem key={i}>
                      <Skeleton className="mx-2 h-8 rounded-md" />
                    </SidebarMenuItem>
                  ))
                : navItems.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      pathname.startsWith(`${item.href}/`);
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          className={cn(
                            "transition-all",
                            isActive &&
                              "bg-orange-500/10 text-orange-500 hover:bg-orange-500/15 hover:text-orange-500"
                          )}
                        >
                          <Link href={item.href}>
                            <item.icon className="size-4" />
                            <span>{item.title}</span>
                            {item.href === "/cart" && itemCount > 0 && (
                              <Badge className="ml-auto bg-orange-500 px-1.5 text-[10px] text-white hover:bg-orange-500">
                                {itemCount}
                              </Badge>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-white/10 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="cursor-pointer text-muted-foreground hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="size-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
