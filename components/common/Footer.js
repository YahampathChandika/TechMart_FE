// components/common/Footer.js
import Link from "next/link";
import { Mail, Phone, MapPin, Github, Twitter, Facebook } from "lucide-react";
import { APP_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const Footer = ({ className = "" }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn("bg-muted/50 border-t mt-auto", className)}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">
                  T
                </span>
              </div>
              <span className="font-bold text-xl">{APP_CONFIG.name}</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Your trusted electronics store offering premium gadgets and
              technology at competitive prices. Quality products, fast delivery,
              excellent service.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/"
                className="text-muted-foreground hover:text-primary text-sm transition-colors"
              >
                Home
              </Link>
              <Link
                href="/products"
                className="text-muted-foreground hover:text-primary text-sm transition-colors"
              >
                Products
              </Link>
              <Link
                href="/search"
                className="text-muted-foreground hover:text-primary text-sm transition-colors"
              >
                Search
              </Link>
              <Link
                href="/about"
                className="text-muted-foreground hover:text-primary text-sm transition-colors"
              >
                About Us
              </Link>
            </nav>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-semibold">Customer Service</h3>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/contact"
                className="text-muted-foreground hover:text-primary text-sm transition-colors"
              >
                Contact Us
              </Link>
              <Link
                href="/support"
                className="text-muted-foreground hover:text-primary text-sm transition-colors"
              >
                Support
              </Link>
              <Link
                href="/faq"
                className="text-muted-foreground hover:text-primary text-sm transition-colors"
              >
                FAQ
              </Link>
              <Link
                href="/returns"
                className="text-muted-foreground hover:text-primary text-sm transition-colors"
              >
                Returns & Exchanges
              </Link>
              <Link
                href="/shipping"
                className="text-muted-foreground hover:text-primary text-sm transition-colors"
              >
                Shipping Info
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">
                  123 Tech Street, Digital City, TC 12345
                </span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <a
                  href="tel:+1-555-TECH-123"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  +1 (555) TECH-123
                </a>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <a
                  href="mailto:support@techmart.com"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  support@techmart.com
                </a>
              </div>
            </div>

            {/* Business Hours */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Business Hours</h4>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Monday - Friday: 9:00 AM - 8:00 PM</p>
                <p>Saturday: 10:00 AM - 6:00 PM</p>
                <p>Sunday: 12:00 PM - 5:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              © {currentYear} {APP_CONFIG.name}. All rights reserved.
            </div>

            <div className="flex flex-wrap justify-center md:justify-end gap-6 text-sm">
              <Link
                href="/privacy"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
