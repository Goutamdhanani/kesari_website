import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Unlock,
  X,
} from 'lucide-react';
import { StudioManagerView } from './components/StudioManagerView';
import { StudioArtist } from './components/ArtistsPage';
import {
  CreateEventInput,
  INITIAL_EVENTS,
  StudioBooking,
  StudioEvent,
  StudioMetrics,
  TicketPass,
  computeStudioMetrics,
  createStudioEvent,
  incrementEventCheckInOrSold,
  toggleEventLiveStatus,
} from './utils/studioLogic';

const AUTH_STORAGE_KEY = 'kesari_admin_token';
const EVENTS_STORAGE_KEY = 'district_studio_events_v1';

export const AdminApp: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingSession, setIsCheckingSession] = useState<boolean>(true);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [lockoutSeconds, setLockoutSeconds] = useState<number>(0);

  // Studio Operations Data
  const [events, setEvents] = useState<StudioEvent[]>(() => {
    try {
      const stored = window.localStorage.getItem(EVENTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_EVENTS;
  });

  const [passes, setPasses] = useState<TicketPass[]>([]);
  const [bookings, setBookings] = useState<StudioBooking[]>([]);
  const [artists, setArtists] = useState<Array<StudioArtist & { status?: string; phone?: string; email?: string }>>([]);

  // Compute live metrics
  const metrics: StudioMetrics = computeStudioMetrics(events, passes);

  // Check saved session on mount
  useEffect(() => {
    const savedToken = window.sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (!savedToken) {
      setIsCheckingSession(false);
      return;
    }

    // Verify token with backend
    fetch('/api/admin/data', {
      headers: { Authorization: `Bearer ${savedToken}` },
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Token expired or invalid');
      })
      .then((data) => {
        if (data && data.events && Array.isArray(data.events)) {
          setEvents(data.events);
        }
        if (data && data.orders && Array.isArray(data.orders)) {
          // Map backend orders to passes for admin review
          const mappedPasses: TicketPass[] = data.orders.map((o: any) => ({
            id: o.id,
            eventId: o.eventId,
            eventTitle: o.eventTitle,
            tier: o.tier,
            quantity: o.quantity,
            totalPaid: o.totalAmount,
            passCode: o.orderCode || `KSR-${o.id.slice(-4).toUpperCase()}`,
            issuedAt: o.createdAt || new Date().toISOString(),
            checkedIn: o.status === 'confirmed',
            status: o.status === 'confirmed' ? 'confirmed' : 'pending_review',
            utr: o.utr,
          }));
          setPasses(mappedPasses);
        }
        if (data && data.bookings && Array.isArray(data.bookings)) {
          setBookings(data.bookings);
        }
        if (data && data.artists && Array.isArray(data.artists)) {
          setArtists(data.artists);
        }
        setIsAuthenticated(true);
      })
      .catch(() => {
        window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
        setIsAuthenticated(false);
      })
      .finally(() => {
        setIsCheckingSession(false);
      });
  }, []);

  // Rate-limiting lockout countdown timer
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const timer = setInterval(() => {
      setLockoutSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  // Handle master password verification
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSeconds > 0) return;

    const trimmed = passwordInput.trim();
    if (!trimmed) {
      setLoginError('Please enter the studio master password.');
      return;
    }

    setIsSubmitting(true);
    setLoginError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: trimmed }),
      });

      const data = await res.json();

      if (res.ok && data.ok && data.token) {
        window.sessionStorage.setItem(AUTH_STORAGE_KEY, data.token);
        setIsAuthenticated(true);
        setPasswordInput('');
        setFailedAttempts(0);
        setLoginError(null);

        // Fetch fresh admin dataset
        try {
          const dataRes = await fetch('/api/admin/data', {
            headers: { Authorization: `Bearer ${data.token}` },
          });
          const adminData = await dataRes.json();
          if (adminData && adminData.events) setEvents(adminData.events);
          if (adminData && adminData.artists) setArtists(adminData.artists);
          if (adminData && adminData.bookings) setBookings(adminData.bookings);
          if (adminData && adminData.orders) {
            const mappedPasses: TicketPass[] = adminData.orders.map((o: any) => ({
              id: o.id,
              eventId: o.eventId,
              eventTitle: o.eventTitle,
              tier: o.tier,
              quantity: o.quantity,
              totalPaid: o.totalAmount,
              passCode: o.orderCode || `KSR-${o.id.slice(-4).toUpperCase()}`,
              issuedAt: o.createdAt || new Date().toISOString(),
              checkedIn: o.status === 'confirmed',
              status: o.status === 'confirmed' ? 'confirmed' : 'pending_review',
              utr: o.utr,
            }));
            setPasses(mappedPasses);
          }
        } catch {}
      } else {
        const nextFailed = failedAttempts + 1;
        setFailedAttempts(nextFailed);
        if (nextFailed >= 5) {
          setLockoutSeconds(60);
          setLoginError('Too many failed attempts. Security lockout active for 60 seconds.');
        } else {
          setLoginError(`Access Denied: Incorrect password. (${5 - nextFailed} attempts remaining)`);
        }
      }
    } catch {
      setLoginError('Cannot reach studio server. Please verify the backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    const token = window.sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (token) {
      fetch('/api/admin/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
    setIsAuthenticated(false);
    setPasswordInput('');
    setLoginError(null);
  };

  const handleToggleEventLive = (eventId: string) => {
    const target = events.find((e) => e.id === eventId);
    const nextLive = target ? !target.isLive : true;
    setEvents((prev) => toggleEventLiveStatus(prev, eventId));
    const token = window.sessionStorage.getItem(AUTH_STORAGE_KEY);
    fetch(`/api/admin/events/${eventId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isLive: nextLive }),
    }).catch(() => {});
  };

  const handleDoorSale = (eventId: string) => {
    const target = events.find((e) => e.id === eventId);
    const nextSold = target ? Math.min(target.capacity, target.sold + 1) : undefined;
    setEvents((prev) => incrementEventCheckInOrSold(prev, eventId, 1));
    if (nextSold !== undefined) {
      const token = window.sessionStorage.getItem(AUTH_STORAGE_KEY);
      fetch(`/api/admin/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sold: nextSold }),
      }).catch(() => {});
    }
  };

  const handleCreateEvent = (
    input: CreateEventInput
  ): { ok: true; created: StudioEvent } | { ok: false; error: string } => {
    const res = createStudioEvent(events, input);
    if (res.ok === false) {
      return { ok: false, error: res.error };
    }
    setEvents(res.events);
    const token = window.sessionStorage.getItem(AUTH_STORAGE_KEY);
    fetch(`/api/admin/events/${res.created.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(res.created),
    }).catch(() => {});
    return { ok: true, created: res.created };
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
    const token = window.sessionStorage.getItem(AUTH_STORAGE_KEY);
    fetch(`/api/admin/events/${eventId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
  };

  const handleReviewOrder = (passId: string, status: 'confirmed' | 'rejected') => {
    setPasses((prev) =>
      prev.map((p) =>
        p.id === passId
          ? {
              ...p,
              status,
              checkedIn: status === 'confirmed' ? p.checkedIn : false,
            }
          : p
      )
    );
    const token = window.sessionStorage.getItem(AUTH_STORAGE_KEY);
    fetch(`/api/admin/orders/${passId}/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    }).catch(() => {});
  };

  // Loading state during initial session check
  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-[#050507] text-white flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-[#D8FF48] animate-spin" />
          <p className="text-xs text-white/60 font-mono tracking-wider">
            Verifying Admin Security Token...
          </p>
        </div>
      </div>
    );
  }

  // 1. HARDENED LOCK SCREEN (STRICTLY PREVENTS BYPASS)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen obsidian-dot-canvas bg-[#050507] text-[#F4F5F8] flex flex-col justify-between p-4 sm:p-8">
        {/* Top Header */}
        <div className="flex items-center justify-between max-w-md mx-auto w-full">
          <a
            href="/"
            className="flex items-center gap-2 text-xs font-semibold text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Public Studio</span>
          </a>
          <span className="text-[11px] font-mono text-white/40">RESTRICTED CONSOLE</span>
        </div>

        {/* Center Lock Box */}
        <div className="max-w-md mx-auto w-full my-auto py-8">
          <div className="relative rounded-[34px] bg-[#0A0B10] border border-white/15 p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden">
            {/* Ambient Neon Security Glow */}
            <div className="absolute top-0 right-0 w-36 h-36 rounded-full bg-[#F97316]/15 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-36 h-36 rounded-full bg-[#D8FF48]/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center">
              {/* Official Brand Logo */}
              <img
                src="/assets/kesari-logo-colour-long.png"
                alt="Kesari - The Memory Studio"
                className="h-9 w-auto object-contain mb-5 drop-shadow-[0_2px_12px_rgba(249,115,22,0.4)]"
              />

              {/* Glowing Shield Icon */}
              <div className="w-14 h-14 rounded-2xl bg-black/60 border border-white/15 flex items-center justify-center text-[#D8FF48] mb-4 shadow-[0_0_25px_rgba(216,255,72,0.2)]">
                <Lock className="w-7 h-7 stroke-[2.2]" />
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Studio Operations Portal
              </h1>
              <p className="mt-1.5 text-xs text-white/65 max-w-[280px]">
                Authorized Kesari Studio operators only. Master authentication is required to access venue controls.
              </p>

              {/* Security Form */}
              <form onSubmit={handleLogin} className="mt-6 w-full space-y-4">
                <div className="space-y-1.5 text-left">
                  <label
                    htmlFor="admin-password"
                    className="text-xs font-semibold text-white/80 flex items-center justify-between"
                  >
                    <span>Master Admin Password</span>
                    <span className="text-[10px] text-white/40 font-mono">ENCRYPTED</span>
                  </label>
                  <div className="relative">
                    <input
                      id="admin-password"
                      type={showPassword ? 'text' : 'password'}
                      autoFocus
                      disabled={lockoutSeconds > 0 || isSubmitting}
                      value={passwordInput}
                      onChange={(e) => {
                        setPasswordInput(e.target.value);
                        setLoginError(null);
                      }}
                      placeholder="Enter studio master password"
                      className="w-full h-12 pl-4 pr-11 rounded-xl bg-black/70 border border-white/20 text-white font-mono text-sm tracking-wider focus:outline-none focus:border-[#D8FF48] focus:ring-1 focus:ring-[#D8FF48]/40 disabled:opacity-40"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Error Banner */}
                {loginError && (
                  <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/35 flex items-start gap-2.5 text-xs text-rose-200 text-left">
                    <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span className="leading-snug">{loginError}</span>
                  </div>
                )}

                {/* Lockout Warning */}
                {lockoutSeconds > 0 && (
                  <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/35 flex items-center gap-2 text-xs text-amber-200">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Brute-force lockout active. Retry in {lockoutSeconds}s</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={lockoutSeconds > 0 || isSubmitting || !passwordInput.trim()}
                  className="w-full h-12 rounded-xl bg-[#D8FF48] hover:bg-[#C8EE38] text-[#07070A] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(216,255,72,0.35)] disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.99]"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying Credentials...</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-4 h-4" />
                      <span>Unlock Studio Operations</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-5 pt-4 border-t border-white/10 w-full flex items-center justify-between text-[11px] text-white/40">
                <span>Kesari Studio Node: :3050</span>
                <span>Protected by Server Auth</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[11px] text-white/40">
          Kesari - The Memory Studio · Koramangala, Bangalore · Internal Operations
        </div>
      </div>
    );
  }

  // 2. AUTHENTICATED STANDALONE OPERATIONS PORTAL
  return (
    <div className="min-h-screen obsidian-dot-canvas bg-[#050507] text-[#F4F5F8] pb-16">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#050507]/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/assets/kesari-logo-colour-long.png"
              alt="Kesari Studio"
              className="h-8 sm:h-9 w-auto object-contain"
            />
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#D8FF48]/15 text-[#D8FF48] border border-[#D8FF48]/30">
              Operations Console
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              className="h-9 px-3.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Public Studio</span>
            </a>
            <button
              type="button"
              onClick={handleLogout}
              className="h-9 px-4 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/35 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock &amp; Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Operations Body */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <StudioManagerView
          events={events}
          metrics={metrics}
          passes={passes}
          bookings={bookings}
          artists={artists}
          onToggleLive={handleToggleEventLive}
          onDoorSale={handleDoorSale}
          onCreateEvent={handleCreateEvent}
          onDeleteEvent={handleDeleteEvent}
          onReviewOrder={handleReviewOrder}
          onReviewArtist={(artistId, status) => {
            setArtists((prev) =>
              prev.map((a) => (a.id === artistId ? { ...a, status } : a))
            );
            const token = window.sessionStorage.getItem(AUTH_STORAGE_KEY);
            fetch(`/api/admin/artists/${artistId}/review`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
              body: JSON.stringify({ status }),
            }).catch(() => {});
          }}
          onDeleteArtist={(artistId) => {
            setArtists((prev) => prev.filter((a) => a.id !== artistId));
            const token = window.sessionStorage.getItem(AUTH_STORAGE_KEY);
            fetch(`/api/admin/artists/${artistId}`, {
              method: 'DELETE',
              headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
            }).catch(() => {});
          }}
        />
      </main>
    </div>
  );
};
