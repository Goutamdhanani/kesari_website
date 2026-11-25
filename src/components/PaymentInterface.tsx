import React, { useEffect, useState } from 'react';
import {
  Building2,
  CheckCircle2,
  Clock,
  CreditCard,
  Lock,
  MessageSquare,
  Smartphone,
  Wallet,
} from 'lucide-react';
import {
  KESARI_CONTACT,
  formatCurrencyINR,
} from '../utils/studioLogic';
import {
  createRazorpayOrder,
  loadRazorpayScript,
  verifyRazorpayPayment,
} from '../utils/razorpay';

export type PaymentTab = 'razorpay' | 'venue';

interface PaymentInterfaceProps {
  title: string;
  subtitle: string;
  amount: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  onChangeName: (val: string) => void;
  onChangePhone: (val: string) => void;
  onChangeEmail?: (val: string) => void;
  onPaymentSuccess: (result: {
    method: 'razorpay' | 'venue';
    reference: string;
    status: 'confirmed' | 'pending_review';
  }) => void;
  onBack?: () => void;
  createBackendOrder?: () => Promise<string | null>;
}

export const PaymentInterface: React.FC<PaymentInterfaceProps> = ({
  title,
  subtitle,
  amount,
  customerName,
  customerPhone,
  customerEmail = '',
  onChangeName,
  onChangePhone,
  onChangeEmail,
  onPaymentSuccess,
  onBack,
  createBackendOrder,
}) => {
  const [activeTab, setActiveTab] = useState<PaymentTab>('razorpay');
  const [rzpSubMethod, setRzpSubMethod] = useState<'card' | 'upi' | 'netbanking' | 'wallet'>('card');
  const [razorpayReady, setRazorpayReady] = useState<boolean | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingRzpNotice, setPendingRzpNotice] = useState(false);

  useEffect(() => {
    fetch('/api/payments/config')
      .then((r) => r.json())
      .then((data) => setRazorpayReady(Boolean(data?.razorpayEnabled)))
      .catch(() => setRazorpayReady(false));
  }, []);

  const handleRazorpayPay = async () => {
    setError(null);
    if (!customerPhone.trim() || customerPhone.trim().length < 10) {
      setError('Please enter a valid 10-digit mobile / WhatsApp number for your pass.');
      return;
    }

    setIsProcessing(true);
    try {
      const backendOrderId = createBackendOrder ? await createBackendOrder() : null;
      const orderResp = await createRazorpayOrder({
        amount,
        receipt: `kesari_${Date.now()}`,
        notes: {
          title,
          customerName: customerName.trim() || 'Studio Patron',
          customerPhone: customerPhone.trim(),
        },
        orderId: backendOrderId || undefined,
      });

      if (orderResp.mode === 'live' && orderResp.keyId) {
        const loaded = await loadRazorpayScript();
        if (!loaded || !window.Razorpay) {
          setError('Unable to load Razorpay Checkout SDK. Please try Reserve instead.');
          setIsProcessing(false);
          return;
        }

        const rzp = new window.Razorpay({
          key: orderResp.keyId,
          amount: orderResp.razorpayOrder.amount,
          currency: orderResp.razorpayOrder.currency,
          name: 'Kesari – The Memory Studio',
          description: `${title} · ${subtitle}`,
          order_id: orderResp.razorpayOrder.id,
          prefill: {
            name: customerName.trim() || undefined,
            contact: customerPhone.trim() || undefined,
            email: customerEmail.trim() || undefined,
          },
          theme: { color: '#6F78E8' },
          handler: async (response: {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
          }) => {
            const verifyRes = await verifyRazorpayPayment({
              ...response,
              orderId: backendOrderId || undefined,
            });
            setIsProcessing(false);
            if (verifyRes.ok && verifyRes.verified) {
              onPaymentSuccess({
                method: 'razorpay',
                reference: response.razorpay_payment_id,
                status: 'confirmed',
              });
            } else {
              setError(verifyRes.error || 'Payment verification failed.');
            }
          },
          modal: {
            ondismiss: () => setIsProcessing(false),
          },
        });
        rzp.on('payment.failed', (resp) => {
          setIsProcessing(false);
          setError(resp?.error?.description || 'Payment failed. Please retry or reserve.');
        });
        rzp.open();
        return;
      }

      // Razorpay keys pending final integration: show confirmation notice & allow reserve
      setPendingRzpNotice(true);
      setIsProcessing(false);
    } catch {
      setError('Could not initialize payment. Please try Reserve & WhatsApp.');
      setIsProcessing(false);
    }
  };

  const handleConfirmPendingRazorpayReserve = async () => {
    setIsProcessing(true);
    const ref = `RZP-WAIT-${Date.now().toString().slice(-6)}`;
    try {
      const backendOrderId = createBackendOrder ? await createBackendOrder() : null;
      await verifyRazorpayPayment({
        razorpay_order_id: `order_pending_${Date.now()}`,
        razorpay_payment_id: ref,
        razorpay_signature: 'pending_integration',
        orderId: backendOrderId || undefined,
        simulate: true,
      });
    } catch {}
    setIsProcessing(false);
    onPaymentSuccess({
      method: 'razorpay',
      reference: ref,
      status: 'pending_review',
    });
  };

  const handleVenueReserve = () => {
    setError(null);
    if (!customerPhone.trim() || customerPhone.trim().length < 10) {
      setError('Please enter your 10-digit WhatsApp number to hold your booking.');
      return;
    }
    const ref = `VENUE-${Date.now().toString().slice(-6)}`;
    const msg = `Hi Kesari Studio! I've reserved "${title}" (${subtitle}) for ${formatCurrencyINR(amount)}.\nName: ${customerName || 'Guest'}\nPhone: ${customerPhone}\nRef: ${ref}\nWill pay via Razorpay / at venue.`;
    window.open(KESARI_CONTACT.whatsappUrl(msg), '_blank');
    onPaymentSuccess({
      method: 'venue',
      reference: ref,
      status: 'pending_review',
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#D8FF48]" />
            <h3 className="text-sm font-semibold text-white">Payment Checkout</h3>
          </div>
          <p className="text-[11px] text-white/60 mt-0.5 truncate max-w-[260px]">
            {title} · {formatCurrencyINR(amount)}
          </p>
        </div>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 text-xs font-medium text-white/85 hover:text-white transition-colors shrink-0"
          >
            ← Back
          </button>
        )}
      </div>

      {/* Customer Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <input
          type="text"
          placeholder="Full Name"
          value={customerName}
          onChange={(e) => onChangeName(e.target.value)}
          className="h-10 px-3 rounded-xl bg-black/35 border border-white/15 text-white text-xs focus:outline-none focus:border-[#D8FF48]/60"
        />
        <input
          type="tel"
          placeholder="Mobile / WhatsApp (10 digits)*"
          value={customerPhone}
          onChange={(e) => onChangePhone(e.target.value)}
          className="h-10 px-3 rounded-xl bg-black/35 border border-white/15 text-white text-xs focus:outline-none focus:border-[#D8FF48]/60"
        />
        {onChangeEmail && (
          <input
            type="email"
            placeholder="Email for Receipt (Optional)"
            value={customerEmail}
            onChange={(e) => onChangeEmail(e.target.value)}
            className="sm:col-span-2 h-10 px-3 rounded-xl bg-black/35 border border-white/15 text-white text-xs focus:outline-none focus:border-[#D8FF48]/60"
          />
        )}
      </div>

      {/* Payment Method Selector Tabs (Razorpay + Reserve) */}
      <div
        className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-black/40 border border-white/10"
        role="tablist"
        aria-label="Payment Methods"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'razorpay'}
          onClick={() => {
            setActiveTab('razorpay');
            setError(null);
          }}
          className={`h-9 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'razorpay'
              ? 'bg-[#D8FF48] text-[#07070A] shadow-sm'
              : 'text-white/70 hover:text-white'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Razorpay Gateway</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'venue'}
          onClick={() => {
            setActiveTab('venue');
            setError(null);
          }}
          className={`h-9 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'venue'
              ? 'bg-[#D8FF48] text-[#07070A] shadow-sm'
              : 'text-white/70 hover:text-white'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Reserve Seat</span>
        </button>
      </div>

      {/* TAB 1: RAZORPAY GATEWAY */}
      {activeTab === 'razorpay' && (
        <div className="p-4 rounded-2xl bg-black/40 border border-white/15 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#3395FF]/20 border border-[#3395FF]/40 flex items-center justify-center text-[#60A5FA] font-bold text-xs">
                R
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Razorpay Secure Checkout</p>
                <p className="text-[10px] text-white/55">Cards · UPI · Netbanking · Wallets</p>
              </div>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                razorpayReady
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
              }`}
            >
              {razorpayReady ? 'Live' : 'Awaiting Final Keys'}
            </span>
          </div>

          {/* Sub-method visual selector */}
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { id: 'card', label: 'Cards', Icon: CreditCard },
              { id: 'upi', label: 'UPI', Icon: Smartphone },
              { id: 'netbanking', label: 'Bank', Icon: Building2 },
              { id: 'wallet', label: 'Wallets', Icon: Wallet },
            ].map(({ id, label, Icon }) => {
              const active = rzpSubMethod === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setRzpSubMethod(id as 'card' | 'upi' | 'netbanking' | 'wallet')}
                  className={`py-2 px-1 rounded-xl border text-[10px] font-medium flex flex-col items-center gap-1 transition-all ${
                    active
                      ? 'bg-white/15 border-white/40 text-white'
                      : 'bg-black/30 border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          {!pendingRzpNotice ? (
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleRazorpayPay}
              className="w-full h-11 rounded-xl bg-[#3395FF] hover:bg-[#2584EB] disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-[0_0_20px_rgba(51,149,255,0.3)]"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>
                {isProcessing
                  ? 'Initializing Razorpay...'
                  : `Pay ${formatCurrencyINR(amount)} with Razorpay →`}
              </span>
            </button>
          ) : (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2.5">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <div className="text-[11px] text-white/85 leading-relaxed">
                  <strong className="text-amber-200">Razorpay Final Integration Pending:</strong>{' '}
                  Live Razorpay API keys are awaiting final activation. You can reserve your pass now and complete payment on confirmation.
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleConfirmPendingRazorpayReserve}
                  className="h-9 rounded-lg bg-[#D8FF48] text-[#07070A] font-bold text-[11px] hover:bg-[#C8EE38] transition-colors flex items-center justify-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Reserve Pass</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPendingRzpNotice(false);
                    setActiveTab('venue');
                  }}
                  className="h-9 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-[11px] transition-colors"
                >
                  WhatsApp Reserve
                </button>
              </div>
            </div>
          )}

          <p className="text-[10px] text-white/45 text-center">
            256-bit encrypted · Visa, Mastercard, RuPay, UPI, Netbanking supported
          </p>
        </div>
      )}

      {/* TAB 2: RESERVE & PAY VIA WHATSAPP / AT VENUE */}
      {activeTab === 'venue' && (
        <div className="p-4 rounded-2xl bg-black/40 border border-white/15 space-y-3">
          <p className="text-xs text-white/80 leading-relaxed">
            Hold your booking instantly and confirm directly with Kesari Studio on WhatsApp (<strong>+91 77605 39955</strong>). Pay at the venue desk or via Razorpay link.
          </p>
          <button
            type="button"
            onClick={handleVenueReserve}
            className="w-full h-11 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-[#07070A] font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Reserve Seat &amp; Confirm on WhatsApp →</span>
          </button>
        </div>
      )}

      {error && <p className="text-xs text-rose-300 font-medium">{error}</p>}
    </div>
  );
};
