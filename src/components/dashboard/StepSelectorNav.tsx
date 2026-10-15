import React from 'react';

export type EditorStep = 1 | 2 | 3 | 4 | 5;

export interface StepSelectorNavProps {
  currentStep?: EditorStep;
  activeStep?: EditorStep | number;
  onStepSelect?: (step: EditorStep) => void;
  onSelectStep?: (step: EditorStep | number) => void;
  completedSteps?: number;
}

export const StepSelectorNav: React.FC<StepSelectorNavProps> = ({
  currentStep,
  activeStep,
  onStepSelect,
  onSelectStep,
}) => {
  const effectiveStep = (activeStep || currentStep || 1) as EditorStep;

  const handleStepClick = (stepId: EditorStep) => {
    onStepSelect?.(stepId);
    onSelectStep?.(stepId);
  };

  const steps: { id: EditorStep; title: string; shortTitle: string; icon: string }[] = [
    { id: 1, title: 'Pilih Tema', shortTitle: 'Tema', icon: 'palette' },
    { id: 2, title: 'Data Mempelai', shortTitle: 'Mempelai', icon: 'favorite' },
    { id: 3, title: 'Jadwal Acara', shortTitle: 'Acara', icon: 'event' },
    { id: 4, title: 'Galeri & Kisah', shortTitle: 'Galeri', icon: 'photo_library' },
    { id: 5, title: 'Amplop Hadiah', shortTitle: 'Amplop', icon: 'redeem' },
  ];

  // Hitung progress bar percentage
  const progressPercent = Math.round((effectiveStep / 5) * 100);

  return (
    <section className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5">
      {/* Top Meta: Status & Live Preview Indicator */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-bold tracking-wider uppercase text-stone-700">
            Langkah {effectiveStep} dari 5
          </span>
          <span className="hidden sm:inline-block text-stone-300">•</span>
          <span className="hidden sm:inline-block text-xs font-medium text-stone-500">
            {steps.find((s) => s.id === effectiveStep)?.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-stone-700 text-[11px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Pratinjau Sinkron Langsung
          </span>
        </div>
      </div>

      {/* Progress Bar Halus */}
      <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-stone-800 to-stone-950 transition-all duration-300 ease-out rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Horizontal Nav Step Buttons */}
      <nav className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar scroll-smooth">
        {steps.map((s) => {
          const isActive = effectiveStep === s.id;
          const isCompleted = s.id < effectiveStep;

          return (
            <button
              key={s.id}
              onClick={() => handleStepClick(s.id)}
              type="button"
              className={`group flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-stone-900 text-white shadow-sm ring-2 ring-stone-900/10 font-semibold'
                  : isCompleted
                  ? 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200/70'
                  : 'bg-transparent text-stone-500 hover:bg-stone-100/80 hover:text-stone-800'
              }`}
            >
              <span
                className={`flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-bold shrink-0 transition-colors ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : isCompleted
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-stone-200 text-stone-600 group-hover:bg-stone-300'
                }`}
              >
                {isCompleted ? (
                  <span className="material-symbols-outlined text-[13px] font-bold">check</span>
                ) : (
                  s.id
                )}
              </span>

              <span className="whitespace-nowrap">
                <span className="hidden md:inline">{s.title}</span>
                <span className="md:hidden">{s.shortTitle}</span>
              </span>
            </button>
          );
        })}
      </nav>
    </section>
  );
};
