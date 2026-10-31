import React from 'react';

interface FloatingJepunPetalsProps {
  isPreview?: boolean;
}

/**
 * FloatingJepunPetals:
 * Pernak-pernik guguran bunga Kamboja / Bunga Jepun Bali sakral & serpihan kilau emas prada.
 * Melayang anggun di latar belakang dengan animasi CSS non-blocking yang sangat halus dan ringan.
 */
export const FloatingJepunPetals: React.FC<FloatingJepunPetalsProps> = ({
  isPreview = false,
}) => {
  const jepunPetals = [
    { id: 1, left: '8%', delay: '0s', duration: '12s', size: 'w-4 h-4', opacity: 'opacity-50' },
    { id: 2, left: '24%', delay: '4s', duration: '14s', size: 'w-4.5 h-4.5', opacity: 'opacity-55' },
    { id: 3, left: '46%', delay: '1.5s', duration: '11s', size: 'w-5 h-5', opacity: 'opacity-60' },
    { id: 4, left: '68%', delay: '5.5s', duration: '13.5s', size: 'w-4 h-4', opacity: 'opacity-45' },
    { id: 5, left: '84%', delay: '2.5s', duration: '15s', size: 'w-4.5 h-4.5', opacity: 'opacity-55' },
    { id: 6, left: '92%', delay: '7s', duration: '10.5s', size: 'w-3.5 h-3.5', opacity: 'opacity-40' },
  ];

  const goldSparkles = [
    { id: 'gs1', left: '12%', delay: '0.5s', duration: '8s', size: 'text-[11px]' },
    { id: 'gs2', left: '35%', delay: '3.2s', duration: '11s', size: 'text-[13px]' },
    { id: 'gs3', left: '59%', delay: '1.8s', duration: '9s', size: 'text-[10px]' },
    { id: 'gs4', left: '79%', delay: '4.8s', duration: '12s', size: 'text-[14px]' },
  ];

  const containerClass = isPreview
    ? 'absolute inset-0 pointer-events-none select-none z-20 overflow-hidden'
    : 'fixed inset-0 pointer-events-none select-none z-20 overflow-hidden max-w-[430px] mx-auto';

  return (
    <div aria-hidden="true" className={containerClass}>
      <style>{`
        @keyframes floatJepunFall {
          0% {
            transform: translateY(-28px) translateX(0) rotate(0deg);
            opacity: 0;
          }
          15% {
            opacity: 0.85;
          }
          50% {
            transform: translateY(50vh) translateX(16px) rotate(180deg);
          }
          85% {
            opacity: 0.85;
          }
          100% {
            transform: translateY(105vh) translateX(-12px) rotate(360deg);
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

      {/* Floating Frangipani / Jepun Petals SVG */}
      {jepunPetals.map((petal) => (
        <div
          key={petal.id}
          className={`absolute top-0 ${petal.opacity}`}
          style={{
            left: petal.left,
            animation: `floatJepunFall ${petal.duration} linear infinite`,
            animationDelay: petal.delay,
            willChange: 'transform, opacity',
          }}
        >
          <svg
            viewBox="0 0 40 40"
            fill="none"
            className={`${petal.size} drop-shadow-[0_2px_4px_rgba(115,92,0,0.25)]`}
          >
            {/* 5-Petal Balinese Jepun Flower */}
            <g transform="translate(20, 20)">
              {/* Petal 1 */}
              <path
                d="M0,-3 C-4,-10 -5,-16 0,-18 C5,-16 4,-10 0,-3"
                fill="#FFFDF7"
                stroke="#D4AF37"
                strokeWidth="0.6"
              />
              {/* Petal 2 */}
              <path
                d="M0,-3 C-4,-10 -5,-16 0,-18 C5,-16 4,-10 0,-3"
                transform="rotate(72)"
                fill="#FFFDF7"
                stroke="#D4AF37"
                strokeWidth="0.6"
              />
              {/* Petal 3 */}
              <path
                d="M0,-3 C-4,-10 -5,-16 0,-18 C5,-16 4,-10 0,-3"
                transform="rotate(144)"
                fill="#FFFDF7"
                stroke="#D4AF37"
                strokeWidth="0.6"
              />
              {/* Petal 4 */}
              <path
                d="M0,-3 C-4,-10 -5,-16 0,-18 C5,-16 4,-10 0,-3"
                transform="rotate(216)"
                fill="#FFFDF7"
                stroke="#D4AF37"
                strokeWidth="0.6"
              />
              {/* Petal 5 */}
              <path
                d="M0,-3 C-4,-10 -5,-16 0,-18 C5,-16 4,-10 0,-3"
                transform="rotate(288)"
                fill="#FFFDF7"
                stroke="#D4AF37"
                strokeWidth="0.6"
              />
              {/* Sacred Saffron Gold Flower Center */}
              <circle cx="0" cy="0" r="3.5" fill="#FED65B" />
              <circle cx="0" cy="0" r="1.8" fill="#D4AF37" />
            </g>
          </svg>
        </div>
      ))}

      {/* Floating Prada Shimmer Sparkles */}
      {goldSparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute top-0 text-[#D4AF37] opacity-60"
          style={{
            left: sparkle.left,
            animation: `floatGoldSparkle ${sparkle.duration} ease-in-out infinite`,
            animationDelay: sparkle.delay,
            willChange: 'transform, opacity',
          }}
        >
          <span className={`select-none ${sparkle.size}`}>✦</span>
        </div>
      ))}
    </div>
  );
};

