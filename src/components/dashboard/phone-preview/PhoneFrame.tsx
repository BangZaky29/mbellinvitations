import React from 'react';
import { PhoneDockContext } from '../../../context/PhoneDockContext';

interface PhoneFrameProps {
  deviceMode: 'ios' | 'android';
  previewKey: number;
  dockNode: HTMLDivElement | null;
  dockTargetCallback: (node: HTMLDivElement | null) => void;
  children: React.ReactNode;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  deviceMode,
  previewKey,
  dockNode,
  dockTargetCallback,
  children,
}) => {
  return (
    <div
      className={`relative w-[340px] xl:w-[355px] h-[640px] xl:h-[680px] max-h-[calc(100vh-140px)] ${
        deviceMode === 'ios' ? 'rounded-[46px]' : 'rounded-[32px]'
      } bg-slate-900 border-[7px] border-slate-950 p-1 shadow-2xl shrink-0 flex flex-col`}
    >
      {/* INNER SCREEN BEZEL - ACTS AS CONTAINING BLOCK FOR FIXED ELEMENTS */}
      <div
        data-phone-preview="true"
        className={`w-full h-full ${
          deviceMode === 'ios' ? 'rounded-[38px]' : 'rounded-[24px]'
        } bg-white overflow-hidden flex flex-col relative shadow-inner [transform:translateZ(0)]`}
      >
        {/* DYNAMIC ISLAND / CAMERA NOTCH */}
        {deviceMode === 'ios' ? (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-40 flex items-center justify-end px-2 pointer-events-none shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
          </div>
        ) : (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full z-40 pointer-events-none" />
        )}

        {/* PROVIDER CONTEXT DOCK TERISOLASI UNTUK INSTANCE PHONE INI */}
        <PhoneDockContext.Provider value={dockNode}>
          {/* PHONE SCREEN SCROLLABLE CONTENT */}
          <div
            key={previewKey}
            id="phone-screen-scroll-container"
            data-phone-preview="true"
            data-phone-scroll="true"
            className="w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar relative text-left flex flex-col"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {children}
          </div>

          {/* FLOATING CONTROLS PORTAL DOCK (BOTTOM NAV & AUDIO BUBBLE) */}
          <div
            ref={dockTargetCallback}
            id="phone-dock-target"
            className="absolute inset-0 pointer-events-none z-40 overflow-hidden"
          />
        </PhoneDockContext.Provider>

        {/* PHONE HOME INDICATOR BAR (ABSOLUTE BOTTOM) */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-black/40 rounded-full pointer-events-none z-40" />
      </div>
    </div>
  );
};
