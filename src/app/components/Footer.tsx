import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <Link
          to="/"
          className="flex items-center gap-2"
        >
          <span
            className="text-primary"
            style={{ fontFamily: "Anton, sans-serif", fontSize: "1.2rem" }}
          >
            SLAM
          </span>
          <span
            className="text-foreground"
            style={{ fontFamily: "Anton, sans-serif", fontSize: "1.2rem" }}
          >
            NET
          </span>
        </Link>

        <p
          className="text-muted-foreground"
          style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.65rem", letterSpacing: "0.1em" }}
        >
          © 2026 SLAM NET · TOUS DROITS RÉSERVÉS
        </p>

        <div className="flex gap-6">
          {[
            { label: "Confidentialité", to: "/privacy" },
            { label: "CGU", to: "/terms" },
            { label: "Contact", to: "/contact" },
          ].map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-muted-foreground hover:text-foreground transition-colors"
              style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.8rem" }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
