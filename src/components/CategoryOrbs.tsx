import React from 'react';
import { EventCategory } from '../utils/studioLogic';

interface CategoryOrbsProps {
  selectedCategory: EventCategory | 'all';
  onSelectCategory: (cat: EventCategory | 'all') => void;
  onOpenOrganise?: () => void;
  onOpenAccessories?: () => void;
  onOpenEvents?: () => void;
  onOpenArtist?: () => void;
}

interface FeatureOrb {
  id: 'events' | 'organise' | 'accessories' | 'artist';
  title: string;
  badge: string;
  badgeColor: string;
  glowColor: string;
  gifFilter: string;
  hoverColor: string;
}

const FEATURE_ORBS: FeatureOrb[] = [
  {
    // Sphere 1: Electric Blue / Neon Sapphire (Matches Reference Image 1)
    id: 'events',
    title: 'Discover',
    badge: 'Upcoming Events',
    badgeColor: 'text-[#93C5FD] bg-[#1E40AF]/20 border border-[#3B82F6]/35',
    glowColor: 'rgba(37, 99, 235, 0.55)',
    gifFilter: 'contrast(115%) brightness(1.2) saturate(160%)',
    hoverColor: 'group-hover:text-[#60A5FA]',
  },
  {
    // Sphere 2: Warm Amber / Sunset Gold (Matches Reference Image 1)
    id: 'organise',
    title: 'Host With Us',
    badge: 'Event Bookings',
    badgeColor: 'text-[#FDE68A] bg-[#B45309]/20 border border-[#F59E0B]/35',
    glowColor: 'rgba(245, 158, 11, 0.50)',
    gifFilter: 'hue-rotate(152deg) contrast(115%) brightness(1.15) saturate(165%)',
    hoverColor: 'group-hover:text-[#FBBF24]',
  },
  {
    // Sphere 3: Mint Cyan / Emerald Teal (Matches Reference Image 1)
    id: 'accessories',
    title: 'Book Talent',
    badge: 'Artist Management',
    badgeColor: 'text-[#99F6E4] bg-[#0F766E]/20 border border-[#14B8A6]/35',
    glowColor: 'rgba(20, 184, 166, 0.50)',
    gifFilter: 'hue-rotate(240deg) contrast(118%) brightness(1.2) saturate(180%)',
    hoverColor: 'group-hover:text-[#2DD4BF]',
  },
  {
    // Sphere 4: Radiant Violet / Royal Purple (Matches Reference Image 1)
    id: 'artist',
    title: 'Event Extra',
    badge: 'Audio & Activity',
    badgeColor: 'text-[#E9D5FF] bg-[#6B21A8]/20 border border-[#A855F7]/35',
    glowColor: 'rgba(168, 85, 247, 0.55)',
    gifFilter: 'hue-rotate(55deg) contrast(118%) brightness(1.22) saturate(185%)',
    hoverColor: 'group-hover:text-[#C084FC]',
  },
];

export const CategoryOrbs: React.FC<CategoryOrbsProps> = ({
  selectedCategory,
  onSelectCategory,
  onOpenOrganise,
  onOpenAccessories,
  onOpenEvents,
  onOpenArtist,
}) => {
  const handleClick = (orbId: 'events' | 'organise' | 'accessories' | 'artist') => {
    if (orbId === 'events') {
      if (onOpenEvents) {
        onOpenEvents();
      } else {
        onSelectCategory(selectedCategory === 'all' ? 'nightlife' : 'all');
      }
    } else if (orbId === 'organise') {
      if (onOpenOrganise) {
        onOpenOrganise();
      }
    } else if (orbId === 'accessories') {
      if (onOpenAccessories) {
        onOpenAccessories();
      }
    } else if (orbId === 'artist') {
      if (onOpenArtist) {
        onOpenArtist();
      }
    }
  };

  return (
    <div
      className="grid grid-cols-4 gap-1 sm:gap-2.5 py-1 items-start w-full min-w-0"
      role="group"
      aria-label="Kesari Studio Feature Spheres"
    >
      {FEATURE_ORBS.map((orb) => (
        <button
          key={orb.id}
          type="button"
          onClick={() => handleClick(orb.id)}
          className="group relative flex flex-col items-center p-0.5 hover:scale-105 active:scale-95 transition-transform duration-200 focus-visible:outline-none w-full min-w-0"
        >
          {/* Borderless 3D Plasma Wave Energy Sphere Stage */}
          <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center shrink-0">
            {/* Soft Atmospheric Back Glow */}
            <div
              className="absolute w-9 h-9 sm:w-12 sm:h-12 rounded-full blur-md pointer-events-none opacity-85 group-hover:opacity-100 transition-opacity"
              style={{ background: orb.glowColor }}
            />

            {/* Seamless Natural Screen-Blended Plasma Wave Energy GIF */}
            <img
              src="/assets/plasma_sphere.gif"
              alt={orb.title}
              className="absolute w-[80px] sm:w-[136px] h-[60px] sm:h-[102px] max-w-none max-h-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-hover:scale-105"
              style={{
                mixBlendMode: 'screen',
                filter: orb.gifFilter,
              }}
            />
          </div>

          {/* Clean High-End Typography */}
          <div className="mt-1 text-center flex flex-col items-center w-full min-w-0 px-0.5">
            <span
              className={`text-[9.5px] sm:text-[11px] font-semibold text-white tracking-tight ${orb.hoverColor} transition-colors leading-tight text-center break-words`}
            >
              {orb.title}
            </span>
            <span
              className={`mt-1 px-1 sm:px-1.5 py-0.5 rounded-full text-[7px] sm:text-[8px] font-medium tracking-tight text-center leading-tight break-words max-w-full ${orb.badgeColor}`}
            >
              {orb.badge}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};
