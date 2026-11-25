import React from 'react';
import { motion } from 'motion/react';
import {
  Phone,
  MessageSquare,
  MapPin,
  Mail,
  ExternalLink,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  Home,
} from 'lucide-react';

export type MainSectionKey = 'about' | 'connect' | 'help';

export interface StudioPageTarget {
  section: MainSectionKey;
  subPage: string;
}

interface StudioPagesViewProps {
  section: MainSectionKey;
  subPage: string;
  onSelectSubPage: (subPage: string) => void;
  onBackToHome: () => void;
  onSelectSection: (section: MainSectionKey) => void;
}

export const STUDIO_PAGES_CONFIG: Record<
  MainSectionKey,
  {
    title: string;
    subPages: { id: string; label: string }[];
  }
> = {
  about: {
    title: 'About Kesari',
    subPages: [
      { id: 'our-story', label: 'Our Story' },
      { id: 'meet-the-founder', label: 'Meet the Founder' },
      { id: 'our-journey', label: 'Our Journey & Milestones' },
      { id: 'our-community', label: 'Our Community' },
      { id: 'why-kesari', label: 'Why Kesari?' },
    ],
  },
  connect: {
    title: 'Connect With Us',
    subPages: [
      { id: 'contact-us', label: 'Contact Us' },
      { id: 'collaborate', label: 'Collaborate With Us' },
      { id: 'partner', label: 'Partner With Kesari' },
      { id: 'join-artists', label: 'Join Our Artist Community' },
      { id: 'corporate', label: 'Corporate Enquiries' },
    ],
  },
  help: {
    title: 'Help & Information',
    subPages: [
      { id: 'faq', label: 'Frequently Asked Questions' },
      { id: 'booking-payment', label: 'Booking & Payment Information' },
      { id: 'cancellation-refund', label: 'Cancellation & Refund Policy' },
      { id: 'terms', label: 'Terms & Conditions' },
      { id: 'privacy', label: 'Privacy Policy' },
    ],
  },
};

export const StudioPagesView: React.FC<StudioPagesViewProps> = ({
  section,
  subPage,
  onSelectSubPage,
  onBackToHome,
  onSelectSection,
}) => {
  const [copied, setCopied] = React.useState(false);
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);

  const currentSectionConfig = STUDIO_PAGES_CONFIG[section];
  const currentSubPageConfig =
    currentSectionConfig.subPages.find((sp) => sp.id === subPage) ||
    currentSectionConfig.subPages[0];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Render Sub-Page Content ──────────────────────────────────────────────
  const renderContent = () => {
    // ── PAGE 1: ABOUT KESARI ──
    if (section === 'about') {
      if (subPage === 'our-story') {
        return (
          <article className="space-y-6 max-w-2xl">
            <header className="space-y-2">
              <span className="text-xs font-semibold text-[#D8FF48] tracking-widest uppercase">
                The Origin
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
                Our Story
              </h1>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed font-normal pt-1">
                Kesari – The Memory Studio was born in Koramangala, Bengaluru, out of a simple need:
                an intimate, honest room where sound isn't lost in cavernous halls and where
                audiences and performers share genuine connection.
              </p>
            </header>

            <div className="space-y-4 text-sm text-white/70 leading-relaxed border-t border-white/10 pt-4">
              <p>
                In a city buzzing with commercial clubs and rushed gigs, we set out to create a sanctuary.
                A space designed from the ground up for acoustic honesty—whether it's an unplugged acoustic
                set, a raw spoken-word performance, or a quiet storytelling evening.
              </p>
              <p>
                Every wall, diffuse panel, and seat at Kesari is arranged so that no listener feels farther
                than a whisper from the stage. Our motto is simple:
                <em className="text-white font-medium"> “Memories are made here.”</em>
              </p>
            </div>

            <section aria-label="Core Philosophy" className="p-5 rounded-2xl bg-white/4 border border-white/8 space-y-2">
              <h2 className="text-xs uppercase font-semibold text-white/50 tracking-wider">
                What We Believe
              </h2>
              <p className="text-sm text-white/90">
                Live music and performing arts should feel personal. When you enter Kesari, you're not just
                attending an event; you're part of an intimate listening community.
              </p>
            </section>
          </article>
        );
      }

      if (subPage === 'meet-the-founder') {
        return (
          <article className="space-y-6 max-w-2xl">
            <header className="space-y-2">
              <span className="text-xs font-semibold text-[#D8FF48] tracking-widest uppercase">
                Leadership & Vision
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
                Meet the Founder
              </h1>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed font-normal pt-1">
                Passionate about sound fidelity, performing arts, and independent creators in India.
              </p>
            </header>

            <div className="space-y-4 text-sm text-white/70 leading-relaxed border-t border-white/10 pt-4">
              <p>
                Kesari was conceptualized by sound enthusiasts and event curators who spent over a decade
                organizing independent live events across India. Frustrated by venues that treat artists as
                background noise, the founders built Kesari as the venue they always wished existed.
              </p>
              <blockquote className="p-4 rounded-xl bg-white/4 border border-white/8 space-y-1">
                <p className="text-xs text-[#D8FF48] font-semibold not-italic">Founder's Philosophy</p>
                <p className="text-xs sm:text-sm text-white/80 italic">
                  "Give an artist an attentive room and pristine audio, and magic happens on its own.
                  Kesari is designed to be Bengaluru's most respectful listening room."
                </p>
              </blockquote>
            </div>
          </article>
        );
      }

      if (subPage === 'our-journey') {
        return (
          <article className="space-y-6 max-w-2xl">
            <header className="space-y-2">
              <span className="text-xs font-semibold text-[#D8FF48] tracking-widest uppercase">
                Milestones
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
                Our Journey & Milestones
              </h1>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed font-normal pt-1">
                How an intimate listening studio became a premier destination for independent creators in Bengaluru.
              </p>
            </header>

            <div className="space-y-3.5 border-t border-white/10 pt-4">
              {[
                {
                  period: 'Phase 1: The Studio Launch',
                  desc: 'Opened our doors at #33, 60 Feet Road, Koramangala 5th Block, custom-tuning room acoustics for acoustic sessions and open mics.',
                },
                {
                  period: 'Phase 2: 500+ Intimate Showcases',
                  desc: 'Hosted 500+ independent music shows, comedy specials, poetry slams, and creator workshops.',
                },
                {
                  period: 'Phase 3: 4K Broadcast AV Suite',
                  desc: 'Installed dedicated multi-camera video capture and multitrack audio recording for artists to release studio-grade live videos.',
                },
                {
                  period: 'Phase 4: Full Venue Experience',
                  desc: 'Expanded with on-site cafe, changing rooms, separate washrooms, elevator access, and our signature gifting section.',
                },
              ].map((item, i) => (
                <section key={i} className="p-4 rounded-xl bg-white/4 border border-white/8 space-y-1">
                  <h2 className="text-xs font-semibold text-[#D8FF48]">{item.period}</h2>
                  <p className="text-xs sm:text-sm text-white/70">{item.desc}</p>
                </section>
              ))}
            </div>
          </article>
        );
      }

      if (subPage === 'our-community') {
        return (
          <article className="space-y-6 max-w-2xl">
            <header className="space-y-2">
              <span className="text-xs font-semibold text-[#D8FF48] tracking-widest uppercase">
                People of Kesari
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
                Our Community
              </h1>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed font-normal pt-1">
                A warm, diverse collective of musicians, poets, comedians, storytellers, and patrons.
              </p>
            </header>

            <div className="space-y-4 text-sm text-white/70 leading-relaxed border-t border-white/10 pt-4">
              <p>
                The Kesari Community brings together over 1,200 artists and thousands of audience members who
                appreciate real talent. We believe in fair compensation for artists, zero harassment, and
                providing early-stage artists the same stage care as touring headliners.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-xl bg-white/4 border border-white/8 text-center">
                  <p className="text-2xl font-bold text-white">1,200+</p>
                  <p className="text-xs text-white/50 mt-1">Artists Hosted</p>
                </div>
                <div className="p-4 rounded-xl bg-white/4 border border-white/8 text-center">
                  <p className="text-2xl font-bold text-[#D8FF48]">10,000+</p>
                  <p className="text-xs text-white/50 mt-1">Audience Patrons</p>
                </div>
              </div>
            </div>
          </article>
        );
      }

      if (subPage === 'why-kesari') {
        return (
          <article className="space-y-6 max-w-2xl">
            <header className="space-y-2">
              <span className="text-xs font-semibold text-[#D8FF48] tracking-widest uppercase">
                The Distinction
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
                Why Kesari?
              </h1>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed font-normal pt-1">
                Why artists and guests choose Kesari over ordinary commercial venues in Bangalore.
              </p>
            </header>

            <div className="space-y-3 border-t border-white/10 pt-4">
              {[
                { title: 'Acoustic Precision', desc: 'Custom sound diffusion baffles and digital mixing console ensure pristine sound without harsh echo.' },
                { title: 'Intimate Boutique Capacity', desc: '60–100 pax capacity ensures every seat feels up close and personal.' },
                { title: 'Full Amenities On-Site', desc: 'Dedicated changing rooms, clean separate washrooms, in-house cafe, drinks, lift access, and gifting section.' },
                { title: '4K Multi-Cam Capture', desc: 'Optional broadcast-grade video and audio recording so your event can be shared with the world.' },
                { title: 'Prime Koramangala Location', desc: 'Conveniently located on 60 Feet Road, 5th Block, with easy access across Bangalore.' },
              ].map((item, i) => (
                <section key={i} className="p-4 rounded-xl bg-white/4 border border-white/8 space-y-1">
                  <h2 className="text-sm font-semibold text-white">{item.title}</h2>
                  <p className="text-xs sm:text-sm text-white/70">{item.desc}</p>
                </section>
              ))}
            </div>
          </article>
        );
      }
    }

    // ── PAGE 2: CONNECT WITH US ──
    if (section === 'connect') {
      if (subPage === 'contact-us') {
        return (
          <article className="space-y-6 max-w-2xl">
            <header className="space-y-2">
              <span className="text-xs font-semibold text-[#D8FF48] tracking-widest uppercase">
                Get In Touch
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
                Come say hello!
              </h1>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed font-normal pt-1">
                We'd love to hear from you. Visit our Koramangala studio or reach out directly.
              </p>
            </header>

            <div className="space-y-4 border-t border-white/10 pt-4">
              {/* Address card */}
              <section aria-label="Venue Address" className="p-5 rounded-2xl bg-white/4 border border-white/8 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <MapPin size={15} className="text-[#D8FF48]" />
                      <h2 className="text-xs font-semibold text-white uppercase tracking-wider">
                        Kesari – The Memory Studio
                      </h2>
                    </div>
                    <p className="text-sm sm:text-base text-white/90 font-medium pl-6 leading-relaxed">
                      #33, 60 Feet Road, KHB Colony, 5th Block, Koramangala, Bengaluru – 560095
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        '#33, 60 Feet Road, KHB Colony, 5th Block, Koramangala, Bengaluru – 560095'
                      )
                    }
                    className="min-w-[44px] min-h-[44px] rounded-xl bg-white/8 hover:bg-white/14 text-white/70 transition-colors shrink-0 flex items-center justify-center"
                    title="Copy address"
                    aria-label="Copy venue address"
                  >
                    {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                  </button>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-white/6 pl-6 text-xs text-white/60">
                  <span>Open 10:00 AM – 11:30 PM daily</span>
                </div>
              </section>

              {/* Direct phone and email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href="tel:+917760539955"
                  className="p-4 min-h-[56px] rounded-xl bg-white/4 hover:bg-white/8 border border-white/8 transition-colors flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-[11px] text-white/50 uppercase font-medium">Call / WhatsApp</p>
                    <p className="text-sm sm:text-base font-semibold text-white">77605 39955</p>
                  </div>
                </a>

                <a
                  href="mailto:Kesari.memory@gmail.com"
                  className="p-4 min-h-[56px] rounded-xl bg-white/4 hover:bg-white/8 border border-white/8 transition-colors flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-[11px] text-white/50 uppercase font-medium">Email</p>
                    <p className="text-sm sm:text-base font-semibold text-white truncate">
                      Kesari.memory@gmail.com
                    </p>
                  </div>
                </a>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href="https://wa.me/917760539955?text=Hi%20Kesari,%20I%20would%20like%20to%20enquire%20about%20the%20studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-h-[48px] px-4 rounded-xl bg-green-600 hover:bg-green-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageSquare size={16} />
                  <span>Chat on WhatsApp</span>
                </a>
                <a
                  href="https://share.google/1gcic7zhVrOJJYs4O"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-h-[48px] px-4 rounded-xl bg-white/10 hover:bg-white/16 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors border border-white/10"
                >
                  <ExternalLink size={16} />
                  <span>Open in Google Maps</span>
                </a>
              </div>
            </div>
          </article>
        );
      }

      if (subPage === 'collaborate') {
        return (
          <article className="space-y-6 max-w-2xl">
            <header className="space-y-2">
              <span className="text-xs font-semibold text-[#D8FF48] tracking-widest uppercase">
                Co-Creation
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
                Collaborate With Us
              </h1>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed font-normal pt-1">
                For creative collectives, festival curators, and indie record labels.
              </p>
            </header>

            <div className="space-y-4 text-sm text-white/70 leading-relaxed border-t border-white/10 pt-4">
              <p>
                We co-curate recurring events, intimate album launch listening parties, poetry festivals, and
                creative salons. If you have a concept and a passionate following, Kesari provides the stage,
                sound production, and ticketing support.
              </p>
              <section aria-label="Collaboration Tracks" className="p-4 rounded-xl bg-white/4 border border-white/8 space-y-2">
                <h2 className="text-xs font-semibold text-white">Collaboration Tracks:</h2>
                <ul className="text-xs sm:text-sm space-y-1.5 text-white/80 list-disc list-inside">
                  <li>Album Listening Sessions & Release Gigs</li>
                  <li>Curated Poetry & Spoken Word Slams</li>
                  <li>Independent Theatre & Monologue Evenings</li>
                  <li>Hobbyist & Board Game Communities</li>
                </ul>
              </section>
              <a
                href="https://wa.me/917760539955?text=Hi%20Kesari,%20I%20have%20an%20event%20concept%20to%20collaborate%20on"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#D8FF48] text-black font-semibold text-sm hover:bg-[#cbf536] transition-colors"
              >
                Propose a Concept on WhatsApp
              </a>
            </div>
          </article>
        );
      }

      if (subPage === 'partner') {
        return (
          <article className="space-y-6 max-w-2xl">
            <header className="space-y-2">
              <span className="text-xs font-semibold text-[#D8FF48] tracking-widest uppercase">
                Sponsorships
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
                Partner With Kesari
              </h1>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed font-normal pt-1">
                Brand alliances, gear sponsorships, and experiential cultural partnerships in Bengaluru.
              </p>
            </header>

            <div className="space-y-4 text-sm text-white/70 leading-relaxed border-t border-white/10 pt-4">
              <p>
                Connect your brand with an engaged, tastemaker audience of young creators, artists, and culture
                enthusiasts in Bengaluru.
              </p>
              <div className="space-y-2 text-xs sm:text-sm text-white/75">
                <section className="p-3.5 rounded-lg bg-white/4 border border-white/8">
                  • <strong>Audio & Gear Partners:</strong> Showcase microphones, instruments, and audio gear in an acoustically tuned room.
                </section>
                <section className="p-3.5 rounded-lg bg-white/4 border border-white/8">
                  • <strong>Beverage & Snack Sampling:</strong> Feature products in our in-house cafe and gifting section.
                </section>
                <section className="p-3.5 rounded-lg bg-white/4 border border-white/8">
                  • <strong>Digital Content Series:</strong> Title sponsor live session video releases on YouTube.
                </section>
              </div>
              <p className="text-xs text-white/60">
                Email our partnership desk at{' '}
                <a href="mailto:Kesari.memory@gmail.com?subject=Brand%20Partnership" className="text-white underline">
                  Kesari.memory@gmail.com
                </a>
              </p>
            </div>
          </article>
        );
      }

      if (subPage === 'join-artists') {
        return (
          <article className="space-y-6 max-w-2xl">
            <header className="space-y-2">
              <span className="text-xs font-semibold text-[#D8FF48] tracking-widest uppercase">
                Stage Opportunities
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
                Join Our Artist Community
              </h1>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed font-normal pt-1">
                Perform, rehearse, or tour at Bengaluru's favorite room.
              </p>
            </header>

            <div className="space-y-4 text-sm text-white/70 leading-relaxed border-t border-white/10 pt-4">
              <p>
                We welcome independent musicians, touring acts, poets, stand-up comedians, and storytellers.
                We provide professional stage support, dedicated sound engineer, and fair ticketing splits.
              </p>
              <section aria-label="Artist Benefits" className="p-4 rounded-xl bg-white/4 border border-white/8 space-y-2 text-xs sm:text-sm text-white/80">
                <h2 className="font-semibold text-white">What Artists Receive:</h2>
                <p>• Transparent ticket split agreements</p>
                <p>• High-quality sound mix and stage monitors</p>
                <p>• Dedicated artist green room & private washroom</p>
                <p>• Optional 4K multi-cam live recording</p>
              </section>
              <a
                href="https://wa.me/917760539955?text=Hi%20Kesari,%20I%20am%20an%20artist%20and%20would%20like%20to%20perform%20at%20your%20venue"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#D8FF48] text-black font-semibold text-sm hover:bg-[#cbf536] transition-colors"
              >
                Apply to Perform
              </a>
            </div>
          </article>
        );
      }

      if (subPage === 'corporate') {
        return (
          <article className="space-y-6 max-w-2xl">
            <header className="space-y-2">
              <span className="text-xs font-semibold text-[#D8FF48] tracking-widest uppercase">
                Private Bookings
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
                Corporate Enquiries
              </h1>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed font-normal pt-1">
                Team offsites, town halls, private celebrations, and brand launches in Koramangala.
              </p>
            </header>

            <div className="space-y-4 text-sm text-white/70 leading-relaxed border-t border-white/10 pt-4">
              <p>
                Host your company offsite or annual celebration in a refreshing, creative space rather than a generic
                hotel banquet hall.
              </p>
              <section aria-label="Corporate Amenities" className="p-4 rounded-xl bg-white/4 border border-white/8 space-y-2 text-xs sm:text-sm text-white/80">
                <h2 className="font-semibold text-white">Corporate Package Includes:</h2>
                <p>• Full private studio buyout</p>
                <p>• HD presentation projector and wireless handheld mics</p>
                <p>• High-speed fiber internet for hybrid calls</p>
                <p>• Food & beverage catering options</p>
                <p>• Live acoustic music or stand-up comedy booking upon request</p>
              </section>
              <a
                href="mailto:Kesari.memory@gmail.com?subject=Corporate%20Enquiry%20-%20Venue%20Booking"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/16 text-white font-semibold text-sm transition-colors border border-white/10"
              >
                Email Corporate Desk
              </a>
            </div>
          </article>
        );
      }
    }

    // ── PAGE 3: HELP & INFORMATION ──
    if (section === 'help') {
      if (subPage === 'faq') {
        const faqs = [
          {
            q: 'What is the venue capacity?',
            a: 'Comfortably seats 60–80 guests theater style, and accommodates up to 100–120 in informal standing/networking formats.',
          },
          {
            q: 'What audio gear is included?',
            a: 'Allen & Heath digital mixer, Shure wireless and vocal microphones, stage monitors, DIs, acoustic guitar, and keyboard.',
          },
          {
            q: 'Where is Kesari located?',
            a: '#33, 60 Feet Road, KHB Colony, 5th Block, Koramangala, Bengaluru – 560095.',
          },
          {
            q: 'Is parking available?',
            a: 'Street parking is readily available along 60 Feet Road and in adjacent KHB Colony parking bays.',
          },
          {
            q: 'Can we bring outside catering?',
            a: 'We have an in-house cafe and beverage menu. Outside catering can be arranged for full private venue buyouts upon prior agreement.',
          },
          {
            q: 'Are lift and changing room facilities available?',
            a: 'Yes, our premises include elevator/lift access, dedicated changing rooms, and separate clean washrooms.',
          },
        ];

        return (
          <article className="space-y-6 max-w-2xl">
            <header className="space-y-2">
              <span className="text-xs font-semibold text-[#D8FF48] tracking-widest uppercase">
                Knowledge Base
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
                Frequently Asked Questions
              </h1>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed font-normal pt-1">
                Everything you need to know about attending or organizing an event at Kesari Studio Koramangala.
              </p>
            </header>

            <div className="space-y-2.5 border-t border-white/10 pt-4">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <section
                    key={idx}
                    className="rounded-xl border border-white/8 bg-white/4 overflow-hidden transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full min-h-[48px] p-4 text-left flex items-center justify-between gap-3 text-sm font-semibold text-white hover:text-[#D8FF48] transition-colors"
                      aria-expanded={isOpen}
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        size={16}
                        className={`text-white/40 transition-transform ${isOpen ? 'rotate-180 text-white' : ''}`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-white/70 leading-relaxed border-t border-white/6">
                        {faq.a}
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          </article>
        );
      }

      if (subPage === 'booking-payment') {
        return (
          <article className="space-y-6 max-w-2xl">
            <header className="space-y-2">
              <span className="text-xs font-semibold text-[#D8FF48] tracking-widest uppercase">
                Payment Info
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
                Booking & Payment Information
              </h1>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed font-normal pt-1">
                Simple slot scheduling, advance deposit policy, and accepted payment modes.
              </p>
            </header>

            <div className="space-y-3 border-t border-white/10 pt-4 text-xs sm:text-sm text-white/75">
              <section className="p-4 rounded-xl bg-white/4 border border-white/8 space-y-1">
                <h2 className="font-semibold text-white">1. Slot Timings</h2>
                <p className="text-white/70">
                  Morning (9 AM – 1 PM) · Afternoon (1:30 PM – 5:30 PM) · Prime Evening (6 PM – 11:30 PM) · Full Day buyout
                </p>
              </section>
              <section className="p-4 rounded-xl bg-white/4 border border-white/8 space-y-1">
                <h2 className="font-semibold text-white">2. 50% Advance Confirmation</h2>
                <p className="text-white/70">
                  A 50% advance deposit is required to lock dates on our public calendar. Balance is settled on event day.
                </p>
              </section>
              <section className="p-4 rounded-xl bg-white/4 border border-white/8 space-y-1">
                <h2 className="font-semibold text-white">3. Payment Methods</h2>
                <p className="text-white/70">
                  UPI (GPay, PhonePe, Paytm), Credit & Debit Cards, Net Banking, and Bank Transfer.
                </p>
              </section>
              <section className="p-4 rounded-xl bg-white/4 border border-white/8 space-y-1">
                <h2 className="font-semibold text-white">4. Official GST Invoices</h2>
                <p className="text-white/70">
                  Tax compliant invoices with company GSTIN provided for corporate and business reimbursements.
                </p>
              </section>
            </div>
          </article>
        );
      }

      if (subPage === 'cancellation-refund') {
        return (
          <article className="space-y-6 max-w-2xl">
            <header className="space-y-2">
              <span className="text-xs font-semibold text-[#D8FF48] tracking-widest uppercase">
                Policy
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
                Cancellation & Refund Policy
              </h1>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed font-normal pt-1">
                Transparent and fair cancellation policies for organizers and ticket holders.
              </p>
            </header>

            <div className="space-y-3 border-t border-white/10 pt-4">
              <section className="p-4 rounded-xl bg-white/4 border border-white/8 space-y-1">
                <h2 className="text-xs sm:text-sm font-semibold text-green-400">7 or More Days Prior</h2>
                <p className="text-xs sm:text-sm text-white/70">
                  100% refund of deposit (less 3% payment gateway fee), or free date transfer.
                </p>
              </section>
              <section className="p-4 rounded-xl bg-white/4 border border-white/8 space-y-1">
                <h2 className="text-xs sm:text-sm font-semibold text-amber-400">3 to 6 Days Prior</h2>
                <p className="text-xs sm:text-sm text-white/70">
                  50% cash refund, or 100% credit applied toward rescheduling within 60 days.
                </p>
              </section>
              <section className="p-4 rounded-xl bg-white/4 border border-white/8 space-y-1">
                <h2 className="text-xs sm:text-sm font-semibold text-rose-400">Under 48 Hours</h2>
                <p className="text-xs sm:text-sm text-white/70">
                  Non-refundable due to stage crew reservation; 1 reschedule permitted with a date-change fee.
                </p>
              </section>
            </div>
          </article>
        );
      }

      if (subPage === 'terms') {
        return (
          <article className="space-y-6 max-w-2xl">
            <header className="space-y-2">
              <span className="text-xs font-semibold text-[#D8FF48] tracking-widest uppercase">
                Code & Rules
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
                Terms & Conditions
              </h1>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed font-normal pt-1">
                Ensuring a safe, respectful environment for all artists and guests.
              </p>
            </header>

            <div className="space-y-3 text-xs sm:text-sm text-white/75 border-t border-white/10 pt-4">
              <p>• <strong>Safe Space:</strong> Zero tolerance for discrimination, harassment, or verbal abuse. Violators will be removed immediately without refund.</p>
              <p>• <strong>Sound Standards:</strong> In compliance with civic noise guidelines, high-volume amplification concludes at 10:30 PM.</p>
              <p>• <strong>Venue Care:</strong> Organizers are responsible for any intentional equipment or furnishing damage caused during their slot.</p>
              <p>• <strong>Timings:</strong> Hall access is granted 45 minutes prior to slot start for soundcheck; teardown must conclude within 30 minutes of event end.</p>
            </div>
          </article>
        );
      }

      if (subPage === 'privacy') {
        return (
          <article className="space-y-8 max-w-3xl text-white/85 leading-relaxed">
            <header className="space-y-3 pb-6 border-b border-white/10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#D8FF48]/10 text-[#D8FF48] border border-[#D8FF48]/20 tracking-wider uppercase">
                  Legal &amp; Privacy
                </span>
                <span className="text-xs text-white/50">
                  Effective &amp; Last Updated: 24 November 2026
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
                Privacy Policy
              </h1>
              <p className="text-sm sm:text-base text-white/70">
                Kesari – The Memory Studio ("Kesari", "we", "our" or "us")
              </p>
            </header>

            {/* 1. Introduction */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight flex items-center gap-2">
                <span className="text-[#D8FF48]">1.</span> Introduction
              </h2>
              <p className="text-xs sm:text-sm text-white/80">
                Welcome to Kesari – The Memory Studio ("Kesari", "we", "our" or "us").
              </p>
              <p className="text-xs sm:text-sm text-white/80">
                At Kesari, we value the trust you place in us when you visit our website, enquire about our services, book our spaces, register for events or interact with our team.
              </p>
              <p className="text-xs sm:text-sm text-white/80">
                This Privacy Policy explains how we collect, use, store, process and protect your personal information when you visit our website or engage with our services.
              </p>
              <p className="text-xs sm:text-sm text-white/80">
                By accessing or using our website and services, you acknowledge that you have read this Privacy Policy.
              </p>
            </section>

            {/* 2. Information We May Collect */}
            <section className="space-y-4">
              <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight flex items-center gap-2">
                <span className="text-[#D8FF48]">2.</span> Information We May Collect
              </h2>
              <p className="text-xs sm:text-sm text-white/80">
                Depending on how you interact with Kesari, we may collect the following information:
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                  <h3 className="text-xs sm:text-sm font-semibold text-white">A. Personal Information</h3>
                  <ul className="text-xs text-white/75 space-y-1 list-disc list-inside">
                    <li>Full name</li>
                    <li>Mobile number and WhatsApp number</li>
                    <li>Email address</li>
                    <li>City or location</li>
                    <li>Contact details shared through enquiry forms or direct communication</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                  <h3 className="text-xs sm:text-sm font-semibold text-white">B. Booking &amp; Transaction Information</h3>
                  <ul className="text-xs text-white/75 space-y-1 list-disc list-inside">
                    <li>Event and venue booking details</li>
                    <li>Preferred dates and timings</li>
                    <li>Number of attendees or guests</li>
                    <li>Event requirements and preferences</li>
                    <li>Payment confirmation &amp; transaction references</li>
                    <li>Billing details, where applicable</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                  <h3 className="text-xs sm:text-sm font-semibold text-white">C. Event &amp; Registration Information</h3>
                  <p className="text-xs text-white/75">
                    When you register for or participate in events, workshops, performances, community gatherings or other activities at Kesari, we may collect relevant registration and participation details.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                  <h3 className="text-xs sm:text-sm font-semibold text-white">D. Website &amp; Technical Information</h3>
                  <ul className="text-xs text-white/75 space-y-1 list-disc list-inside">
                    <li>IP address</li>
                    <li>Browser and device information</li>
                    <li>Pages visited and time spent on the website</li>
                    <li>Website usage patterns</li>
                    <li>Cookies and similar technologies, where enabled</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 3. How We Use Your Information */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight flex items-center gap-2">
                <span className="text-[#D8FF48]">3.</span> How We Use Your Information
              </h2>
              <p className="text-xs sm:text-sm text-white/80">
                We use the information collected for legitimate business and service-related purposes, including:
              </p>
              <ul className="text-xs sm:text-sm text-white/75 space-y-1.5 list-disc list-inside pl-1">
                <li>Responding to enquiries and providing information about Kesari.</li>
                <li>Managing venue bookings and event reservations.</li>
                <li>Processing booking confirmations and payments.</li>
                <li>Communicating event schedules, updates and important announcements.</li>
                <li>Coordinating workshops, performances, community events and private celebrations.</li>
                <li>Providing information about our cafe, venue rental, event management, sound system rental and corporate gifting services.</li>
                <li>Sharing relevant updates, offers, promotions and upcoming event information, where permitted.</li>
                <li>Improving our website, services and customer experience.</li>
                <li>Maintaining business, accounting and transaction records.</li>
                <li>Preventing misuse, fraud and unauthorised activities.</li>
                <li>Complying with applicable legal and regulatory requirements.</li>
              </ul>
            </section>

            {/* 4. Communication and Marketing */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight flex items-center gap-2">
                <span className="text-[#D8FF48]">4.</span> Communication and Marketing
              </h2>
              <p className="text-xs sm:text-sm text-white/80">
                If you share your contact details with us, Kesari may communicate with you regarding your enquiries, bookings, registrations and services.
              </p>
              <p className="text-xs sm:text-sm text-white/80">
                With your permission, we may also send information about upcoming events, live performances, workshops, special experiences, promotions and other updates from Kesari.
              </p>
              <p className="text-xs sm:text-sm text-white/80">
                You may opt out of promotional communications at any time by contacting us or using the unsubscribe facility, wherever available.
              </p>
              <p className="text-xs sm:text-sm text-white/60 italic">
                Please note that opting out of promotional messages will not prevent us from sending essential communications relating to an existing booking or transaction.
              </p>
            </section>

            {/* 5. Sharing of Information */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight flex items-center gap-2">
                <span className="text-[#D8FF48]">5.</span> Sharing of Information
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-white">
                Kesari respects your privacy and does not sell your personal information to third parties.
              </p>
              <p className="text-xs sm:text-sm text-white/80">
                We may share relevant information only where reasonably necessary for business operations, service delivery or legal compliance, including with:
              </p>
              <ul className="text-xs sm:text-sm text-white/75 space-y-1.5 list-disc list-inside pl-1">
                <li>Payment processing partners and financial institutions.</li>
                <li>Website hosting, technology and IT service providers.</li>
                <li>Event ticketing, registration and booking platforms, where applicable.</li>
                <li>Communication and customer-support service providers.</li>
                <li>Event partners, organisers or service providers where sharing is necessary to fulfil a booking or event-related requirement.</li>
                <li>Government authorities or regulatory bodies where legally required.</li>
              </ul>
              <p className="text-xs sm:text-sm text-white/70">
                Any such sharing will be limited to the relevant purpose and subject to applicable legal requirements.
              </p>
            </section>

            {/* 6. Cookies and Website Tracking */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight flex items-center gap-2">
                <span className="text-[#D8FF48]">6.</span> Cookies and Website Tracking
              </h2>
              <p className="text-xs sm:text-sm text-white/80">
                Our website may use cookies and similar technologies to improve website functionality, understand visitor behaviour and enhance the browsing experience. Cookies may help us:
              </p>
              <ul className="text-xs sm:text-sm text-white/75 space-y-1.5 list-disc list-inside pl-1">
                <li>Remember user preferences.</li>
                <li>Understand website traffic and performance.</li>
                <li>Analyse which pages and services visitors find useful.</li>
                <li>Improve website functionality and navigation.</li>
              </ul>
              <p className="text-xs sm:text-sm text-white/80">
                You may manage or disable cookies through your browser settings. Please note that disabling certain cookies may affect some website features. Where required, we will seek appropriate consent for non-essential cookies and tracking technologies.
              </p>
            </section>

            {/* 7. Data Security */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight flex items-center gap-2">
                <span className="text-[#D8FF48]">7.</span> Data Security
              </h2>
              <p className="text-xs sm:text-sm text-white/80">
                We take reasonable measures to protect the personal information shared with us against unauthorised access, misuse, alteration, disclosure or loss. We aim to work with appropriate security practices and service providers to safeguard information.
              </p>
              <p className="text-xs sm:text-sm text-white/70">
                However, no method of electronic transmission or digital storage can be guaranteed to be completely secure.
              </p>
            </section>

            {/* 8. Data Retention */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight flex items-center gap-2">
                <span className="text-[#D8FF48]">8.</span> Data Retention
              </h2>
              <p className="text-xs sm:text-sm text-white/80">
                We retain personal information only for as long as reasonably necessary to fulfil the purposes for which it was collected, including booking management, customer communication, accounting, legal compliance and legitimate business requirements.
              </p>
              <p className="text-xs sm:text-sm text-white/80">
                When the information is no longer required, we will take appropriate steps to delete or anonymise it, subject to applicable legal retention requirements.
              </p>
            </section>

            {/* 9. Children's Privacy */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight flex items-center gap-2">
                <span className="text-[#D8FF48]">9.</span> Children's Privacy
              </h2>
              <p className="text-xs sm:text-sm text-white/80">
                Kesari welcomes families and may host activities and events suitable for children.
              </p>
              <p className="text-xs sm:text-sm text-white/80">
                However, our website and online services are not intended to independently collect personal information directly from children without appropriate parental or legal guardian involvement.
              </p>
              <p className="text-xs sm:text-sm text-white/80">
                Where information relating to a child is required for an event, registration or booking, it should be provided by the child's parent or legal guardian, in accordance with applicable law.
              </p>
            </section>

            {/* 10. Third-Party Websites and Platforms */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight flex items-center gap-2">
                <span className="text-[#D8FF48]">10.</span> Third-Party Websites and Platforms
              </h2>
              <p className="text-xs sm:text-sm text-white/80">
                Our website or communications may contain links to third-party websites and platforms, including social media networks, event registration platforms, ticketing services and payment gateways.
              </p>
              <p className="text-xs sm:text-sm text-white/80">
                These platforms operate independently and have their own privacy policies and practices.
              </p>
              <p className="text-xs sm:text-sm text-white/80">
                Kesari is not responsible for the privacy practices, security or content of third-party websites. We encourage visitors to review their respective privacy policies before sharing personal information.
              </p>
            </section>

            {/* 11. Your Privacy Rights */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight flex items-center gap-2">
                <span className="text-[#D8FF48]">11.</span> Your Privacy Rights
              </h2>
              <p className="text-xs sm:text-sm text-white/80">
                Subject to applicable laws, you may have the right to:
              </p>
              <ul className="text-xs sm:text-sm text-white/75 space-y-1.5 list-disc list-inside pl-1">
                <li>Request information about the personal data we hold about you.</li>
                <li>Request correction or updating of inaccurate information.</li>
                <li>Request deletion of personal information, where legally permissible.</li>
                <li>Withdraw consent for activities based on consent.</li>
                <li>Opt out of promotional communication.</li>
                <li>Raise concerns or complaints regarding the handling of your personal information.</li>
              </ul>
              <p className="text-xs sm:text-sm text-white/80">
                To exercise these rights, please contact us using the details provided below.
              </p>
            </section>

            {/* 12. Changes to This Privacy Policy */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight flex items-center gap-2">
                <span className="text-[#D8FF48]">12.</span> Changes to This Privacy Policy
              </h2>
              <p className="text-xs sm:text-sm text-white/80">
                Kesari reserves the right to update or modify this Privacy Policy from time to time to reflect changes in our business practices, website functionality, technology or applicable legal requirements.
              </p>
              <p className="text-xs sm:text-sm text-white/80">
                Any revised version will be published on this page along with the updated revision date. We encourage visitors to review this page periodically.
              </p>
            </section>

            {/* 13. Contact Us */}
            <section className="space-y-4 pt-2">
              <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight flex items-center gap-2">
                <span className="text-[#D8FF48]">13.</span> Contact Us
              </h2>
              <p className="text-xs sm:text-sm text-white/80">
                For questions, concerns, requests or complaints relating to this Privacy Policy or the handling of your personal information, please contact:
              </p>

              <div className="p-5 rounded-2xl bg-[#0E0F14] border border-white/10 space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-white">Kesari – The Memory Studio</h3>
                  <p className="text-xs text-white/70 mt-1 flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#D8FF48] shrink-0 mt-0.5" />
                    <span>
                      #33, 60 Feet Road, KHB Colony, 3rd Floor, 5th Block, Koramangala, Bengaluru – 560095, Karnataka, India.
                    </span>
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 pt-1">
                  <a
                    href="mailto:kesari.memory@gmail.com"
                    className="inline-flex items-center gap-2 text-xs font-medium text-white px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#D8FF48]" />
                    <span>kesari.memory@gmail.com</span>
                  </a>
                  <a
                    href="tel:+917760539955"
                    className="inline-flex items-center gap-2 text-xs font-medium text-white px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#D8FF48]" />
                    <span>+91 77605 39955</span>
                  </a>
                </div>

                <p className="text-xs text-white/60 border-t border-white/5 pt-3">
                  We will make reasonable efforts to address privacy-related enquiries and concerns in accordance with applicable laws.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-[#D8FF48]/10 via-[#F97316]/10 to-transparent border border-white/10 text-xs sm:text-sm text-white/85">
                <p className="font-medium text-white">Thank you for trusting Kesari – The Memory Studio.</p>
                <p className="text-white/70 text-xs mt-1">
                  We respect your privacy and value the trust that makes every experience at Kesari special.
                </p>
              </div>
            </section>
          </article>
        );
      }
    }

    return null;
  };

  return (
    <div className="space-y-4 sm:space-y-6 py-2 w-full max-w-full overflow-x-hidden">
      {/* Crawlable Semantic Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-white/50 overflow-x-auto no-scrollbar py-1">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onBackToHome();
          }}
          className="flex items-center gap-1 hover:text-white transition-colors shrink-0"
        >
          <Home size={12} />
          <span>Home</span>
        </a>
        <ChevronRight size={12} className="text-white/30 shrink-0" />
        <a
          href={`/${section}/${currentSectionConfig.subPages[0].id}`}
          onClick={(e) => {
            e.preventDefault();
            onSelectSection(section);
            onSelectSubPage(currentSectionConfig.subPages[0].id);
          }}
          className="hover:text-white transition-colors shrink-0"
        >
          {currentSectionConfig.title}
        </a>
        <ChevronRight size={12} className="text-white/30 shrink-0" />
        <span className="text-[#D8FF48] font-medium truncate shrink-0">
          {currentSubPageConfig.label}
        </span>
      </nav>

      {/* Top 3 Page Section Switcher (Accessible & Crawlable) */}
      <div className="flex items-center gap-2 border-b border-white/8 pb-3 overflow-x-auto no-scrollbar">
        {(
          [
            { id: 'about', label: 'About Kesari', path: '/about/our-story' },
            { id: 'connect', label: 'Connect With Us', path: '/connect/contact-us' },
            { id: 'help', label: 'Help & Information', path: '/help/faq' },
          ] as const
        ).map((s) => {
          const active = section === s.id;
          return (
            <a
              key={s.id}
              href={s.path}
              onClick={(e) => {
                e.preventDefault();
                onSelectSection(s.id);
                onSelectSubPage(STUDIO_PAGES_CONFIG[s.id].subPages[0].id);
              }}
              className={`min-h-[40px] flex items-center px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                active
                  ? 'bg-white text-black font-semibold'
                  : 'text-white/60 hover:text-white hover:bg-white/6'
              }`}
            >
              {s.label}
            </a>
          );
        })}
      </div>

      {/* Sub-Pages Pill Nav Bar (Touch friendly >= 44px) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        {currentSectionConfig.subPages.map((sp) => {
          const isActive = subPage === sp.id;
          return (
            <a
              key={sp.id}
              href={`/${section}/${sp.id}`}
              onClick={(e) => {
                e.preventDefault();
                onSelectSubPage(sp.id);
              }}
              className={`min-h-[42px] flex items-center px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-[#D8FF48] text-black font-semibold shadow-sm'
                  : 'bg-white/4 text-white/70 hover:text-white hover:bg-white/8 border border-white/8'
              }`}
            >
              {sp.label}
            </a>
          );
        })}
      </div>

      {/* Main Content Area */}
      <motion.div
        key={`${section}-${subPage}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        className="pt-2 w-full"
      >
        {renderContent()}
      </motion.div>
    </div>
  );
};
