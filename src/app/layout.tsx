import { Outlet, useLocation, Link } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthProvider } from '../contexts/AuthContext';
import { ToastProvider } from '../contexts/ToastContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { AuthModalProvider, useAuthModal } from '../contexts/AuthModalContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { LoginModal } from '../components/LoginModal';
import { SignupModal } from '../components/SignupModal';

export function Layout() {
  const location = useLocation();
  const isPublicInvitationPage =
    location.pathname.startsWith('/invitation/') ||
    location.pathname.startsWith('/tournoi-invitation/');

  return (
    <LanguageProvider>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <AuthModalProvider>
              <div
                className="min-h-screen bg-background text-foreground"
                style={{ scrollbarWidth: "none" }}
              >
                <style>{`
                  ::-webkit-scrollbar { display: none; }
                  * { font-family: 'DM Sans', sans-serif; }
                `}</style>
                {!isPublicInvitationPage && <Navbar />}
                {isPublicInvitationPage && (
                  <div className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm">
                    <div className="max-w-7xl mx-auto px-6 flex items-center h-16">
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
                    </div>
                  </div>
                )}
                <main className={isPublicInvitationPage ? 'min-h-screen pt-16' : 'min-h-[calc(100vh-128px)]'}>
                  <Outlet />
                </main>
                {!isPublicInvitationPage && <Footer />}
                <GlobalAuthModals />
              </div>
            </AuthModalProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

function GlobalAuthModals() {
  const { showLoginModal, showSignupModal, closeModals, openLoginModal, openSignupModal } = useAuthModal();
  
  const handleSwitchToSignup = () => {
    closeModals();
    setTimeout(openSignupModal, 100);
  };
  
  const handleSwitchToLogin = () => {
    closeModals();
    setTimeout(openLoginModal, 100);
  };

  return (
    <>
      <LoginModal 
        open={showLoginModal} 
        onOpenChange={closeModals}
        onSwitchToSignup={handleSwitchToSignup}
      />
      <SignupModal 
        open={showSignupModal} 
        onOpenChange={closeModals}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </>
  );
}