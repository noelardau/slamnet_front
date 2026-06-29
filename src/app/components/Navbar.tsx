import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { useCollectifStore } from "../../stores/collectifStore";
import { useAuthModal } from "../../contexts/AuthModalContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { Menu, X, LogOut, Loader2, User, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { ThemeToggle } from "../../components/ThemeToggle";
import { LanguageSelector } from "../../components/LanguageSelector";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isTournoiMode, setIsTournoiMode] = useState(false);
  const { openLoginModal, openSignupModal } = useAuthModal();
  const { t } = useLanguage();
  const { isAuthenticated, logout, isAdmin } = useAuth();
  const { profile } = useCollectifStore();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const location = useLocation();

  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    
    // Si on n'est pas sur la page d'accueil, naviguer d'abord
    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`);
      setOpen(false);
      return;
    }
    
    // Si on est déjà sur la page d'accueil, scroller directement
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 0);
  };

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      showSuccess('Déconnexion réussie');
      setIsLoggingOut(false);
      setShowLogoutDialog(false);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      showError('Erreur lors de la déconnexion');
      setIsLoggingOut(false);
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutDialog(false);
  };

  useEffect(() => {
    const isTournoiGestionPage = location.pathname.startsWith('/tournoi-gestion/');
    setIsTournoiMode(isTournoiGestionPage);
  }, [location.pathname]);

  return (
    <>
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
          className="hidden md:flex items-center gap-8 flex-1 justify-center"
          style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.875rem", letterSpacing: "0.05em" }}
        >
           {isAuthenticated ? (
             <>
               {(isAdmin
                 ? [
                     { label: t('admin.nav.stats'), to: "/admin" },
                     { label: t('admin.nav.collectifs'), to: "/admin/collectifs" },
                   ]
                 : [
                     { label: t('nav.dashboard'), to: "/dashboard" },
                     { label: t('nav.members'), to: "/membres" },
                     { label: t('nav.tournaments'), to: "/tournois" },
                   ]
               ).map((link) => {
                 const isActive = link.to === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(link.to);
                 return (
                   <Link
                     key={link.label}
                     to={link.to}
                     className={`relative text-muted-foreground hover:text-foreground transition-colors duration-200 ${
                       isActive ? 'text-foreground' : ''
                     }`}
                   >
                     {link.label}
                     {isActive && (
                       <motion.div
                         className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                         layoutId="activeLink"
                         initial={false}
                         transition={{ type: "spring", stiffness: 500, damping: 30 }}
                       />
                     )}
                   </Link>
                 );
                })}
               {!isAdmin && (
                 <Link
                   to="/slam-poetry"
                   className="text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer relative"
                 >
                   {t('nav.slamPoetry')}
                 </Link>
               )}
             </>
           ) : (
               [
                 { label: t('nav.features'), to: "features" },
                 { label: t('nav.howItWorks'), to: "how-it-works" },
                 { label: t('nav.plans'), to: "plans" },
                 { label: t('nav.slamPoetry'), to: "/slam-poetry" },
                
               ].map((link) => {
                if (link.to.startsWith('/')) {
                  return (
                    <Link
                      key={link.label}
                      to={link.to}
                      className="text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer"
                    >
                      {link.label}
                    </Link>
                  );
                }
                return (
                  <a
                    key={link.label}
                    href={`/#${link.to}`}
                    onClick={(e) => {
                      if (location.pathname !== '/') {
                        e.preventDefault();
                        navigate(`/#${link.to}`);
                        return;
                      }
                      handleScrollToSection(e, link.to);
                    }}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer"
                  >
                    {link.label}
                  </a>
                );
              })
          )}
        </div>

           {/* CTA */}
           <div className="hidden md:flex items-center gap-3 ml-auto">
             <LanguageSelector />
             <ThemeToggle />
             {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 px-3 py-2 border border-border hover:border-primary/60 transition-all duration-300"
                >
                  <User size={16} />
                  <span className="text-sm">
                    {profile?.nomCollectif?.substring(0, 12) || 'Profil'}
                    {profile?.nomCollectif && profile.nomCollectif.length > 12 ? '...' : ''}
                  </span>
                  <ChevronDown size={14} className={`transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-card border border-border shadow-xl z-50"
                    >
                      <div className="py-2">
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <User size={16} />
                          <span className="text-sm">{t('nav.myProfile')}</span>
                        </Link>
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            handleLogoutClick();
                          }}
                          disabled={isLoggingOut}
                          className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left"
                        >
                          <LogOut size={16} />
                          <span className="text-sm">{isLoggingOut ? t('nav.loggingOut') : t('nav.logout')}</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                 {/* <button
                   onClick={() => {
                     openLoginModal();
                     setOpen(false);
                   }}
                   className="text-muted-foreground hover:text-foreground transition-colors px-3 py-2 text-center"
                   style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.875rem" }}
                 >
                   <span className="hidden md:inline">{t('nav.login')}</span>
                   <span className="md:hidden">{t('nav.login')}</span>
                 </button> */}
                 <button
                   onClick={() => {
                    openLoginModal();
                     setOpen(false);
                    //  openSignupModal();
                    //  setOpen(false);
                   }}
                   className="bg-primary text-primary-foreground px-5 py-2 hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95 text-center"
                   style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.875rem", fontWeight: 700, letterSpacing: "0.04em" }}
                 >
                   <span className="hidden md:inline">{t('nav.login')}</span>
                   <span className="md:hidden">{t('nav.login')}</span>
                 </button>
              </>
            )}
          </div>

            {/* Mobile toggle */}
            {!isTournoiMode && (
              <div className="flex items-center gap-1">
                <div className="md:hidden">
                  <LanguageSelector />
                </div>
                <button
                  className="md:hidden text-foreground p-2"
                  onClick={() => setOpen(!open)}
                  aria-label="Menu"
                >
                  {open ? <X size={22} /> : <Menu size={22} />}
                </button>
              </div>
            )}
            {/* Placeholder pour maintenir l'espacement quand le bouton est masqué */}
            {isTournoiMode && <div className="md:hidden w-10" />}
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
                {isAuthenticated ? (
                  <>
                      {(isAdmin
                        ? [
                            { label: t('admin.nav.stats'), to: "/admin" },
                            { label: t('admin.nav.collectifs'), to: "/admin/collectifs" },
                          ]
                        : [
                            { label: t('nav.dashboard'), to: "/dashboard" },
                            { label: t('nav.members'), to: "/membres" },
                            { label: t('nav.tournaments'), to: "/tournois" },
                            { label: t('nav.slamPoetry'), to: "/slam-poetry" },
                          ]
                      ).map((link) => {
                      const isActive = link.to === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(link.to);
                      return (
                        <Link 
                          key={link.label} 
                          to={link.to} 
                          className={`relative py-1 ${
                            isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                          }`}
                          style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.875rem", letterSpacing: "0.05em" }}
                          onClick={() => setOpen(false)}
                        >
                          {link.label}
                          {isActive && (
                            <motion.div
                              className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                              layoutId="activeLinkMobile"
                              initial={false}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                          )}
                        </Link>
                      );
                    })}
                    <div className="pt-4 border-t border-border">
                       <div className="flex items-center justify-between mb-4 py-1">
                         <div className="flex items-center gap-3 text-muted-foreground"
                           style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.875rem", letterSpacing: "0.05em" }}>
                           <User size={16} />
                           <span>{profile?.nomCollectif}</span>
                         </div>
                         <ThemeToggle />
                       </div>
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors"
                          onClick={() => setOpen(false)}
                        >
                          <User size={16} />
                          <span className="text-sm">{t('nav.myProfile')}</span>
                        </Link>
                         <button
                          onClick={() => {
                            setOpen(false);
                            handleLogoutClick();
                          }}
                          disabled={isLoggingOut}
                          className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left"
                          style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.875rem", letterSpacing: "0.05em" }}
                        >
                          {isLoggingOut ? (
                            <Loader2 className="animate-spin" size={16} />
                          ) : (
                            <LogOut size={16} />
                          )}
                          <span>{isLoggingOut ? t('nav.loggingOut') : t('nav.logout')}</span>
                        </button>
                   </div>
                 </>
                 ) : (
                    <>
                        {[
                           { label: t('nav.features'), to: "features" },
                           { label: t('nav.howItWorks'), to: "how-it-works" },
                           { label: t('nav.plans'), to: "plans" },
                           { label: t('nav.slamPoetry'), to: "/slam-poetry" },
                         ].map((link) => (
                        link.to.startsWith('/') ? (
                          <Link 
                            key={link.label} 
                            to={link.to} 
                            className="text-muted-foreground hover:text-foreground py-1"
                            style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.875rem", letterSpacing: "0.05em" }}
                            onClick={() => setOpen(false)}
                          >
                            {link.label}
                          </Link>
                        ) : (
                         <a 
                           key={link.label} 
                           href={`/#${link.to}`}
                           onClick={(e) => {
                             if (location.pathname !== '/') {
                               e.preventDefault();
                               navigate(`/#${link.to}`);
                             } else {
                               handleScrollToSection(e, link.to);
                             }
                             setOpen(false);
                           }}
                           className="text-muted-foreground hover:text-foreground py-1 cursor-pointer"
                           style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.875rem", letterSpacing: "0.05em" }}
                         >
                           {link.label}
                         </a>
                        )))}
                      <button
                        onClick={() => {
                          openLoginModal();
                          setOpen(false);
                        }}
                        className="text-muted-foreground hover:text-foreground py-1 text-center mt-2"
                        style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.875rem" }}
                      >
                        {t('nav.login')}
                      </button>
                      <button
                        onClick={() => {
                          openSignupModal();
                          setOpen(false);
                        }}
                        className="bg-primary text-primary-foreground px-5 py-3 text-center mt-2"
                        style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 700, letterSpacing: "0.04em" }}
                      >
                        {t('nav.signup')}
                      </button>
                   </>
                )}
             </motion.div>
           )}
         </AnimatePresence>
      </nav>
    
      <ConfirmDialog
        isOpen={showLogoutDialog}
        title="Déconnexion"
        message="Êtes-vous sûr de vouloir vous déconnecter ?"
        confirmText="Se déconnecter"
        cancelText="Annuler"
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
        loading={isLoggingOut}
      />
    </>
  );
}