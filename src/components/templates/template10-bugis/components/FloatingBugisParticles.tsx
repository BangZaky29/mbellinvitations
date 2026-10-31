import React from 'react';

interface FloatingBugisParticlesProps {
  isPreview?: boolean;
}

/**
 * FloatingBugisParticles:
 * Pernak-pernik guguran daun pacci pensucian & serpihan kilau emas mahkota Saloko Pinang Goyang.
 * Melayang anggun di latar belakang dengan animasi CSS non-blocking yang sangat halus dan ringan.
 */
export const FloatingBugisParticles: React.FC<FloatingBugisParticlesProps> = ({
  isPreview = false,
}) => {
  const pacciLeaves = [
    { id: 1, left: '7%', delay: '0s', duration: '11s', size: 'w-3 h-3', opacity: 'opacity-40' },
    { id: 2, left: '22%', delay: '3.5s', duration: '13s', size: 'w-3.5 h-3.5', opacity: 'opacity-45' },
    { id: 3, left: '48%', delay: '1.2s', duration: '10.5s', size: 'w-4 h-4', opacity: 'opacity-50' },
    { id: 4, left: '69%', delay: '5s', duration: '12.5s', size: 'w-3 h-3', opacity: 'opacity-35' },
    { id: 5, left: '85%', delay: '2s', duration: '14s', size: 'w-3.5 h-3.5', opacity: 'opacity-45' },
    { id: 6, left: '93%', delay: '6.2s', duration: '9.8s', size: 'w-2.5 h-2.5', opacity: 'opacity-40' },
  ];

  const goldSparkles = [
    { id: 'gs1', left: '14%', delay: '0.8s', duration: '7.5s', size: 'text-[11px]' },
    { id: 'gs2', left: '36%', delay: '3.8s', duration: '10.5s', size: 'text-[13px]' },
    { id: 'gs3', left: '58%', delay: '2.1s', duration: '8.5s', size: 'text-[10px]' },
    { id: 'gs4', left: '78%', delay: '5.2s', duration: '11.5s', size: 'text-[14px]' },
  ];

  const containerClass = isPreview
    ? 'absolute inset-0 pointer-events-none select-none z-20 overflow-hidden'
    : 'fixed inset-0 pointer-events-none select-none z-20 overflow-hidden max-w-[430px] mx-auto';

  return (
    <div aria-hidden="true" className={containerClass}>
      <style>{`
        @keyframes floatPacciFall {
          0% {
            transform: translateY(-24px) translateX(0) rotate(0deg);
            opacity: 0;
          }
          15% {
            opacity: 0.85;
          }
          50% {
            transform: translateY(50vh) translateX(14px) rotate(180deg);
          }
          85% {
            opacity: 0.85;
          }
          100% {
            transform: translateY(105vh) translateX(-10px) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes floatGoldSparkle {
          0% {
            transform: translateY(-20px) scale(0.6);
            opacity: 0;
          }
          20% {
            opacity: 0.95;
          }
          80% {
            opacity: 0.95;
          }
          100% {
            transform: translateY(105vh) scale(1.15);
            opacity: 0;
          }
        }
      `}</style>

      {/* Daun Pacci & Kelopak Sakral Bugis */}
      {pacciLeaves.map((leaf) => (
        <div
          key={leaf.id}
          className={`absolute top-0 ${leaf.size} ${leaf.opacity}`}
          style={{
            left: leaf.left,
            animation: `floatPacciFall ${leaf.duration} linear infinite`,
            animationDelay: leaf.delay,
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full drop-shadow-sm">
            {/* Elegant Pacci Leaf with Golden Edge */}
            <path
              d="M12 2C7 6 5 11 5 15C5 19 8 22 12 22C16 22 19 19 19 15C19 11 17 6 12 2Z"
              fill="#0F2E22"
              fillOpacity="0.8"
              stroke="#F2CA50"
              strokeWidth="0.8"
            />
            <path
              d="M12 5V19 M9 11L12 14L15 11"
              stroke="#F2CA50"
              strokeWidth="0.6"
              strokeLinecap="round"
            />
          </svg>
        </div>
      ))}

      {/* Saloko Pinang Goyang Shimmer Sparkles (✦) */}
      {goldSparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className={`absolute top-0 ${sparkle.size} text-[#F2CA50]/70 drop-shadow-[0_0_8px_rgba(242,202,80,0.7)] font-serif select-none`}
          style={{
            left: sparkle.left,
            animation: `floatGoldSparkle ${sparkle.duration} linear infinite`,
            animationDelay: sparkle.delay,
          }}
        >
          ✦
        </div>
      ))}
    </div>
  );
};

