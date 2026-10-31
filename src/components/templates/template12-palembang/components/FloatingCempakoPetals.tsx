import React from 'react';

interface FloatingCempakoPetalsProps {
  isPreview?: boolean;
}

/**
 * FloatingCempakoPetals (Layer 2):
 * Taburan Bunga Cempako Emas, kuncup Ronce Melati pengantin Palembang,
 * serta kilau serpihan benang emas Songket Lepus yang melayang perlahan dan anggun.
 */
export const FloatingCempakoPetals: React.FC<FloatingCempakoPetalsProps> = ({
  isPreview = false,
}) => {
  // Kelopak Cempako Emas (Palembang Golden Champaca)
  const cempakoPetals = [
    { id: 'cp1', left: '7%', delay: '0s', duration: '12s', size: 'w-4 h-4', opacity: 'opacity-60' },
    { id: 'cp2', left: '26%', delay: '3.5s', duration: '14s', size: 'w-5 h-5', opacity: 'opacity-65' },
    { id: 'cp3', left: '48%', delay: '1.2s', duration: '11s', size: 'w-4 h-4', opacity: 'opacity-55' },
    { id: 'cp4', left: '72%', delay: '5.2s', duration: '13.5s', size: 'w-4.5 h-4.5', opacity: 'opacity-60' },
    { id: 'cp5', left: '88%', delay: '2.8s', duration: '15s', size: 'w-3.5 h-3.5', opacity: 'opacity-50' },
  ];

  // Kuncup Ronce Melati Suci (White Jasmine)
  const melatiPetals = [
    { id: 'ml1', left: '16%', delay: '2s', duration: '13s', size: 'w-3 h-3', opacity: 'opacity-70' },
    { id: 'ml2', left: '38%', delay: '6s', duration: '10.5s', size: 'w-3.5 h-3.5', opacity: 'opacity-75' },
    { id: 'ml3', left: '62%', delay: '4s', duration: '14.5s', size: 'w-3 h-3', opacity: 'opacity-65' },
    { id: 'ml4', left: '82%', delay: '7.5s', duration: '12.5s', size: 'w-3.5 h-3.5', opacity: 'opacity-70' },
  ];

  // Kilau Serbuk Emas Songket (Golden Shimmer)
  const goldSparkles = [
    { id: 'gs1', left: '12%', delay: '0.8s', duration: '8s', size: 'text-[11px]' },
    { id: 'gs2', left: '33%', delay: '3.2s', duration: '10s', size: 'text-[13px]' },
    { id: 'gs3', left: '57%', delay: '1.9s', duration: '9s', size: 'text-[10px]' },
    { id: 'gs4', left: '79%', delay: '4.6s', duration: '11.5s', size: 'text-[12px]' },
  ];

  const containerClass = isPreview
    ? 'absolute inset-0 pointer-events-none select-none z-20 overflow-hidden'
    : 'fixed inset-0 pointer-events-none select-none z-20 overflow-hidden max-w-[430px] mx-auto';

  return (
    <div aria-hidden="true" className={containerClass}>
      <style>{`
        @keyframes floatCempakoFall {
          0% {
            transform: translateY(-30px) translateX(0) rotate(0deg);
            opacity: 0;
          }
          15% {
            opacity: 0.85;
          }
          50% {
            transform: translateY(50vh) translateX(18px) rotate(160deg);
          }
          85% {
            opacity: 0.85;
          }
          100% {
            transform: translateY(105vh) translateX(-14px) rotate(340deg);
            opacity: 0;
          }
        }

        @keyframes floatMelatiFall {
          0% {
            transform: translateY(-24px) translateX(0) rotate(0deg);
            opacity: 0;
          }
          20% {
            opacity: 0.9;
          }
          50% {
            transform: translateY(48vh) translateX(-15px) rotate(120deg);
          }
          80% {
            opacity: 0.9;
          }
          100% {
            transform: translateY(105vh) translateX(10px) rotate(260deg);
            opacity: 0;
          }
        }

        @keyframes floatGoldSparkle {
          0% {
            transform: translateY(-20px) scale(0.6);
            opacity: 0;
          }
          20% {
            opacity: 0.9;
            transform: translateY(20vh) scale(1);
          }
          50% {
            transform: translateY(50vh) scale(0.8);
            opacity: 0.6;
          }
          80% {
            opacity: 0.9;
            transform: translateY(80vh) scale(1.1);
          }
          100% {
            transform: translateY(105vh) scale(0.5);
            opacity: 0;
          }
        }
      `}</style>

      {/* 1. Bunga Cempako Emas */}
      {cempakoPetals.map((petal) => (
        <div
          key={petal.id}
          className={`absolute top-0 ${petal.size} ${petal.opacity} text-[#FFD57A] drop-shadow-sm`}
          style={{
            left: petal.left,
            animation: `floatCempakoFall ${petal.duration} linear infinite`,
            animationDelay: petal.delay,
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            {/* Kelopak Bunga Cempako 6 Helai */}
            <path
              d="M12 2C13.5 6 15 8 18 10C15 12 13.5 14 12 18C10.5 14 9 12 6 10C9 8 10.5 6 12 2Z"
              fill="currentColor"
              fillOpacity="0.85"
            />
            <path
              d="M12 4C13 7 14 8.5 16.5 10C14 11.5 13 13 12 16C11 13 10 11.5 7.5 10C10 8.5 11 7 12 4Z"
              fill="#FFF0B3"
            />
            <circle cx="12" cy="10" r="1.5" fill="#785A05" />
          </svg>
        </div>
      ))}

      {/* 2. Kuncup Ronce Melati Suci */}
      {melatiPetals.map((petal) => (
        <div
          key={petal.id}
          className={`absolute top-0 ${petal.size} ${petal.opacity} text-[#FFFDF8] drop-shadow`}
          style={{
            left: petal.left,
            animation: `floatMelatiFall ${petal.duration} linear infinite`,
            animationDelay: petal.delay,
          }}
        >
          <svg viewBox="0 0 20 20" fill="none" className="w-full h-full">
            {/* Ronce Melati Putih */}
            <circle cx="10" cy="10" r="4.5" fill="#FFFFFF" fillOpacity="0.9" />
            <circle cx="10" cy="10" r="2.5" fill="#FFF8E7" />
            <circle cx="10" cy="10" r="1" fill="#785A05" />
          </svg>
        </div>
      ))}

      {/* 3. Serbuk Emas Songket (Golden Shimmer Dust) */}
      {goldSparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className={`absolute top-0 text-[#FFD57A] ${sparkle.size} select-none pointer-events-none drop-shadow-[0_0_4px_rgba(255,213,122,0.8)]`}
          style={{
            left: sparkle.left,
            animation: `floatGoldSparkle ${sparkle.duration} ease-in-out infinite`,
            animationDelay: sparkle.delay,
          }}
        >
          ✦
        </div>
      ))}
    </div>
  );
};

