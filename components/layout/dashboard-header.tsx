"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, LogOut, Search } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { mockData } from "@/data/mock";
import { formatRelative } from "@/lib/format";
import { useUser } from "@/hooks/use-user";
import { useRole } from "@/hooks/use-role";
import { getProviderLabel } from "@/lib/auth/get-user-display";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

function UserAvatarMenu() {
  const router = useRouter();
  const { display, loading } = useUser();
  const { isAdmin } = useRole();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
      return;
    }
    router.push("/auth/login");
  };

  if (loading) {
    return <Skeleton className="size-8 rounded-full" />;
  }

  if (!display) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-9 gap-2 rounded-full px-2 hover:bg-muted/80"
        >
          <Avatar className="size-8 ring-2 ring-orange-500/20">
            <AvatarImage src={display.avatar} alt={display.name} />
            <AvatarFallback className="bg-orange-500/10 text-xs font-semibold text-orange-600">
              {display.initials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden max-w-[120px] truncate text-sm font-medium md:inline">
            {display.name}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-1.5">
            <p className="truncate font-semibold">{display.name}</p>
            {display.username && (
              <p className="truncate text-xs text-muted-foreground">@{display.username}</p>
            )}
            <p className="truncate text-xs text-muted-foreground">{display.email}</p>
            <Badge variant="secondary" className="mt-1 w-fit text-[10px] capitalize">
              {isAdmin ? "Admin" : "Customer"} · via {getProviderLabel(display.provider)}
            </Badge>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/support">Support</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function DashboardHeader() {
  const unreadCount = mockData.notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-white/10 bg-background/60 px-4 backdrop-blur-xl lg:px-6">
      <SidebarTrigger className="-ml-1" />
      <div className="relative hidden flex-1 md:block md:max-w-sm">
        <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search orders, reservations..."
          className="h-9 border-white/10 bg-card/50 pl-9 backdrop-blur-sm"
        />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-full">
              <Bell className="size-4" />
              {unreadCount > 0 && (
                <Badge className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-orange-500 p-0 text-[10px]">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {mockData.notifications.slice(0, 5).map((n) => (
              <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-1 py-2">
                <span className="font-medium">{n.title}</span>
                <span className="text-xs text-muted-foreground">{n.message}</span>
                <span className="text-[10px] text-muted-foreground">{formatRelative(n.createdAt)}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <UserAvatarMenu />
      </div>
    </header>
  );
}
