import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;
  
  const navLinks = [
    { path: "#about", label: "Why Us", isHash: true },
    { path: "#faq", label: "FAQ", isHash: true },
    { path: "#contact", label: "Contact", isHash: true },
  ];
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Cellula" className="h-12 w-12" />
          <span className="text-2xl font-bold text-foreground tracking-tight" style={{ fontFamily: '"Lucida Calligraphy", cursive' }}>Cellula</span>
        </Link>

        {/* Collaboration Text */}
        <div className="hidden lg:flex items-center text-xs text-muted-foreground border-l border-r border-border px-4 whitespace-nowrap">
          In collaboration with NSCRC and NRS
        </div>

        {/* Desktop Navigation - Centered */}
        <nav className="hidden md:flex items-center gap-6 flex-1 justify-center">
          {navLinks.map((link) => (
            link.isHash ? (
              <a
                key={link.path}
                href={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.hash === link.path ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(link.path) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            )
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="hidden items-center gap-3 md:flex ml-auto">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/hospital/login">Hospital Login</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/admin/login">Admin Login</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/donor/login">User Login</Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background p-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              link.isHash ? (
                <a
                  key={link.path}
                  href={link.path}
                  className="text-sm font-medium text-muted-foreground hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm font-medium text-muted-foreground hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              )
            ))}
            <hr className="my-2 border-border" />
            <Link to="/hospital/login" className="text-sm font-medium text-muted-foreground">
              Hospital Login
            </Link>
            <Link to="/admin/login" className="text-sm font-medium text-muted-foreground">
              Admin Login
            </Link>
            <Button size="sm" className="mt-2" asChild>
              <Link to="/register">Register as Donor</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;