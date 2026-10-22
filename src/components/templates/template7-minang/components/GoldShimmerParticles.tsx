import React from 'react';

/**
 * Ambient Golden Sparkle Dust for Minangkabau Royal Atmosphere
 */
export const GoldShimmerParticles: React.FC = () => {
  const sparkles = [
    { id: 1, left: '10%', delay: '0s', duration: '12s', size: 10 },
    { id: 2, left: '26%', delay: '3s', duration: '15s', size: 8 },
    { id: 3, left: '48%', delay: '1.5s', duration: '13s', size: 11 },
    { id: 4, left: '68%', delay: '4.5s', duration: '14s', size: 9 },
    { id: 5, left: '85%', delay: '2s', duration: '11s', size: 10 },
  ];

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-10 select-none">
      <style>{`
        @keyframes floatGonjong {
          0%, 100% { transform: translateY(-3px) scale(1); }
          50% { transform: translateY(3px) scale(1.02); }
        }
        @keyframes fallSparkle {
          0% {
            opacity: 0;
            transform: translateY(-20px) rotate(0deg) scale(0.6);
          }
          20% {
            opacity: 0.75;
          }
          80% {
            opacity: 0.75;
          }
          100% {
            opacity: 0;
            transform: translateY(105vh) rotate(180deg) scale(1.1);
          }
        }
        .animate-float-gonjong {
          animation: floatGonjong 5s ease-in-out infinite;
        }
        .animate-sparkle {
          animation: fallSparkle linear infinite;
        }
      `}</style>
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute animate-sparkle text-gold/40 drop-shadow-[0_0_6px_rgba(212,175,55,0.6)]"
          style={{
            left: s.left,
            top: '-20px',
            animationDelay: s.delay,
            animationDuration: s.duration,
            fontSize: `${s.size}px`,
          }}
        >
          ✦
        </div>
      ))}
    </div>
  );
};

export default GoldShimmerParticles;
