import React from 'react';

// Single Shimmer Bar / Box primitive
export const SkeletonBox: React.FC<{
  className?: string;
  style?: React.CSSProperties;
}> = ({ className = '', style }) => (
  <div
    className={`skeleton-shimmer rounded-xl ${className}`}
    style={style}
    aria-hidden="true"
  />
);

// Home Screen Skeleton Loader
export const HomeSkeleton: React.FC = () => {
  return (
    <div className="space-y-7 sm:space-y-8 animate-fade-in" aria-label="Loading studio drops...">
      {/* 2-Column Split: Left (Orbs + Bento) & Right (Hero Card) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column Skeleton */}
        <div className="lg:col-span-5 space-y-5">
          {/* 3 Orbs Skeleton */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 py-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <SkeletonBox className="w-[60px] h-[60px] sm:w-[72px] sm:h-[72px] !rounded-full" />
                <SkeletonBox className="mt-2.5 w-16 h-3.5" />
                <SkeletonBox className="mt-1 w-12 h-3 !rounded-full" />
              </div>
            ))}
          </div>

          {/* Bento Metrics Skeleton */}
          <div className="grid grid-cols-2 gap-3">
            <div className="skeleton-card rounded-[26px] p-5 h-[178px] flex flex-col justify-between">
              <SkeletonBox className="w-20 h-4" />
              <div className="space-y-2">
                <SkeletonBox className="w-14 h-8" />
                <SkeletonBox className="w-24 h-3" />
              </div>
              <SkeletonBox className="w-full h-3" />
            </div>
            <div className="flex flex-col gap-3">
              <div className="skeleton-card rounded-[22px] px-4 py-3.5 h-[54px] flex items-center justify-between">
                <SkeletonBox className="w-16 h-4" />
                <SkeletonBox className="w-10 h-6 !rounded-full" />
              </div>
              <div className="skeleton-card rounded-[26px] p-4 flex-1 h-[108px] flex flex-col justify-between">
                <SkeletonBox className="w-20 h-3.5" />
                <SkeletonBox className="w-12 h-7" />
                <SkeletonBox className="w-full h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Card Skeleton */}
        <div className="lg:col-span-7">
          <div className="skeleton-card rounded-[32px] p-6 sm:p-8 min-h-[340px] sm:min-h-[380px] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <SkeletonBox className="w-36 h-6 !rounded-full" />
              <SkeletonBox className="w-10 h-10 !rounded-full" />
            </div>

            <div className="my-5 space-y-3">
              <SkeletonBox className="w-48 h-3.5" />
              <SkeletonBox className="w-4/5 h-8 sm:h-9" />
              <SkeletonBox className="w-1/2 h-5" />
              <SkeletonBox className="w-36 h-3.5" />
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <div className="space-y-1">
                <SkeletonBox className="w-20 h-3" />
                <SkeletonBox className="w-28 h-6" />
              </div>
              <div className="flex items-center gap-2">
                <SkeletonBox className="w-9 h-9 !rounded-full" />
                <SkeletonBox className="w-9 h-9 !rounded-full" />
                <SkeletonBox className="w-28 h-11 !rounded-full" />
              </div>
            </div>
          </div>

          <div className="mt-3 flex justify-center gap-1.5">
            <SkeletonBox className="w-6 h-1.5 !rounded-full" />
            <SkeletonBox className="w-1.5 h-1.5 !rounded-full" />
            <SkeletonBox className="w-1.5 h-1.5 !rounded-full" />
            <SkeletonBox className="w-1.5 h-1.5 !rounded-full" />
          </div>
        </div>
      </div>

      {/* Studio Lineup Filter Strip Skeleton */}
      <div className="flex items-center gap-2 overflow-hidden py-1">
        {[80, 96, 90, 110, 100].map((w, i) => (
          <SkeletonBox key={i} className="h-10 shrink-0 !rounded-full" style={{ width: `${w}px` }} />
        ))}
      </div>

      {/* Passes & Shows Horizontal Row Skeleton */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <SkeletonBox className="w-32 h-5" />
          <SkeletonBox className="w-20 h-4" />
        </div>
        <div className="flex items-stretch gap-3.5 overflow-hidden pb-1">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="skeleton-card w-[244px] sm:w-[264px] h-[300px] shrink-0 rounded-[30px] p-4 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <SkeletonBox className="w-24 h-4" />
                <div className="flex gap-1.5">
                  <SkeletonBox className="w-8 h-8 !rounded-full" />
                  <SkeletonBox className="w-8 h-8 !rounded-full" />
                </div>
              </div>
              <div className="skeleton-card rounded-[22px] p-3.5 space-y-2">
                <SkeletonBox className="w-24 h-3" />
                <SkeletonBox className="w-4/5 h-4" />
                <SkeletonBox className="w-1/2 h-3" />
                <div className="flex justify-between items-center pt-1">
                  <SkeletonBox className="w-16 h-4" />
                  <SkeletonBox className="w-12 h-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Feed List Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="skeleton-card rounded-[26px] p-3.5 flex items-center gap-3.5 h-[120px]"
          >
            <SkeletonBox className="w-24 h-24 sm:w-28 sm:h-24 rounded-[18px] shrink-0" />
            <div className="flex-1 space-y-2">
              <SkeletonBox className="w-32 h-3" />
              <SkeletonBox className="w-4/5 h-4" />
              <SkeletonBox className="w-1/2 h-3" />
              <div className="flex justify-between items-center pt-1">
                <SkeletonBox className="w-16 h-4" />
                <SkeletonBox className="w-16 h-7 !rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Search Tab Skeleton
export const SearchSkeleton: React.FC = () => (
  <div className="space-y-6 animate-fade-in" aria-label="Loading search...">
    <SkeletonBox className="w-full h-12 rounded-2xl" />
    <div className="flex gap-2 overflow-hidden">
      {[70, 90, 80, 100, 85].map((w, i) => (
        <SkeletonBox key={i} className="h-9 shrink-0 !rounded-full" style={{ width: `${w}px` }} />
      ))}
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="skeleton-card rounded-[26px] p-4 h-[260px] flex flex-col justify-between">
          <SkeletonBox className="w-full h-28 rounded-2xl" />
          <div className="space-y-2 mt-3">
            <SkeletonBox className="w-28 h-3" />
            <SkeletonBox className="w-4/5 h-4" />
            <SkeletonBox className="w-1/2 h-3" />
          </div>
          <div className="flex justify-between items-center pt-2">
            <SkeletonBox className="w-16 h-4" />
            <SkeletonBox className="w-20 h-8 !rounded-full" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Schedule Tab Skeleton
export const ScheduleSkeleton: React.FC = () => (
  <div className="space-y-6 animate-fade-in" aria-label="Loading live schedule...">
    <div className="flex gap-2.5 overflow-hidden py-1">
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
        <SkeletonBox key={i} className="w-14 h-16 rounded-2xl shrink-0" />
      ))}
    </div>
    <div className="space-y-3.5">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="skeleton-card rounded-[26px] p-4 flex items-center gap-4 h-[110px]">
          <SkeletonBox className="w-16 h-16 rounded-2xl shrink-0" />
          <div className="flex-1 space-y-2">
            <SkeletonBox className="w-36 h-3" />
            <SkeletonBox className="w-3/5 h-4" />
            <SkeletonBox className="w-1/3 h-3" />
          </div>
          <SkeletonBox className="w-24 h-9 !rounded-full shrink-0" />
        </div>
      ))}
    </div>
  </div>
);

// Pass Wallet Tab Skeleton
export const PassesSkeleton: React.FC = () => (
  <div className="space-y-6 max-w-lg mx-auto animate-fade-in" aria-label="Loading pass wallet...">
    <div className="flex items-center justify-between">
      <SkeletonBox className="w-32 h-6" />
      <SkeletonBox className="w-20 h-4" />
    </div>
    {/* Digital Pass Ticket Card Skeleton */}
    <div className="skeleton-card rounded-[32px] p-6 space-y-5">
      <div className="flex justify-between items-start">
        <div className="space-y-1.5">
          <SkeletonBox className="w-28 h-3" />
          <SkeletonBox className="w-48 h-5" />
        </div>
        <SkeletonBox className="w-14 h-6 !rounded-full" />
      </div>
      <div className="py-6 border-y border-white/10 flex justify-center">
        <SkeletonBox className="w-48 h-20 rounded-xl" />
      </div>
      <div className="flex justify-between items-center">
        <SkeletonBox className="w-28 h-4" />
        <SkeletonBox className="w-24 h-8 !rounded-full" />
      </div>
    </div>
  </div>
);

// Profile Tab Skeleton
export const ProfileSkeleton: React.FC = () => (
  <div className="space-y-6 max-w-lg mx-auto animate-fade-in" aria-label="Loading profile...">
    <div className="flex items-center gap-4">
      <SkeletonBox className="w-16 h-16 !rounded-full shrink-0" />
      <div className="space-y-2">
        <SkeletonBox className="w-36 h-5" />
        <SkeletonBox className="w-28 h-3" />
      </div>
    </div>
    <div className="grid grid-cols-3 gap-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="skeleton-card rounded-2xl p-3 text-center space-y-1.5">
          <SkeletonBox className="w-8 h-6 mx-auto" />
          <SkeletonBox className="w-14 h-3 mx-auto" />
        </div>
      ))}
    </div>
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="skeleton-card rounded-2xl p-4 flex justify-between items-center h-14">
          <SkeletonBox className="w-32 h-4" />
          <SkeletonBox className="w-10 h-6 !rounded-full" />
        </div>
      ))}
    </div>
  </div>
);
