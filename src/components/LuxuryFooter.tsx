import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Youtube } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const LuxuryFooter = () => {
  return (
    <footer className="bg-foreground text-background">
      {/* Newsletter Section */}
      <div className="border-b border-background/10">
        <div className="container mx-auto px-4 py-16 text-center">
          <h3 className="text-2xl md:text-3xl font-light uppercase tracking-[0.2em] mb-4">
            Join the List
          </h3>
          <p className="text-background/60 text-sm mb-8 max-w-md mx-auto">
            Subscribe to receive exclusive access to new arrivals, private sales, and more.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-transparent border-background/30 text-background placeholder:text-background/40 focus:border-background"
            />
            <Button
              variant="outline"
              className="border-background/50 bg-transparent text-background hover:bg-background hover:text-foreground tracking-widest uppercase text-xs"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] mb-6">Shop</h4>
            <ul className="space-y-3">
              {["New Arrivals", "Dresses", "Tops", "Bottoms", "Accessories"].map((item) => (
                <li key={item}>
                  <Link
                    to="/collections"
                    className="text-sm text-background/60 hover:text-background transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] mb-6">About</h4>
            <ul className="space-y-3">
              {["Our Story", "Sustainability", "Careers", "Press"].map((item) => (
                <li key={item}>
                  <Link
                    to="/"
                    className="text-sm text-background/60 hover:text-background transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] mb-6">Help</h4>
            <ul className="space-y-3">
              {["Contact Us", "Shipping", "Returns", "Size Guide", "FAQs"].map((item) => (
                <li key={item}>
                  <Link
                    to="/"
                    className="text-sm text-background/60 hover:text-background transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] mb-6">Connect</h4>
            <div className="flex gap-4 mb-6">
              <a href="#" className="text-background/60 hover:text-background transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/60 hover:text-background transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/60 hover:text-background transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/60 hover:text-background transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
            <p className="text-sm text-background/60">
              Customer Service<br />
              <a href="tel:+911234567890" className="hover:text-background transition-colors">
                +91 12345 67890
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <Link to="/" className="text-xl font-light tracking-[0.3em] uppercase">
            OGURA
          </Link>
          <p className="text-xs text-background/40">
            © 2024 OGURA. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/" className="text-xs text-background/60 hover:text-background transition-colors">
              Privacy Policy
            </Link>
            <Link to="/" className="text-xs text-background/60 hover:text-background transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
