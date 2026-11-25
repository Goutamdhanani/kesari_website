import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import {
  Phone,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Instagram,
  Youtube,
  Facebook,
  ExternalLink,
  MapPin,
  Mail,
} from 'lucide-react';

const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.66-5.17 3.66-9.12z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.13C3.25 21.31 7.31 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.57H1.27C.46 8.19 0 10.03 0 12s.46 3.81 1.27 5.43l4.01-3.14z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.69 1.27 6.57l4.01 3.14c.95-2.83 3.6-4.96 6.72-4.96z"
    />
  </svg>
);

// ── Constants ───────────────────────────────────────────────────────────────
const CONTACT = {
  phone: '+91 77605 39955',
  phoneRaw: '+917760539955',
  email: 'Kesari.memory@gmail.com',
  address: '#33, 60 Feet Road, KHB Colony, 5th Block, Koramangala, Bengaluru – 560095',
  whatsapp: 'https://wa.me/917760539955',
  maps: 'https://share.google/1gcic7zhVrOJJYs4O',
  osmEmbed: 'https://www.openstreetmap.org/export/embed.html?bbox=77.6200%2C12.9280%2C77.6380%2C12.9420&layer=mapnik&marker=12.9345%2C77.6290',
  hours: '10:00 AM – 11:30 PM daily',
  instagram: 'https://www.instagram.com/kesari_thememorystudio/',
  instagramHandle: '@kesari_thememorystudio',
  youtube: 'https://www.youtube.com/@kesarithememorystudio',
  youtubeHandle: '@kesarithememorystudio',
  facebook: 'https://www.facebook.com/p/Kesari-61586699187811/',
  facebookHandle: 'Kesari Studio',
  google: 'https://share.google/1gcic7zhVrOJJYs4O',
  googleHandle: 'Kesari on Google',
};

interface FormState {
  name: string;
  phone: string;
  email: string;
  eventType: string;
  message: string;
}

const FORM_INITIAL: FormState = { name: '', phone: '', email: '', eventType: '', message: '' };
const EVENT_TYPES = ['Live Event', 'Recording Session', 'Private Party', 'Corporate Event', 'Wedding', 'Other'];

// ── Quick Action Card ────────────────────────────────────────────────────────
function ActionCard({
  icon,
  label,
  value,
  href,
  color,
  onCopy,
  copied,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  color: string;
  onCopy?: () => void;
  copied?: boolean;
}) {
  return (
    <div className="flex-1 min-w-[125px] sm:min-w-[140px] bg-[#0A0B10]/80 border border-white/8 rounded-[20px] sm:rounded-[22px] p-3 sm:p-4 flex flex-col gap-2 sm:gap-2.5 backdrop-blur-sm">
      <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-[9.5px] sm:text-[10px] text-white/40 uppercase tracking-wider font-medium">{label}</p>
        <p className="text-xs sm:text-sm text-white/80 font-medium leading-tight mt-0.5 break-all">{value}</p>
      </div>
      <div className="flex gap-2">
        {href && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl bg-white/8 hover:bg-white/14 text-white/70 hover:text-white text-xs font-medium transition-colors"
          >
            <ExternalLink size={11} />
            Open
          </a>
        )}
        {onCopy && (
          <button
            type="button"
            onClick={onCopy}
            className="flex items-center justify-center w-8 h-7 rounded-xl bg-white/8 hover:bg-white/14 text-white/60 hover:text-white transition-colors"
            aria-label="Copy"
          >
            {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────
export function ContactSection() {
  const [form, setForm] = useState<FormState>(FORM_INITIAL);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitState, setSubmitState] = useState<'idle' | 'success' | 'error'>('idle');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const copy = (text: string, field: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const validate = (): boolean => {
    const e: Partial<FormState> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.replace(/\D/g, '')))
      e.phone = 'Enter a valid 10-digit phone';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Enter a valid email';
    if (!form.eventType) e.eventType = 'Please select an event type';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // Simulate submission (wire to backend as needed)
    setTimeout(() => setSubmitState('success'), 400);
    setForm(FORM_INITIAL);
  };

  const field = (name: keyof FormState) => ({
    value: form[name],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [name]: e.target.value })),
  });

  const inputCls = (err?: string) =>
    `w-full bg-white/5 border ${err ? 'border-red-500/60' : 'border-white/12'} rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors`;

  return (
    <section id="contact" aria-label="Come say hello!" className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Phone size={15} className="text-[#D8FF48]" />
          <h2 className="text-base sm:text-lg font-semibold text-white">Come say hello!</h2>
        </div>
        <a
          href={CONTACT.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-white/55 hover:text-white transition-colors"
        >
          WhatsApp ›
        </a>
      </div>

      {/* Quick Action Cards */}
      <div className="flex gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        <ActionCard
          icon={<Phone size={16} className="text-white" />}
          label="Call Us"
          value={CONTACT.phone}
          href={`tel:${CONTACT.phoneRaw}`}
          color="bg-blue-600/80"
          onCopy={() => copy(CONTACT.phone, 'phone')}
          copied={copiedField === 'phone'}
        />
        <ActionCard
          icon={<MessageSquare size={16} className="text-white" />}
          label="WhatsApp"
          value={CONTACT.phone}
          href={CONTACT.whatsapp}
          color="bg-green-600/80"
          onCopy={() => copy(CONTACT.phone, 'wa')}
          copied={copiedField === 'wa'}
        />
        <ActionCard
          icon={<Instagram size={16} className="text-white" />}
          label="Instagram"
          value={CONTACT.instagramHandle}
          href={CONTACT.instagram}
          color="bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600"
          onCopy={() => copy(CONTACT.instagram, 'insta')}
          copied={copiedField === 'insta'}
        />
        <ActionCard
          icon={<Youtube size={16} className="text-white" />}
          label="YouTube"
          value={CONTACT.youtubeHandle}
          href={CONTACT.youtube}
          color="bg-red-600/90"
          onCopy={() => copy(CONTACT.youtube, 'yt')}
          copied={copiedField === 'yt'}
        />
        <ActionCard
          icon={<Facebook size={16} className="text-white" />}
          label="Facebook"
          value={CONTACT.facebookHandle}
          href={CONTACT.facebook}
          color="bg-[#1877F2]"
          onCopy={() => copy(CONTACT.facebook, 'fb')}
          copied={copiedField === 'fb'}
        />
        <ActionCard
          icon={<GoogleIcon />}
          label="Google"
          value={CONTACT.googleHandle}
          href={CONTACT.google}
          color="bg-white/10"
          onCopy={() => copy(CONTACT.google, 'google')}
          copied={copiedField === 'google'}
        />
      </div>

      {/* Hours strip */}
      <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white/4 border border-white/8 rounded-2xl">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-xs text-white/60">Open today · <span className="text-white/85">{CONTACT.hours}</span></span>
      </div>

      {/* Map (Up) */}
      <div className="rounded-[22px] overflow-hidden border border-white/8 h-[190px]">
        <iframe
          src={CONTACT.osmEmbed}
          title="Kesari Studio Location"
          className="w-full h-full"
          loading="lazy"
          style={{ filter: 'invert(0.88) hue-rotate(185deg) saturate(0.5) brightness(0.8)' }}
        />
      </div>

      {/* Enquiry Form (Down) */}
      <div className="bg-[#0A0B10]/80 border border-white/8 rounded-[26px] p-5 backdrop-blur-sm space-y-4">
        <p className="text-sm font-semibold text-white">Send an Enquiry</p>

        {submitState === 'success' ? (
          <motion.div
            className="flex flex-col items-center gap-3 py-8 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <CheckCircle2 size={36} className="text-green-400" />
            <p className="text-white font-medium">Message sent!</p>
            <p className="text-white/50 text-xs">We'll get back to you within a few hours.</p>
            <button
              type="button"
              onClick={() => setSubmitState('idle')}
              className="mt-1 text-xs text-white/50 hover:text-white underline underline-offset-2 transition-colors"
            >
              Send another
            </button>
          </motion.div>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-3">
            {/* Name + Phone row */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 space-y-1">
                <input placeholder="Your name" className={inputCls(errors.name)} {...field('name')} />
                {errors.name && <p className="text-[11px] text-red-400 pl-1">{errors.name}</p>}
              </div>
              <div className="flex-1 space-y-1">
                <input placeholder="Phone number" type="tel" className={inputCls(errors.phone)} {...field('phone')} />
                {errors.phone && <p className="text-[11px] text-red-400 pl-1">{errors.phone}</p>}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <input placeholder="Email address" type="email" className={inputCls(errors.email)} {...field('email')} />
              {errors.email && <p className="text-[11px] text-red-400 pl-1">{errors.email}</p>}
            </div>

            {/* Event Type */}
            <div className="space-y-1">
              <select
                className={`${inputCls(errors.eventType)} appearance-none`}
                {...field('eventType')}
              >
                <option value="" disabled>Select event type</option>
                {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.eventType && <p className="text-[11px] text-red-400 pl-1">{errors.eventType}</p>}
            </div>

            {/* Message */}
            <textarea
              placeholder="Tell us about your event…"
              rows={3}
              className={`${inputCls()} resize-none`}
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            />

            {submitState === 'error' && (
              <div className="flex items-center gap-2 text-red-400 text-xs">
                <AlertCircle size={13} />
                Something went wrong. Please try again.
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-white text-black text-sm font-semibold hover:bg-white/90 active:scale-[0.98] transition-all"
            >
              <Send size={14} />
              Send Enquiry
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
