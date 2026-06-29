import { motion } from "motion/react";
import { Sparkles, Copy, Check, Mail, KeyRound, LogIn, Zap } from "lucide-react";
import { useState } from "react";
import { useAuthModal } from "../../contexts/AuthModalContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useToast } from "../../contexts/ToastContext";

const DEMO_EMAIL = "test@gmail.com";
const DEMO_PASSWORD = "testtest";

export function DemoAccount() {
  const [copiedField, setCopiedField] = useState<"email" | "password" | null>(null);
  const { openLoginModal } = useAuthModal();
  const { t } = useLanguage();
  const { showSuccess } = useToast();

  const copyToClipboard = (value: string, field: "email" | "password") => {
    navigator.clipboard?.writeText(value).then(() => {
      setCopiedField(field);
      showSuccess(t('hero.demoCopied'));
      setTimeout(() => setCopiedField(null), 1500);
    });
  };

  return (
    <section id="demo" className="py-28 border-t border-border bg-card relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(255,77,0,0.10), transparent)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="w-8 h-px bg-primary" />
              <span
                className="text-primary uppercase tracking-[0.2em]"
                style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.7rem", fontWeight: 700 }}
              >
                {t('hero.demoBadge')}
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-foreground"
              style={{
                fontFamily: "Anton, sans-serif",
                fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                lineHeight: 0.95,
              }}
            >
              {t('hero.demoTitle')}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-muted-foreground max-w-md"
              style={{ fontFamily: "DM Sans, sans-serif", fontSize: "1rem", lineHeight: 1.75 }}
            >
              {t('hero.demoHint')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-8 flex flex-wrap gap-x-6 gap-y-2"
            >
              {["Dashboard", "Members", "Tournaments", "Rankings"].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-muted-foreground"
                  style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.7rem", letterSpacing: "0.08em" }}
                >
                  <Zap size={12} className="text-primary" />
                  {item.toUpperCase()}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: credentials card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-lg mx-auto lg:mx-0 lg:ml-auto"
          >
            <div className="relative group">
              {/* Gradient border glow */}
              <div
                className="absolute -inset-px rounded-lg opacity-60 group-hover:opacity-100 blur-sm transition-opacity duration-300"
                style={{ background: "linear-gradient(90deg, #ff4d00, #ffe033)" }}
              />
              <div className="relative border border-border/60 bg-background/90 backdrop-blur-sm rounded-lg overflow-hidden">
                {/* Pulsing accent line */}
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
                  className="h-[2px] w-full"
                  style={{ background: "linear-gradient(90deg, transparent, #ff4d00, transparent)" }}
                />

                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <Sparkles size={16} className="text-primary" />
                    <span
                      className="text-primary uppercase tracking-[0.18em]"
                      style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.65rem", fontWeight: 700 }}
                    >
                      {t('hero.demoBadge')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {/* Email */}
                    <button
                      type="button"
                      onClick={() => copyToClipboard(DEMO_EMAIL, "email")}
                      className="flex items-center gap-3 px-4 py-3 border border-border/60 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 text-left group/cell"
                    >
                      <Mail size={16} className="text-muted-foreground shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div
                          className="text-muted-foreground"
                          style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.55rem", letterSpacing: "0.12em" }}
                        >
                          {t('hero.demoEmail').toUpperCase()}
                        </div>
                        <div
                          className="text-foreground truncate"
                          style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.8rem" }}
                        >
                          {DEMO_EMAIL}
                        </div>
                      </div>
                      {copiedField === "email"
                        ? <Check size={15} className="text-primary shrink-0" />
                        : <Copy size={15} className="text-muted-foreground group-hover/cell:text-foreground shrink-0 transition-colors" />
                      }
                    </button>
                    {/* Password */}
                    <button
                      type="button"
                      onClick={() => copyToClipboard(DEMO_PASSWORD, "password")}
                      className="flex items-center gap-3 px-4 py-3 border border-border/60 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 text-left group/cell"
                    >
                      <KeyRound size={16} className="text-muted-foreground shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div
                          className="text-muted-foreground"
                          style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.55rem", letterSpacing: "0.12em" }}
                        >
                          {t('hero.demoPassword').toUpperCase()}
                        </div>
                        <div
                          className="text-foreground truncate"
                          style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.8rem" }}
                        >
                          {DEMO_PASSWORD}
                        </div>
                      </div>
                      {copiedField === "password"
                        ? <Check size={15} className="text-primary shrink-0" />
                        : <Copy size={15} className="text-muted-foreground group-hover/cell:text-foreground shrink-0 transition-colors" />
                      }
                    </button>
                  </div>

                  <button
                    onClick={openLoginModal}
                    className="group/demo w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3.5 hover:bg-primary/90 transition-all duration-200"
                    style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 700, letterSpacing: "0.06em", fontSize: "0.8rem" }}
                  >
                    {t('hero.demoCta')}
                    <LogIn size={16} className="group-hover/demo:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
