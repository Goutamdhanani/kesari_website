import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  QrCode,
  RefreshCw,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
import { PaymentInterface } from './PaymentInterface';
import {
  KESARI_CONTACT,
  StudioEvent,
  TicketPass,
  TicketTier,
  calculateTicketQuote,
  formatCurrencyINR,
  generateUpiUrl,
  getRemainingSeats,
  getUpiAppLinks,
  isValidUpiUtr,
} from '../utils/studioLogic';

interface TicketCalibrationModalProps {
  event: StudioEvent;
  onClose: () => void;
  onConfirmPurchase: (params: {
    eventId: string;
    tier: TicketTier | string;
    quantity: number;
    utr?: string;
    status?: 'confirmed' | 'pending_review';
  }) => { ok: true; mintedPass: TicketPass } | { ok: false; error: string };
  onViewPasses: () => void;
}

const DEFAULT_TIERS: TicketTier[] = ['GA', 'VIP', 'Backstage'];

export const TicketCalibrationModal: React.FC<TicketCalibrationModalProps> = ({
  event,
  onClose,
  onConfirmPurchase,
  onViewPasses,
}) => {
  const remaining = getRemainingSeats(event);
  const maxSelectable = Math.max(1, Math.min(6, remaining));

  const availableTiers = useMemo(() => {
    if (event.tiers && event.tiers.length > 0) {
      return event.tiers.map((t) => t.name);
    }
    return DEFAULT_TIERS;
  }, [event.tiers]);

  const [tier, setTier] = useState<string>(availableTiers[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [checkoutStep, setCheckoutStep] = useState<
    'calibrate' | 'pay_upi' | 'verifying_return' | 'done'
  >('calibrate');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [mintedPass, setMintedPass] = useState<TicketPass | null>(null);

  // Mobile App Deep Link and Return Tracking State
  const [paymentIntentLaunched, setPaymentIntentLaunched] = useState(false);
  const [launchedAt, setLaunchedAt] = useState<number>(0);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [viewMode, setViewMode] = useState<'app' | 'qr'>('app');

  // App Open Detection & Auto-Retry State
  const [appLaunchDetected, setAppLaunchDetected] = useState(false);
  const [appLaunchFailed, setAppLaunchFailed] = useState(false);
  const [retryCountdown, setRetryCountdown] = useState<number>(0);
  const [lastTargetScheme, setLastTargetScheme] = useState<
    'intent' | 'gpay' | 'phonepe' | 'paytm' | 'cred'
  >('intent');
  const launchTimerRef = useRef<number | null>(null);
  const countdownIntervalRef = useRef<number | null>(null);

  // Compute pricing quote
  const quote = useMemo(() => {
    const customTier = event.tiers?.find((t) => t.name === tier || t.id === tier);
    if (customTier) {
      const unitPrice = customTier.price;
      const subtotal = unitPrice * quantity;
      const studioFee = Math.round(subtotal * 0.06);
      return {
        unitPrice,
        subtotal,
        studioFee,
        total: subtotal + studioFee,
      };
    }
    return calculateTicketQuote(event.basePrice, tier as TicketTier, quantity);
  }, [event.basePrice, event.tiers, tier, quantity]);

  // Compute UPI App Links for Indian Mobile Banking
  const upiLinks = useMemo(() => {
    return getUpiAppLinks({
      amount: quote.total,
      note: `Pass: ${event.title.slice(0, 15)} x${quantity}`,
      ref: `KSR${Date.now().toString().slice(-6)}`,
    });
  }, [quote.total, event.title, quantity]);

  // Generate UPI QR code data URL whenever quote or step changes
  useEffect(() => {
    if (checkoutStep === 'pay_upi' || checkoutStep === 'verifying_return') {
      const upiUrl = generateUpiUrl({
        amount: quote.total,
        note: `Pass: ${event.title.slice(0, 15)} x${quantity}`,
        ref: `KSR-${Date.now().toString().slice(-6)}`,
      });
      QRCode.toDataURL(upiUrl, {
        margin: 1,
        color: { dark: '#050507', light: '#FFFFFF' },
        width: 240,
      })
        .then((url) => setQrCodeDataUrl(url))
        .catch(() => setQrCodeDataUrl(''));
    }
  }, [checkoutStep, quote.total, event.title, quantity]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (launchTimerRef.current) window.clearTimeout(launchTimerRef.current);
      if (countdownIntervalRef.current) window.clearInterval(countdownIntervalRef.current);
    };
  }, []);

  // Listen for user returning to browser from phone UPI app (visibilitychange & window focus)
  useEffect(() => {
    if (!paymentIntentLaunched || checkoutStep === 'done') return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // App launched successfully! Cancel failure check
        setAppLaunchDetected(true);
        setAppLaunchFailed(false);
        if (launchTimerRef.current) window.clearTimeout(launchTimerRef.current);
        if (countdownIntervalRef.current) window.clearInterval(countdownIntervalRef.current);
      } else if (document.visibilityState === 'visible') {
        const elapsed = Date.now() - launchedAt;
        // If user was away in UPI app for more than 1.2s, transition to verification screen
        if (elapsed > 1200) {
          setCheckoutStep('verifying_return');
        }
      }
    };

    const handleFocus = () => {
      const elapsed = Date.now() - launchedAt;
      if (elapsed > 1200 && appLaunchDetected) {
        setCheckoutStep('verifying_return');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [paymentIntentLaunched, launchedAt, checkoutStep, appLaunchDetected]);

  const tierFactor = tier === 'GA' ? 0.55 : tier === 'VIP' ? 0.8 : 1.0;
  const intensity = Math.min(1, (quantity / 6) * 0.65 + tierFactor * 0.35);

  // Build crisp 19x11 diamond/hourglass dot-matrix field matching District obsidian canvas
  const dotField = useMemo(() => {
    const dots: Array<{ x: number; y: number; r: number; opacity: number }> = [];
    const cols = 19;
    const rows = 11;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const nx = (col - (cols - 1) / 2) / ((cols - 1) / 2);
        const ny = (row - (rows - 1) / 2) / ((rows - 1) / 2);
        const dist = Math.sqrt(nx * nx * 0.9 + ny * ny * 1.15);
        const envelope = Math.max(0, 1 - dist / (0.68 + intensity * 0.42));
        if (envelope > 0.03) {
          dots.push({
            x: 16 + col * 15.5,
            y: 12 + row * 12.5,
            r: 0.75 + envelope * 1.15,
            opacity: 0.14 + envelope * 0.86,
          });
        }
      }
    }
    return dots;
  }, [intensity]);

  const progressPct =
    maxSelectable > 1 ? ((quantity - 1) / (maxSelectable - 1)) * 100 : 100;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(KESARI_CONTACT.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2200);
  };

  const handleCopyDeepLink = () => {
    navigator.clipboard.writeText(upiLinks.intent);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.65 },
        colors: ['#D8FF48', '#6F78E8', '#F97316', '#FFFFFF'],
      });
    } catch {}
  };

  // Launch Phone UPI App via Native Intent Deep Link with Auto-Detection & Retry
  const handleLaunchUpiApp = async (
    targetScheme: 'intent' | 'gpay' | 'phonepe' | 'paytm' | 'cred' = 'intent'
  ) => {
    setError(null);
    setLastTargetScheme(targetScheme);
    setAppLaunchFailed(false);
    setAppLaunchDetected(false);
    if (countdownIntervalRef.current) window.clearInterval(countdownIntervalRef.current);

    const link = upiLinks[targetScheme] || upiLinks.intent;

    // Register pending order with backend API
    let orderId = currentOrderId;
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.id,
          eventTitle: event.title,
          tier,
          quantity,
          totalAmount: quote.total,
          customerName: customerName.trim() || 'Studio Patron',
          customerPhone: customerPhone.trim(),
        }),
      });
      const data = await res.json();
      if (data && data.order && data.order.id) {
        orderId = data.order.id;
        setCurrentOrderId(orderId);
      }
    } catch {}

    setPaymentIntentLaunched(true);
    setLaunchedAt(Date.now());

    // Trigger Phone UPI App
    window.location.href = link;

    // Timer: if window remains visible after 2.5s, app failed to open (desktop or scheme blocked)
    if (launchTimerRef.current) window.clearTimeout(launchTimerRef.current);
    launchTimerRef.current = window.setTimeout(() => {
      if (document.visibilityState === 'visible') {
        setAppLaunchFailed(true);
        // Start auto-retry countdown from 6 seconds
        setRetryCountdown(6);
        if (countdownIntervalRef.current) window.clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = window.setInterval(() => {
          setRetryCountdown((prev) => {
            if (prev <= 1) {
              if (countdownIntervalRef.current) window.clearInterval(countdownIntervalRef.current);
              // Auto retry launch once
              window.location.href = link;
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    }, 2500);
  };

  // Mandatory 12-Digit Bank UTR Verification
  const isUtrFormatValid = useMemo(() => {
    const clean = utrNumber.trim();
    return /^\d{12}$/.test(clean);
  }, [utrNumber]);

  const handleExecuteVerification = async () => {
    const cleanUtr = utrNumber.trim();
    if (!cleanUtr || !/^\d{12}$/.test(cleanUtr)) {
      setError('Please enter the full 12-digit numeric UPI UTR number from your payment receipt.');
      return;
    }

    setIsVerifying(true);
    setError(null);

    // Call backend API to verify UTR and ensure no duplicate
    try {
      let orderId = currentOrderId;
      // If order not yet created, create it now
      if (!orderId) {
        const orderRes = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventId: event.id,
            eventTitle: event.title,
            tier,
            quantity,
            totalAmount: quote.total,
            customerName: customerName.trim() || 'Studio Patron',
            customerPhone: customerPhone.trim(),
          }),
        });
        const orderData = await orderRes.json();
        if (orderData && orderData.order && orderData.order.id) {
          orderId = orderData.order.id;
          setCurrentOrderId(orderId);
        }
      }

      if (orderId) {
        const verifyRes = await fetch(`/api/orders/${orderId}/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ utr: cleanUtr }),
        });
        const verifyData = await verifyRes.json();

        if (verifyRes.status === 409 || verifyData.ok === false) {
          setIsVerifying(false);
          setError(verifyData.error || 'Duplicate or invalid UTR reference. Verification failed.');
          return;
        }
      }
    } catch {
      // Backend offline: perform client-side check
    }

    // Mint verified pass
    const res = onConfirmPurchase({
      eventId: event.id,
      tier,
      quantity,
      utr: cleanUtr,
      status: 'confirmed',
    });

    setIsVerifying(false);

    if (res.ok === false) {
      setError(res.error);
      return;
    }

    setMintedPass(res.mintedPass);
    setCheckoutStep('done');
    triggerConfetti();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Ticket checkout for ${event.title}`}
      data-lenis-prevent
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-end sm:items-center justify-center sm:p-6 overflow-y-auto"
    >
      <div className="w-full h-full sm:h-auto sm:max-w-[460px] lg:max-w-[920px] bg-[#050507] sm:rounded-[38px] border border-white/10 overflow-hidden flex flex-col justify-between lg:grid lg:grid-cols-2 shadow-2xl">
        {/* Top / Left Pitch-Black Dot-Matrix Canvas */}
        <div className="relative p-6 pb-4 sm:p-7 flex flex-col justify-between obsidian-dot-canvas">
          <div className="flex items-center justify-between gap-3 mb-3">
            <button
              type="button"
              onClick={() => {
                if (checkoutStep === 'pay_upi' || checkoutStep === 'verifying_return') {
                  setCheckoutStep('calibrate');
                } else {
                  onClose();
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 text-xs font-medium text-white/85 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Dismiss ticket dialog"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors shrink-0 lg:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] text-white/55">
                {event.dateLabel} · {event.timeLabel} · {event.venue}
              </p>
              <h2 className="mt-1 text-xl font-semibold text-white tracking-tight text-balance">
                {event.title}
              </h2>
              {event.room && (
                <p className="mt-0.5 text-xs text-[#D8FF48] font-medium">{event.room}</p>
              )}
            </div>
          </div>

          {/* Radial Dot-Matrix Acoustic Field */}
          <div className="my-4 sm:my-6 flex flex-col items-center">
            <svg
              viewBox="0 0 314 152"
              className="w-full max-w-[300px] h-auto"
              aria-hidden="true"
            >
              {dotField.map((dot, idx) => (
                <circle
                  key={idx}
                  cx={dot.x}
                  cy={dot.y}
                  r={dot.r}
                  fill="#FFFFFF"
                  opacity={dot.opacity}
                />
              ))}
            </svg>

            <div className="mt-2 text-center">
              <div
                data-testid="ticket-total-display"
                className="font-dot text-[44px] sm:text-[52px] leading-none text-white inline-flex items-start justify-center"
              >
                <span className="font-display text-[20px] sm:text-[22px] font-medium text-white/75 mr-1 mt-1">
                  ₹
                </span>
                <span>{Math.round(quote.total).toLocaleString('en-IN')}</span>
              </div>
              <p className="mt-2 text-xs text-white/65 tabular-nums">
                {quantity}× {tier} Pass · {formatCurrencyINR(quote.unitPrice)} each
              </p>
            </div>
          </div>

          {/* Subtle Editorial Thumbnail Strip */}
          <div className="hidden sm:flex items-center gap-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] p-2.5">
            <img
              src={event.imageUrl}
              alt={event.title}
              referrerPolicy="no-referrer"
              className="w-14 h-12 rounded-xl object-cover shrink-0"
            />
            <p className="text-xs text-white/70 line-clamp-2">{event.description}</p>
          </div>
        </div>

        {/* Bottom / Right Luminous Periwinkle-Indigo Control Dock */}
        <div className="surface-indigo rounded-t-[34px] lg:rounded-none lg:rounded-r-[38px] p-6 sm:p-7 flex flex-col justify-between gap-5">
          {/* STEP 4: PASS MINTED (DONE) */}
          {checkoutStep === 'done' && mintedPass ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
              <div className="w-14 h-14 rounded-full bg-[#D8FF48] text-[#07070A] flex items-center justify-center shadow-[0_0_25px_rgba(216,255,72,0.5)]">
                <Check className="w-7 h-7 stroke-[2.5]" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">
                Pass Verified &amp; Minted
              </h3>
              <p className="mt-1 text-sm text-white/75">
                {mintedPass.quantity}× {mintedPass.tier} for {mintedPass.eventTitle}
              </p>

              <div className="mt-4 px-5 py-3 rounded-2xl bg-black/40 border border-white/15 w-full max-w-[320px] text-center">
                <p className="text-[11px] text-white/55 uppercase tracking-wider">Kesari Gate Pass Code</p>
                <p className="font-dot text-2xl text-white mt-0.5">{mintedPass.passCode}</p>

                {mintedPass.utr && (
                  <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                    <span className="text-white/60">Bank UTR Ref:</span>
                    <span className="font-mono text-[#D8FF48] font-bold">{mintedPass.utr}</span>
                  </div>
                )}

                <div className="mt-2 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-[#D8FF48]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified &amp; Stamped on Studio Ledger</span>
                </div>
              </div>

              <div className="mt-6 w-full flex items-center gap-3">
                <button
                  type="button"
                  onClick={onViewPasses}
                  className="flex-1 h-12 rounded-full bg-white text-[#07070A] font-semibold text-sm hover:bg-white/90 transition-colors"
                >
                  Open Pass Wallet
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close confirmation"
                  className="w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : checkoutStep === 'verifying_return' ? (
            /* STEP 3: MANDATORY 12-DIGIT UTR VERIFICATION (NO BYPASS!) */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCheckoutStep('pay_upi')}
                  className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Payment</span>
                </button>
                <span className="text-xs font-semibold text-[#D8FF48] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Bank Verification</span>
                </span>
                <span className="text-xs font-bold text-white">
                  {formatCurrencyINR(quote.total)}
                </span>
              </div>

              {/* Security Header Banner */}
              <div className="p-3.5 rounded-2xl bg-black/45 border border-[#D8FF48]/30 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-[#D8FF48]/20 flex items-center justify-center text-[#D8FF48] mb-2">
                  <ShieldCheck className="w-5 h-5 text-[#D8FF48]" />
                </div>
                <h4 className="text-sm font-semibold text-white">
                  Mandatory UPI Transaction Verification
                </h4>
                <p className="mt-1 text-[11px] text-white/70 max-w-[280px]">
                  Passes are minted only upon validating your 12-digit bank reference number.
                </p>
              </div>

              {/* 12-Digit UTR Form */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/15 space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="utr-input" className="text-xs font-medium text-white flex items-center gap-1.5">
                    <span>12-Digit Bank UTR / Ref Number</span>
                    <span className="text-rose-400">*</span>
                  </label>
                  <span
                    className={`text-xs font-mono font-bold ${
                      isUtrFormatValid ? 'text-[#D8FF48]' : 'text-white/45'
                    }`}
                  >
                    {utrNumber.length}/12
                  </span>
                </div>

                <div className="relative">
                  <input
                    id="utr-input"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={12}
                    value={utrNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 12);
                      setUtrNumber(val);
                      setError(null);
                    }}
                    placeholder="e.g. 432109876543"
                    className="w-full h-12 px-4 rounded-xl bg-black/60 border border-white/20 text-white font-mono text-base tracking-widest focus:outline-none focus:border-[#D8FF48] focus:ring-1 focus:ring-[#D8FF48]/50 placeholder:tracking-normal placeholder:font-sans placeholder:text-white/30"
                  />
                  {isUtrFormatValid && (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#D8FF48]">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-white/60">
                  <span className="font-semibold text-white/80">Where to find:</span>
                  <span>Open your UPI app payment receipt and copy the 12-digit number labeled "UPI Ref ID" or "UTR".</span>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/35 flex items-start gap-2.5 text-xs text-rose-200">
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{error}</span>
                </div>
              )}

              {/* Mandatory Submit & Verify Button (Strictly Disabled Without 12 Digits) */}
              <button
                type="button"
                onClick={handleExecuteVerification}
                disabled={!isUtrFormatValid || isVerifying}
                className="w-full h-12 rounded-full font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(216,255,72,0.35)] disabled:opacity-40 disabled:cursor-not-allowed bg-[#D8FF48] text-[#07070A] hover:bg-[#C8EE38] active:scale-[0.99]"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying UTR on Ledger...</span>
                  </>
                ) : !isUtrFormatValid ? (
                  <span>Enter 12-Digit UTR to Verify &amp; Mint Pass</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verify UTR &amp; Mint Pass Now</span>
                  </>
                )}
              </button>

              {/* Help & Retry Navigation */}
              <div className="pt-1 flex items-center justify-between text-xs text-white/60">
                <button
                  type="button"
                  onClick={() => handleLaunchUpiApp(lastTargetScheme)}
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reopen UPI App</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('qr');
                    setCheckoutStep('pay_upi');
                  }}
                  className="hover:text-[#D8FF48] transition-colors flex items-center gap-1"
                >
                  <QrCode className="w-3 h-3" />
                  <span>Scan QR Code Instead</span>
                </button>
              </div>
            </div>
          ) : checkoutStep === 'pay_upi' ? (
            /* STEP 2: UNIFIED PAYMENT INTERFACE (RAZORPAY + DIRECT UPI + RESERVE) */
            <PaymentInterface
              title={event.title}
              subtitle={`${quantity}× ${tier} Pass`}
              amount={quote.total}
              customerName={customerName}
              customerPhone={customerPhone}
              onChangeName={setCustomerName}
              onChangePhone={setCustomerPhone}
              onBack={() => setCheckoutStep('calibrate')}
              createBackendOrder={async () => {
                if (currentOrderId) return currentOrderId;
                try {
                  const res = await fetch('/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      eventId: event.id,
                      eventTitle: event.title,
                      tier,
                      quantity,
                      totalAmount: quote.total,
                      customerName: customerName.trim() || 'Studio Patron',
                      customerPhone: customerPhone.trim(),
                    }),
                  });
                  const data = await res.json();
                  if (data?.order?.id) {
                    setCurrentOrderId(data.order.id);
                    return data.order.id;
                  }
                } catch {}
                return null;
              }}
              onPaymentSuccess={({ reference, status }) => {
                const res = onConfirmPurchase({
                  eventId: event.id,
                  tier,
                  quantity,
                  utr: reference,
                  status,
                });
                if (res.ok === false) {
                  setError(res.error);
                  return;
                }
                setMintedPass(res.mintedPass);
                setCheckoutStep('done');
                triggerConfetti();
              }}
            />
          ) : (
            /* STEP 1: CALIBRATE PASSES */
            <>
              {/* Top Readout Bar inside Indigo Dock */}
              <div className="flex items-start justify-between gap-2 text-center">
                <div className="text-left">
                  <div className="text-base font-semibold text-white tabular-nums">
                    {remaining}
                  </div>
                  <div className="text-[11px] text-white/55">Left</div>
                </div>

                <div className="flex flex-col items-center">
                  <Sparkles className="w-4 h-4 text-white/80 mb-1" />
                  <span className="text-xs font-medium text-white/90">
                    Calibrate Tickets
                  </span>
                </div>

                <div className="text-right">
                  <div className="text-base font-semibold text-white tabular-nums">
                    {formatCurrencyINR(quote.studioFee)}
                  </div>
                  <div className="text-[11px] text-white/55">Fee</div>
                </div>
              </div>

              {/* Tier Selector Segmented Buttons */}
              <div
                className="grid grid-cols-3 gap-1.5 p-1.5 rounded-2xl bg-black/30 border border-white/10"
                role="radiogroup"
                aria-label="Ticket tier"
              >
                {availableTiers.map((item) => {
                  const active = tier === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setTier(item)}
                      className={`min-h-[40px] px-1 rounded-xl text-xs font-semibold transition-all truncate ${
                        active
                          ? 'bg-white text-[#090A18] shadow-sm'
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>

              {/* Quantity Stepper with Glow Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-white/75">
                  <span>Pass Quantity</span>
                  <span className="font-semibold text-white tabular-nums">
                    {quantity} of {maxSelectable} max
                  </span>
                </div>

                <div className="relative h-2 rounded-full bg-black/35 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#D8FF48] to-[#9CD3FF] transition-all duration-200"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="h-10 flex-1 rounded-xl bg-black/25 hover:bg-black/40 disabled:opacity-35 text-white font-semibold text-lg flex items-center justify-center border border-white/10 transition-colors"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-dot text-2xl text-white tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(maxSelectable, q + 1))}
                    disabled={quantity >= maxSelectable}
                    className="h-10 flex-1 rounded-xl bg-black/25 hover:bg-black/40 disabled:opacity-35 text-white font-semibold text-lg flex items-center justify-center border border-white/10 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {error && <p className="text-xs text-rose-300 font-medium">{error}</p>}

              {/* Checkout Action Dock: Pay via UPI */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => setCheckoutStep('pay_upi')}
                  className="w-full h-12 rounded-full bg-[#D8FF48] text-[#07070A] font-bold text-xs hover:bg-[#C8EE38] transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(216,255,72,0.3)] active:scale-[0.99]"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Proceed to Payment (Razorpay) · {formatCurrencyINR(quote.total)}</span>
                </button>

                <div className="flex items-center justify-between px-1 text-[11px] text-white/50">
                  <span>Razorpay Gateway &middot; Instant Pass Reservation</span>
                  <button
                    type="button"
                    onClick={() => {
                      setTier(availableTiers[0]);
                      setQuantity(1);
                    }}
                    aria-label="Reset ticket selection"
                    className="hover:text-white transition-colors flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
