import React from 'react';

/**
 * Subtle Floating Jasmine Petals in the Background (Ronce Melati Pasundan)
 */
export const FallingPetals: React.FC = () => {
  const petals = [
    { id: 1, left: '8%', delay: '0s', duration: '11s', size: 16 },
    { id: 2, left: '25%', delay: '2.5s', duration: '13s', size: 14 },
    { id: 3, left: '44%', delay: '5s', duration: '12s', size: 18 },
    { id: 4, left: '62%', delay: '1s', duration: '14s', size: 15 },
    { id: 5, left: '79%', delay: '3.5s', duration: '10s', size: 16 },
    { id: 6, left: '92%', delay: '6s', duration: '15s', size: 13 },
  ];

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-10 select-none">
      <style>{`
        @keyframes floatSiger {
          0%, 100% { transform: translateY(-4px) rotate(-0.5deg); }
          50% { transform: translateY(4px) rotate(0.5deg); }
        }
        @keyframes fallPetal {
          0% {
            opacity: 0;
            transform: translateY(-20px) rotate(0deg) scale(0.85);
          }
          15% {
            opacity: 0.65;
          }
          85% {
            opacity: 0.65;
          }
          100% {
            opacity: 0;
            transform: translateY(105vh) rotate(360deg) scale(1);
          }
        }
        .animate-float-siger {
          animation: floatSiger 4.5s ease-in-out infinite;
        }
        .animate-petal {
          animation: fallPetal linear infinite;
        }
      `}</style>
      {petals.map((p) => (
        <div
          key={p.id}
          className="absolute animate-petal text-[#c5a059]/40"
          style={{
            left: p.left,
            top: '-20px',
            animationDelay: p.delay,
            animationDuration: p.duration,
            fontSize: `${p.size}px`,
          }}
        >
          🌸
        </div>
      ))}
    </div>
  );
};

export default FallingPetals;
