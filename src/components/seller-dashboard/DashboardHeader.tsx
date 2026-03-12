import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, LogOut, LayoutDashboard, User, ShoppingCart, Package, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  icon: React.ElementType;
  iconColor: string;
}

const mockNotifications: Notification[] = [
  { id: "1", title: "New order received", description: "Order #1042 from customer", time: "2 min ago", read: false, icon: ShoppingCart, iconColor: "text-primary" },
  { id: "2", title: "Product approved", description: "Silk Saree has been approved", time: "1 hour ago", read: false, icon: CheckCircle, iconColor: "text-green-600" },
  { id: "3", title: "Product rejected", description: "Cotton Kurta needs changes", time: "3 hours ago", read: false, icon: XCircle, iconColor: "text-destructive" },
  { id: "4", title: "Low inventory warning", description: "Embroidered Lehenga — 2 left", time: "5 hours ago", read: true, icon: AlertTriangle, iconColor: "text-yellow-600" },
];

export const DashboardHeader = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "S";

  const handleLogout = async () => {
    await logout();
    navigate("/seller-login");
  };

  return (
    <header className="h-14 bg-background border-b flex items-center px-4 gap-4 shrink-0">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search products, orders, customers..." className="pl-9 h-9 bg-muted/50 border-0 text-sm" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Notification Bell */}
        {isAuthenticated ? (
          <Popover>
            <PopoverTrigger asChild>
              <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
                <Bell className="h-4 w-4 text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                    {unreadCount}
                  </span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <p className="text-sm font-semibold">Notifications</p>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs text-primary hover:underline">
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className={cn("flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors border-b last:border-0", !n.read && "bg-primary/5")}>
                    <n.icon className={cn("h-4 w-4 mt-0.5 shrink-0", n.iconColor)} />
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-sm", !n.read && "font-medium")}>{n.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{n.description}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                    </div>
                    {!n.read && <span className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />}
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          <button className="relative p-2 rounded-lg opacity-40 cursor-not-allowed" disabled>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </button>
        )}

        {/* Auth area */}
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarImage src={user?.avatarUrl} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">{initials}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => navigate("/seller/settings")} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/seller/dashboard")} className="cursor-pointer">
                <LayoutDashboard className="mr-2 h-4 w-4" /> Seller Dashboard
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate("/seller-login")}>Login</Button>
            <Button size="sm" onClick={() => navigate("/seller-signup")}>Signup</Button>
          </div>
        )}
      </div>
    </header>
  );
};
