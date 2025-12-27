import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Cellula" className="h-14 w-14" />
              <span className="text-xl font-bold">Cellula</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Nepal's national stem cell donor platform, connecting donors with patients in need through cutting-edge matching technology.
            </p>
            <div className="flex items-center gap-3">
              <div className="flex h-8 items-center rounded bg-muted px-2 text-xs font-medium text-muted-foreground">
                Nepal Stem Cell Research
              </div>
              <div className="flex h-8 items-center rounded bg-primary/10 px-2 text-xs font-medium text-primary">
                Red Cross
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
                Home
              </Link>
              <Link to="/register" className="text-sm text-muted-foreground hover:text-primary">
                Become a Donor
              </Link>
              <Link to="/hospital/login" className="text-sm text-muted-foreground hover:text-primary">
                Hospital Portal
              </Link>
              <Link to="/admin/login" className="text-sm text-muted-foreground hover:text-primary">
                Admin Portal
              </Link>
            </nav>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="font-semibold">Resources</h4>
            <nav className="flex flex-col gap-2">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                FAQs
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                Donation Process
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                Terms of Service
              </a>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold">Contact Us</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Kathmandu, Nepal</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+977 1-4XXXXXX</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>info@cellula.org.np</span>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-8 border-border" />

        <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
          <p>© 2024 Cellula. All rights reserved.</p>
          <p>A initiative of Nepal Stem Cell Research Centre & Nepal Red Cross Society</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;