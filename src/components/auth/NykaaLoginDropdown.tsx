import { Heart, Package, MapPin, LogOut, ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface NykaaLoginDropdownProps {
  onLoginClick: () => void;
  onClose?: () => void;
}

export const NykaaLoginDropdown = ({ onLoginClick, onClose }: NykaaLoginDropdownProps) => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose?.();
  };

  const handleLogout = () => {
    logout();
    onClose?.();
  };

  if (isAuthenticated && user) {
    return (
      <div className="w-80 p-0">
        {/* User Profile Section */}
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-3">
            {user.avatarUrl ? (
              <img 
                src={user.avatarUrl} 
                alt={user.name}
                className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/10"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
                <span className="text-lg font-semibold text-primary">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-foreground truncate">
                {user.name}
              </span>
              <span className="text-sm text-muted-foreground truncate">
                {user.email || user.phone}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="p-3">
          <button
            onClick={() => handleNavigation('/orders')}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-foreground hover:bg-accent rounded-lg transition-colors"
          >
            <Package className="h-4 w-4 text-muted-foreground" />
            <span>Orders</span>
          </button>
          <button
            onClick={() => handleNavigation('/addresses')}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-foreground hover:bg-accent rounded-lg transition-colors"
          >
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>Saved Addresses</span>
          </button>
          <button
            onClick={() => handleNavigation('/wishlist')}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-foreground hover:bg-accent rounded-lg transition-colors"
          >
            <Heart className="h-4 w-4 text-muted-foreground" />
            <span>Wishlist</span>
          </button>
          
          <div className="my-2 border-t border-border" />
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    );
  }

  // Guest view
  return (
    <div className="w-80 p-0">
      {/* Welcome Section */}
      <div className="p-5 text-center border-b border-border">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
          <User className="h-6 w-6 text-primary" />
        </div>
        <h3 className="font-semibold text-lg text-foreground">Welcome</h3>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          Becoming an Ogura Fashion member comes with easy order tracking, rewards, offers and more.
        </p>
        <Button 
          className="mt-4 w-full gap-2"
          onClick={onLoginClick}
        >
          Login / Signup Now
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Quick Links */}
      <div className="p-3">
        <button
          onClick={() => {
            onLoginClick();
          }}
          className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
        >
          <Package className="h-4 w-4" />
          <span>Orders</span>
        </button>
        <button
          onClick={() => {
            onLoginClick();
          }}
          className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
        >
          <MapPin className="h-4 w-4" />
          <span>Saved Addresses</span>
        </button>
        <button
          onClick={() => {
            onLoginClick();
          }}
          className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
        >
          <Heart className="h-4 w-4" />
          <span>Wishlist</span>
        </button>
      </div>
    </div>
  );
};
