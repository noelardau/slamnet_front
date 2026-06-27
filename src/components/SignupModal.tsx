import { useState } from 'react';
import { authService } from '../services/authService';
import { useToast } from '../contexts/ToastContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Eye, EyeOff, AlertCircle, Loader2, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../app/components/ui/dialog';

interface SignupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToLogin: () => void;
}

export function SignupModal({ open, onOpenChange, onSwitchToLogin }: SignupModalProps) {
  const [formData, setFormData] = useState({
    nomCollectif: '',
    ville: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { showError } = useToast();
  const { t } = useLanguage();

  const validateForm = () => {
    if (!formData.nomCollectif || !formData.ville || !formData.email || !formData.password || !formData.confirmPassword) {
      setError(t('auth.allFieldsRequired'));
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError(t('auth.invalidEmail'));
      return false;
    }

    if (formData.password.length < 6) {
      setError(t('auth.passwordMinLength'));
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.passwordMismatch'));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      await authService.register({
        nomCollectif: formData.nomCollectif,
        ville: formData.ville,
        email: formData.email,
        password: formData.password,
      });
      setSubmitted(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('auth.signupError');
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (submitted) {
          setSubmitted(false);
          setError('');
          setFormData({ nomCollectif: '', ville: '', email: '', password: '', confirmPassword: '' });
        }
        onOpenChange(v);
      }}
    >
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto p-6">
        {submitted ? (
          <div className="py-6 text-center">
            <div className="mx-auto mb-5 w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
              <Clock className="text-primary" size={28} />
            </div>
            <DialogTitle
              className="mb-3"
              style={{ fontFamily: 'Anton, sans-serif', fontSize: '1.5rem', lineHeight: 1.1 }}
            >
              {t('auth.pendingTitle')}
            </DialogTitle>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t('auth.pendingMessage')}
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setError('');
                setFormData({ nomCollectif: '', ville: '', email: '', password: '', confirmPassword: '' });
                onOpenChange(false);
                onSwitchToLogin();
              }}
              className="mt-6 w-full bg-primary text-primary-foreground px-6 py-3 hover:bg-primary/90 transition-all duration-200 font-bold uppercase tracking-wider text-sm"
              style={{ letterSpacing: '0.06em' }}
            >
              {t('auth.pendingLoginButton')}
            </button>
          </div>
        ) : (
          <>
            <DialogHeader className="mb-4">
              <DialogTitle
                className="text-center"
                style={{
                  fontFamily: "Anton, sans-serif",
                  fontSize: "1.75rem",
                  lineHeight: 1,
                }}
              >
                {t('auth.signup')}
              </DialogTitle>
            </DialogHeader>

            {error && (
              <div className="mb-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2">
                <AlertCircle className="text-red-500 flex-shrink-0" size={18} />
                <span className="text-red-foreground text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1.5">{t('auth.collectiveName')}</label>
                  <input
                    type="text"
                    name="nomCollectif"
                    value={formData.nomCollectif}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={t('auth.collectiveNamePlaceholder')}
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5">{t('auth.city')}</label>
                  <input
                    type="text"
                    name="ville"
                    value={formData.ville}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={t('auth.cityPlaceholder')}
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5">{t('auth.email')}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t('auth.emailPlaceholder')}
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1.5">{t('auth.password')}</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                      placeholder={t('auth.passwordPlaceholder')}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5">{t('auth.confirmPassword')}</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                      placeholder={t('auth.passwordPlaceholder')}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      disabled={loading}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground px-6 py-3 hover:bg-primary/90 transition-all duration-200 font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                style={{ letterSpacing: "0.06em" }}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    {t('auth.creatingAccount')}
                  </>
                ) : (
                  t('auth.createAccount')
                )}
              </button>
            </form>

            <p className="text-center mt-3 text-muted-foreground text-xs">
              {t('auth.hasAccount')}{' '}
              <button
                onClick={() => {
                  onOpenChange(false);
                  onSwitchToLogin();
                }}
                className="text-primary hover:underline font-medium"
              >
                {t('auth.loginLink')}
              </button>
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}