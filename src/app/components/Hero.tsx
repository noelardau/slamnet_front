import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, Mic, Sparkles, Copy, Check, Mail, KeyRound, LogIn } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { useEffect, useState } from "react";
import { useAuthModal } from "../../contexts/AuthModalContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useToast } from "../../contexts/ToastContext";
import demoVideo from "../../assets/demo.mp4";
import demoMobileVideo from "../../assets/demoMobile.mp4";

const DEMO_EMAIL = "test@gmail.com";
const DEMO_PASSWORD = "testtest";

export function Hero() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [copiedField, setCopiedField] = useState<"email" | "password" | null>(null);
  const { openSignupModal, openLoginModal } = useAuthModal();
  const { t } = useLanguage();
  const { showSuccess } = useToast();

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent || window.opera;
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Blazer|Mobile/i.test(userAgent) || 
                         /Windows Phone|webOS|iPhone|iPad|iPod|Opera Mini|IEMobile|Mobile/i.test(userAgent) ||
                         (userAgent.includes('Mac') && 'ontouch' in navigator.userAgent);

      setIsMobile(isMobileDevice);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  const copyToClipboard = (value: string, field: "email" | "password") => {
    navigator.clipboard?.writeText(value).then(() => {
      setCopiedField(field);
      showSuccess(t('hero.demoCopied'));
      setTimeout(() => setCopiedField(null), 1500);
    });
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-16">
      {/* Background texture lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px bg-foreground/5"
            style={{ top: `${12 + i * 12}%`, left: 0, right: 0 }}
          />
        ))}
        {/* Vertical accent line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-primary/20" />
        {/* Orange glow blob */}
        <div
          className="absolute rounded-full blur-[120px] opacity-20"
          style={{
            width: 600,
            height: 600,
            background: "#ff4d00",
            top: "20%",
            right: "-10%",
          }}
        />
        <div
          className="absolute rounded-full blur-[80px] opacity-10"
          style={{
            width: 300,
            height: 300,
            background: "#ffe033",
            top: "60%",
            left: "5%",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-20">
        {/* Left: copy */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-8"
          >
            <span className="w-8 h-px bg-primary" />
            <span
              className="text-primary uppercase tracking-[0.2em]"
              style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.7rem" }}
            >
              {t('hero.platform')}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-foreground"
            style={{
              fontFamily: "Anton, sans-serif",
              fontSize: "clamp(3.5rem, 8vw, 7rem)",
              lineHeight: 0.92,
              letterSpacing: "-0.01em",
            }}
          >
            {t('hero.title')}
            <br />
            <span className="text-primary">{t('hero.title1')}</span>
            <br />
            {t('hero.title2')}
            <br />
            {t('hero.title3')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 text-muted-foreground max-w-lg"
            style={{ fontFamily: "DM Sans, sans-serif", fontSize: "1.05rem", lineHeight: 1.7 }}
          >
            {t('hero.description')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <button
              onClick={openSignupModal}
              className="group flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 hover:bg-primary/90 transition-all duration-200 hover:gap-4"
              style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 700, letterSpacing: "0.06em", fontSize: "0.875rem" }}
            >
              {t('hero.createCollective')}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <Dialog open={isDemoOpen} onOpenChange={setIsDemoOpen}>
              <DialogTrigger asChild>
                <button
                  className="flex items-center gap-3 border border-border text-foreground px-8 py-4 hover:border-foreground/30 transition-all duration-200"
                  style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 500, fontSize: "0.875rem" }}
                >
                  {t('hero.watchDemo')}
                </button>
              </DialogTrigger>
               <DialogContent className="max-w-4xl p-0 overflow-hidden">
                 <video
                   key={isMobile ? 'mobile' : 'desktop'}
                   controls
                   autoPlay
                   className="w-full h-auto"
                 >
                   <source src={demoVideo} media="(min-width: 768px)" />
                   <source src={demoMobileVideo} media="(max-width: 767px)" />
                 </video>
               </DialogContent>
            </Dialog>
          </motion.div>

          {/* Demo account banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="mt-8 max-w-lg"
          >
            <div className="relative group">
              {/* Gradient border glow */}
              <div
                className="absolute -inset-px rounded-lg opacity-60 group-hover:opacity-100 blur-sm transition-opacity duration-300"
                style={{ background: "linear-gradient(90deg, #ff4d00, #ffe033)" }}
              />
              <div className="relative border border-border/60 bg-card/90 backdrop-blur-sm rounded-lg overflow-hidden">
                {/* Pulsing accent line */}
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
                  className="h-[2px] w-full"
                  style={{ background: "linear-gradient(90deg, transparent, #ff4d00, transparent)" }}
                />
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={14} className="text-primary" />
                    <span
                      className="text-primary uppercase tracking-[0.18em]"
                      style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.65rem", fontWeight: 700 }}
                    >
                      {t('hero.demoBadge')}
                    </span>
                  </div>
                  <p
                    className="text-foreground mb-1"
                    style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.95rem", fontWeight: 600 }}
                  >
                    {t('hero.demoTitle')}
                  </p>
                  <p
                    className="text-muted-foreground mb-4"
                    style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.8rem" }}
                  >
                    {t('hero.demoHint')}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                    {/* Email */}
                    <button
                      type="button"
                      onClick={() => copyToClipboard(DEMO_EMAIL, "email")}
                      className="flex items-center gap-2 px-3 py-2 border border-border/60 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 text-left group/cell"
                    >
                      <Mail size={14} className="text-muted-foreground shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div
                          className="text-muted-foreground"
                          style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.55rem", letterSpacing: "0.12em" }}
                        >
                          {t('hero.demoEmail').toUpperCase()}
                        </div>
                        <div
                          className="text-foreground truncate"
                          style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.75rem" }}
                        >
                          {DEMO_EMAIL}
                        </div>
                      </div>
                      {copiedField === "email"
                        ? <Check size={14} className="text-primary shrink-0" />
                        : <Copy size={14} className="text-muted-foreground group-hover/cell:text-foreground shrink-0 transition-colors" />
                      }
                    </button>
                    {/* Password */}
                    <button
                      type="button"
                      onClick={() => copyToClipboard(DEMO_PASSWORD, "password")}
                      className="flex items-center gap-2 px-3 py-2 border border-border/60 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 text-left group/cell"
                    >
                      <KeyRound size={14} className="text-muted-foreground shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div
                          className="text-muted-foreground"
                          style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.55rem", letterSpacing: "0.12em" }}
                        >
                          {t('hero.demoPassword').toUpperCase()}
                        </div>
                        <div
                          className="text-foreground truncate"
                          style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.75rem" }}
                        >
                          {DEMO_PASSWORD}
                        </div>
                      </div>
                      {copiedField === "password"
                        ? <Check size={14} className="text-primary shrink-0" />
                        : <Copy size={14} className="text-muted-foreground group-hover/cell:text-foreground shrink-0 transition-colors" />
                      }
                    </button>
                  </div>

                  <button
                    onClick={openLoginModal}
                    className="group/demo w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 hover:bg-primary/90 transition-all duration-200"
                    style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 700, letterSpacing: "0.06em", fontSize: "0.75rem" }}
                  >
                    {t('hero.demoCta')}
                    <LogIn size={14} className="group-hover/demo:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-12 flex items-center gap-8"
          >
            {/* {[
              { value: "120+", label: "Collectifs inscrits" },
              { value: "3 400", label: "Poètes enregistrés" },
              { value: "860", label: "Tournois organisés" },
            ].map(({ value, label }) => (
              <div key={label}>
                <div
                  className="text-foreground"
                  style={{ fontFamily: "Anton, sans-serif", fontSize: "1.8rem" }}
                >
                  {value}
                </div>
                <div
                  className="text-muted-foreground"
                  style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.65rem", letterSpacing: "0.1em" }}
                >
                  {label.toUpperCase()}
                </div>
              </div>
            ))} */}
          </motion.div>
        </div>

        {/* Right: Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative flex justify-center items-center"
        >
          {/* Large mic icon */}
          <div className="relative">
            <div
              className="absolute inset-0 rounded-full blur-[60px] opacity-30"
              style={{ background: "#ff4d00", transform: "scale(1.2)" }}
            />
            <div
              className="relative border border-border/50 flex items-center justify-center bg-card"
              style={{
                width: 320,
                height: 320,
              }}
            >
              <Mic size={100} className="text-primary opacity-90" strokeWidth={1} />
              {/* Score card overlay */}
              <div
                className="absolute -bottom-6 -right-6 border border-border/60 p-4 bg-card"
                style={{
                  minWidth: 160,
                  fontFamily: "JetBrains Mono, monospace",
                }}
              >
                 <div className="text-muted-foreground mb-2" style={{ fontSize: "0.6rem", letterSpacing: "0.15em" }}>
                   {t('hero.liveRanking')}
                 </div>
                {[
                  { name: "Amina K.", score: "9.4" },
                  { name: "Dario M.", score: "9.1" },
                  { name: "Élise B.", score: "8.8" },
                ].map((poet, i) => (
                  <div key={poet.name} className="flex justify-between items-center gap-4 py-1">
                    <span
                      className="text-muted-foreground"
                      style={{ fontSize: "0.65rem" }}
                    >
                      {i + 1}. {poet.name}
                    </span>
                    <span
                      className={i === 0 ? "text-primary" : "text-foreground"}
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                      }}
                    >
                      {poet.score}
                    </span>
                  </div>
                ))}
              </div>

              {/* Badge tournoi */}
              <div
                className="absolute -top-4 -left-4 border border-primary/40 px-3 py-1 bg-primary"
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.6rem",
                  letterSpacing: "0.15em",
                  color: "#0c0a09",
                  fontWeight: 700,
                }}
               >
                 {t('hero.tournamentInProgress')}
               </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span
          className="text-muted-foreground"
          style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem", letterSpacing: "0.15em" }}
         >
           {t('hero.explore')}
         </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-primary to-transparent"
        />
      </motion.div>
    </section>
  );
}
