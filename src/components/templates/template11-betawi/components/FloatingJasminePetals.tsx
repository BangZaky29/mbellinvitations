import React from 'react';

/**
 * FloatingJasminePetals:
 * Pernak-pernik guguran bunga melati ronce khas pengantin Betawi & percikan emas Kembang Kelapa.
 * Melayang lembut di latar belakang dengan animasi CSS non-blocking yang sangat estetik.
 */
export const FloatingJasminePetals: React.FC<{ isPreview?: boolean }> = ({ isPreview = false }) => {
  const petals = [
    { id: 1, left: '8%', delay: '0s', duration: '10s', size: 'w-3.5 h-3.5', opacity: 'opacity-45' },
    { id: 2, left: '24%', delay: '3s', duration: '12s', size: 'w-3 h-3', opacity: 'opacity-40' },
    { id: 3, left: '46%', delay: '1.2s', duration: '11s', size: 'w-4 h-4', opacity: 'opacity-55' },
    { id: 4, left: '68%', delay: '4.8s', duration: '9.5s', size: 'w-3 h-3', opacity: 'opacity-35' },
    { id: 5, left: '86%', delay: '2.2s', duration: '13s', size: 'w-3.5 h-3.5', opacity: 'opacity-50' },
    { id: 6, left: '94%', delay: '6s', duration: '10.5s', size: 'w-2.5 h-2.5', opacity: 'opacity-40' },
  ];

  const sparkles = [
    { id: 's1', left: '16%', delay: '1s', duration: '8s', size: 'text-[11px]' },
    { id: 's2', left: '38%', delay: '4s', duration: '11s', size: 'text-[14px]' },
    { id: 's3', left: '60%', delay: '2s', duration: '9s', size: 'text-[10px]' },
    { id: 's4', left: '80%', delay: '5.5s', duration: '12s', size: 'text-[13px]' },
  ];

  const containerClass = isPreview
    ? 'absolute inset-0 pointer-events-none select-none z-20 overflow-hidden'
    : 'fixed inset-0 pointer-events-none select-none z-20 overflow-hidden max-w-[430px] mx-auto';

  return (
    <div aria-hidden="true" className={containerClass}>
      <style>{`
        @keyframes floatJasmineFall {
          0% {
            transform: translateY(-24px) translateX(0) rotate(0deg);
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

        @keyframes floatSparkleFall {
          0% {
            transform: translateY(-20px) scale(0.6);
            opacity: 0;
          }
          20% {
            opacity: 0.9;
          }
          80% {
            opacity: 0.9;
          }
          100% {
            transform: translateY(105vh) scale(1.1);
            opacity: 0;
          }
        }
      `}</style>

      {/* Ronce Melati Petals */}
      {petals.map((p) => (
        <div
          key={p.id}
          className={`absolute top-0 ${p.size} ${p.opacity}`}
          style={{
            left: p.left,
            animation: `floatJasmineFall ${p.duration} linear infinite`,
            animationDelay: p.delay,
          }}
        >
          {/* Jasmine Petal SVG (Bunga Melati Ronce Bertepi Emas) */}
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full drop-shadow-sm">
            <path
              d="M12 2C8 6 6 10 6 14C6 18 9 22 12 22C15 22 18 18 18 14C18 10 16 6 12 2Z"
              fill="#FCF9F3"
              stroke="#FED65B"
              strokeWidth="0.9"
            />
            <line x1="12" y1="6" x2="12" y2="18" stroke="#FFE088" strokeWidth="0.6" strokeLinecap="round" />
          </svg>
        </div>
      ))}

      {/* Kembang Kelapa Golden Sparkles (✦) */}
      {sparkles.map((s) => (
        <div
          key={s.id}
          className={`absolute top-0 ${s.size} text-[#FED65B]/60 drop-shadow-[0_0_6px_rgba(254,214,91,0.6)] font-serif select-none`}
          style={{
            left: s.left,
            animation: `floatSparkleFall ${s.duration} linear infinite`,
            animationDelay: s.delay,
          }}
        >
          ✦
        </div>
      ))}
    </div>
  );
};

export default FloatingJasminePetals;
