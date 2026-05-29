import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span
            className="text-primary"
            style={{ fontFamily: "Anton, sans-serif", fontSize: "1.6rem", letterSpacing: "-0.02em" }}
          >
            SLAM
          </span>
          <span
            className="text-foreground"
            style={{ fontFamily: "Anton, sans-serif", fontSize: "1.6rem", letterSpacing: "-0.02em" }}
          >
            NET
          </span>
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse ml-1" />
        </Link>

        {/* Desktop links */}
        <div
          className="hidden md:flex items-center gap-8"
          style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.875rem", letterSpacing: "0.05em" }}
        >
          {[
            { label: "FONCTIONNALITÉS", to: "/#features" },
            { label: "COMMENT ÇA MARCHE", to: "/#how-it-works" },
            { label: "COLLECTIFS", to: "/collectifs" },
          ].map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="text-muted-foreground hover:text-foreground transition-colors"
            style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.875rem" }}
          >
            Connexion
          </Link>
          <Link
            to="/signup"
            className="bg-primary text-primary-foreground px-5 py-2 hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.875rem", fontWeight: 700, letterSpacing: "0.04em" }}
          >
            CRÉER UN COMPTE
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground p-2"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden border-t border-border bg-background px-6 pb-6 flex flex-col gap-4 pt-4"
              >
                {[
                  { label: "FONCTIONNALITÉS", to: "/#features" },
                  { label: "COMMENT ÇA MARCHE", to: "/#how-it-works" },
                  { label: "COLLECTIFS", to: "/collectifs" },
                ].map((link) => (
                  <Link key={link.label} to={link.to} className="text-muted-foreground hover:text-foreground py-1"
                    style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.875rem", letterSpacing: "0.05em" }}>
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/signup"
                  className="bg-primary text-primary-foreground px-5 py-3 text-center mt-2"
                  style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 700, letterSpacing: "0.04em" }}
                >
                  CRÉER UN COMPTE
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
    </nav>
  );
}
