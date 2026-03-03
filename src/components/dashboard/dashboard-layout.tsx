"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Clock,
  LayoutDashboard,
  Settings,
  LogOut,
  Link as LinkIcon,
  Calendar,
  AlertTriangle,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { useLogout } from "@/hooks/use-auth";
import { useEffect, useSyncExternalStore } from "react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { name: "Event Types", href: "/dashboard/events", icon: Calendar },
  { name: "Availability", href: "/dashboard/availability", icon: Clock },
  { name: "Bookings", href: "/dashboard/bookings", icon: LinkIcon },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

function NavLinks({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex-1 space-y-1 p-4">
      {navigation.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link key={item.name} href={item.href} onClick={onNavigate}>
            <Button
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3",
                isActive && "bg-secondary"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="label-md">{item.name}</span>
            </Button>
          </Link>
        );
      })}
    </nav>
  );
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, initialize } = useAuthStore();
  const handleLogout = useLogout();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Get initials with fallback
  const getInitials = () => {
    if (!isClient || !user?.name) return "U";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const userMenuItems = (
    <DropdownMenuContent align="end" className="w-56">
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild>
        <Link href="/dashboard/settings">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={handleLogout}>
        <LogOut className="mr-2 h-4 w-4" />
        Log out
      </DropdownMenuItem>
    </DropdownMenuContent>
  );

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:z-50 md:flex md:w-64 md:flex-col border-r border-border bg-card">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-border px-6">
            <Image src="/logo.svg" alt="SyncBooker" width={180} height={48} className="w-full max-w-[180px] h-auto" />
          </div>

          <NavLinks pathname={pathname} />

          {/* User Menu */}
          <div className="border-t border-border p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start gap-3 px-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-left">
                    <span className="label-md">
                      {isClient && user?.name ? user.name : "User"}
                    </span>
                    <span className="body-sm text-muted-foreground truncate max-w-[140px]">
                      {isClient && user?.email ? user.email : "Loading..."}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              {userMenuItems}
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-border bg-card px-4">
        <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)}>
          <Menu className="h-5 w-5" />
        </Button>
        <Link href="/dashboard">
          <Image src="/logo.svg" alt="SyncBooker" width={140} height={36} className="h-8 w-auto" />
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          {userMenuItems}
        </DropdownMenu>
      </header>

      {/* Mobile Drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center border-b border-border px-6">
              <Image src="/logo.svg" alt="SyncBooker" width={180} height={48} className="w-full max-w-[180px] h-auto" />
            </div>
            <NavLinks pathname={pathname} onNavigate={() => setMobileOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 pt-16 md:pt-0 md:pl-64">
        {isClient && user && user.emailVerified === false && (
          <div className="flex items-center gap-3 bg-amber-50 border-b border-amber-200 px-8 py-3 text-amber-800">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <p className="body-sm">
              Please verify your email address. Check your inbox for a verification link.{" "}
              <Link href="/verify-email" className="font-medium underline underline-offset-2">
                Resend email
              </Link>
            </p>
          </div>
        )}
        <div className="mx-auto max-w-7xl p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
