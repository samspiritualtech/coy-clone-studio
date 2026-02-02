import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingCart,
  Wallet,
  BarChart3,
  HelpCircle,
  Settings,
  Home,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { useSeller } from '@/contexts/SellerContext';
import { cn } from '@/lib/utils';

const menuItems = [
  { title: 'Dashboard', url: '/seller', icon: LayoutDashboard },
  { title: 'Products', url: '/seller/products', icon: Package },
  { title: 'Inventory', url: '/seller/inventory', icon: Layers },
  { title: 'Orders', url: '/seller/orders', icon: ShoppingCart },
  { title: 'Payouts', url: '/seller/payouts', icon: Wallet },
  { title: 'Analytics', url: '/seller/analytics', icon: BarChart3 },
  { title: 'Support', url: '/seller/support', icon: HelpCircle },
  { title: 'Settings', url: '/seller/settings', icon: Settings },
];

export const SellerSidebar = () => {
  const location = useLocation();
  const { seller } = useSeller();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  const isActive = (url: string) => {
    if (url === '/seller') {
      return location.pathname === '/seller';
    }
    return location.pathname.startsWith(url);
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="border-b border-border p-4">
        <Link to="/seller" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-primary-foreground font-bold text-sm">O</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-semibold text-sm truncate max-w-[140px]">
                {seller?.brand_name || 'Seller Portal'}
              </span>
              <span className="text-xs text-muted-foreground">Seller Dashboard</span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={collapsed ? item.title : undefined}
                  >
                    <Link
                      to={item.url}
                      className={cn(
                        'flex items-center gap-3 transition-colors',
                        isActive(item.url) && 'text-primary font-medium'
                      )}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        <SidebarMenuButton asChild tooltip={collapsed ? 'Back to Store' : undefined}>
          <Link to="/" className="flex items-center gap-3 text-muted-foreground hover:text-foreground">
            <Home className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span className="text-sm">Back to Store</span>}
          </Link>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
};
