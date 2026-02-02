import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { LuxuryFooter } from "@/components/LuxuryFooter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Heart, 
  ShoppingBag, 
  MapPin, 
  Package, 
  User, 
  Settings,
  LogOut,
  ChevronRight,
  Sparkles
} from "lucide-react";

const Dashboard = () => {
  const { user, logout } = useAuth();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const quickLinks = [
    {
      title: "My Orders",
      description: "Track your orders and view order history",
      icon: Package,
      href: "/orders",
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      title: "Wishlist",
      description: "Items you've saved for later",
      icon: Heart,
      href: "/wishlist",
      color: "bg-rose-500/10 text-rose-600",
    },
    {
      title: "Shopping Cart",
      description: "Items ready for checkout",
      icon: ShoppingBag,
      href: "/cart",
      color: "bg-emerald-500/10 text-emerald-600",
    },
    {
      title: "Saved Addresses",
      description: "Manage your delivery addresses",
      icon: MapPin,
      href: "/profile#addresses",
      color: "bg-amber-500/10 text-amber-600",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.avatarUrl} alt={user?.name || "User"} />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-medium text-foreground">
                Welcome back, {user?.name?.split(" ")[0] || "there"}!
              </h1>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Featured Banner */}
        <Card className="mb-8 overflow-hidden border-primary/20 bg-gradient-to-r from-primary/5 via-primary/10 to-accent/5">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Explore New Arrivals</h3>
                <p className="text-sm text-muted-foreground">
                  Discover the latest collections from top designers
                </p>
              </div>
            </div>
            <Button asChild variant="default" size="sm">
              <Link to="/collections">
                Shop Now
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickLinks.map((link) => (
            <Card key={link.title} className="hover:shadow-md transition-shadow">
              <Link to={link.href}>
                <CardHeader className="pb-2">
                  <div className={`w-10 h-10 rounded-lg ${link.color} flex items-center justify-center mb-2`}>
                    <link.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">{link.title}</CardTitle>
                  <CardDescription className="text-sm">{link.description}</CardDescription>
                </CardHeader>
              </Link>
            </Card>
          ))}
        </div>

        {/* Account Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Full Name</label>
                  <p className="font-medium">{user?.name || "Not set"}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Email</label>
                  <p className="font-medium">{user?.email || "Not set"}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Phone</label>
                  <p className="font-medium">{user?.phone || "Not set"}</p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <Button asChild variant="outline" size="sm">
                  <Link to="/profile" className="gap-2">
                    <Settings className="h-4 w-4" />
                    Edit Profile
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Account Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild variant="outline" className="w-full justify-start gap-2">
                <Link to="/profile">
                  <User className="h-4 w-4" />
                  Profile Settings
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                onClick={logout}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <LuxuryFooter />
    </div>
  );
};

export default Dashboard;
