import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-32 border-t border-border relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255,77,0,0.08), transparent)",
        }}
      />

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="w-8 h-px bg-primary" />
            <span
              className="text-primary"
              style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.7rem", letterSpacing: "0.2em" }}
            >
              GRATUIT POUR COMMENCER
            </span>
            <span className="w-8 h-px bg-primary" />
          </div>

          <h2
            style={{
              fontFamily: "Anton, sans-serif",
              fontSize: "clamp(3rem, 7vw, 6rem)",
              lineHeight: 0.92,
              color: "#f2ede6",
            }}
          >
            VOTRE COLLECTIF
            <br />
            MÉRITE UNE
            <br />
            <span style={{ color: "#ff4d00" }}>VRAIE SCÈNE.</span>
          </h2>

          <p
            className="mt-8 text-muted-foreground mx-auto"
            style={{ fontFamily: "DM Sans, sans-serif", fontSize: "1rem", lineHeight: 1.75, maxWidth: 480 }}
          >
            Rejoignez les collectifs de slam qui organisent leurs événements avec Slam Net. Inscription gratuite,
            aucune carte requise.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link
              to="/signup"
              className="group flex items-center gap-3 bg-primary text-primary-foreground px-10 py-5 hover:bg-primary/90 transition-all duration-200 hover:gap-5"
              style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 700, letterSpacing: "0.06em", fontSize: "0.875rem" }}
            >
              CRÉER MON COMPTE GRATUIT
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <p
            className="mt-6 text-muted-foreground/60"
            style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.65rem", letterSpacing: "0.1em" }}
          >
            Aucune carte bancaire · Données hébergées en France
          </p>
        </motion.div>
      </div>
    </section>
  );
}
