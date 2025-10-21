import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* About */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold mb-4">OGURA</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your destination for curated fashion from premium brands. 
              Discover personalized style with our AI-powered shopping experience.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-accent transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/collections" className="text-muted-foreground hover:text-accent transition-colors">All Products</a></li>
              <li><a href="/new" className="text-muted-foreground hover:text-accent transition-colors">New Arrivals</a></li>
              <li><a href="/brands" className="text-muted-foreground hover:text-accent transition-colors">Brands</a></li>
              <li><a href="/occasions" className="text-muted-foreground hover:text-accent transition-colors">Occasions</a></li>
              <li><a href="/gift-cards" className="text-muted-foreground hover:text-accent transition-colors">Gift Cards</a></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-semibold mb-4">Help</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/contact" className="text-muted-foreground hover:text-accent transition-colors">Contact Us</a></li>
              <li><a href="/shipping" className="text-muted-foreground hover:text-accent transition-colors">Shipping Info</a></li>
              <li><a href="/returns" className="text-muted-foreground hover:text-accent transition-colors">Returns</a></li>
              <li><a href="/size-guide" className="text-muted-foreground hover:text-accent transition-colors">Size Guide</a></li>
              <li><a href="/stores" className="text-muted-foreground hover:text-accent transition-colors">Store Locator</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/privacy" className="text-muted-foreground hover:text-accent transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="text-muted-foreground hover:text-accent transition-colors">Terms of Service</a></li>
              <li><a href="/cookies" className="text-muted-foreground hover:text-accent transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© 2024 Ogura. All rights reserved. Prices are inclusive of all taxes.</p>
        </div>
      </div>
    </footer>
  );
};
