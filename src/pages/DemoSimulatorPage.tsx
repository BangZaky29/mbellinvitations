import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Template1Modern } from '../components/templates/Template1Modern';
import { Template2Rustic } from '../components/templates/Template2Rustic';
import { Template3Jawa } from '../components/templates/Template3Jawa';
import { Template4Islami } from '../components/templates/Template4Islami';
import { Template5Luxury } from '../components/templates/Template5Luxury';
import { TemplateSundaSiger } from '../components/templates/TemplateSundaSiger';
import { TemplateMinangBaralek } from '../components/templates/Template7Minang';
import { TemplateBatakToba } from '../components/templates/Template8Batak';
import {
  MOCK_MODERN_DATA,
  MOCK_MODERN_THEME,
  MOCK_MODERN_WISHES,
  MOCK_RUSTIC_DATA,
  MOCK_RUSTIC_THEME,
  MOCK_RUSTIC_WISHES,
  MOCK_JAWA_DATA,
  MOCK_JAWA_THEME,
  MOCK_JAWA_WISHES,
  MOCK_ISLAMI_DATA,
  MOCK_ISLAMI_THEME,
  MOCK_ISLAMI_WISHES,
  MOCK_LUXURY_DATA,
  MOCK_LUXURY_THEME,
  MOCK_LUXURY_WISHES,
  MOCK_SUNDA_DATA,
  MOCK_SUNDA_THEME,
  MOCK_SUNDA_WISHES,
  MOCK_MINANG_DATA,
  MOCK_MINANG_THEME,
  MOCK_MINANG_WISHES,
  MOCK_BATAK_DATA,
  MOCK_BATAK_THEME,
  MOCK_BATAK_WISHES,
} from '../data/mockInvitation';

const TEMPLATE_LIST = [
  { id: 'template1', num: '1', name: 'Modern Arch', short: 'Modern', accentColor: '#D4AF37' },
  { id: 'template2', num: '2', name: 'Rustic Casual', short: 'Rustic', accentColor: '#556B2F' },
  { id: 'template3', num: '3', name: 'Adat Jawa', short: 'Jawa', accentColor: '#C5A059' },
  { id: 'template4', num: '4', name: 'Islami Kubah', short: 'Islami', accentColor: '#5E2832' },
  { id: 'template5', num: '5', name: 'Luxury Glamour', short: 'Luxury', accentColor: '#E2C792' },
  { id: 'template6', num: '6', name: 'Adat Sunda Siger', short: 'Sunda', accentColor: '#C5A059' },
  { id: 'template7', num: '7', name: 'Adat Minang Baralek Gadang', short: 'Minang', accentColor: '#D4AF37' },
  { id: 'template8', num: '8', name: 'Adat Batak Toba', short: 'Batak', accentColor: '#C8A253' },
];

export const DemoSimulatorPage: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('template1');
  const [isCoverOpen, setIsCoverOpen] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const currentTemplate =
    TEMPLATE_LIST.find((t) => t.id === selectedTemplate) || TEMPLATE_LIST[0];

  return (
    <div className="relative min-h-screen bg-neutral-900 font-sans selection:bg-amber-500/20">
      {/* Floating Simulator Menu Bar */}
      <div className="fixed top-2 sm:top-3 left-1/2 -translate-x-1/2 z-50 w-[96%] max-w-[430px] transition-all duration-300">
        {isCollapsed ? (
          <div className="flex items-center justify-between bg-neutral-950/90 backdrop-blur-xl border border-white/10 rounded-2xl px-3 py-1.5 shadow-2xl">
            <div className="flex items-center space-x-2">
              <span
                className="w-2.5 h-2.5 rounded-full animate-pulse"
                style={{ backgroundColor: currentTemplate.accentColor }}
              ></span>
              <span className="font-bold text-xs text-neutral-200">
                {currentTemplate.name}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsCollapsed(false)}
              className="px-2 py-0.5 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white text-[11px] font-medium flex items-center gap-1 transition-colors border border-white/10"
            >
              <span>Ubah Template</span>
              <span className="material-symbols-outlined text-xs">expand_more</span>
            </button>
          </div>
        ) : (
          <div className="bg-neutral-950/95 backdrop-blur-2xl border border-white/15 rounded-2xl p-2 sm:p-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.65)] flex flex-col gap-2">
            {/* Row 1: Header Info & Controls */}
            <div className="flex items-center justify-between gap-1.5 px-0.5">
              <div className="flex items-center space-x-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full animate-pulse shrink-0 ring-4 ring-white/5"
                  style={{ backgroundColor: currentTemplate.accentColor }}
                ></span>
                <span className="font-bold text-xs text-neutral-100 truncate tracking-wide">
                  {currentTemplate.name}
                </span>
              </div>

              <div className="flex items-center space-x-1.5 shrink-0">
                {/* Cover Toggle Button */}
                <button
                  type="button"
                  onClick={() => setIsCoverOpen((prev) => !prev)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer flex items-center gap-1 shadow-sm border ${
                    isCoverOpen
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/25'
                      : 'bg-neutral-850 text-neutral-300 border-neutral-700/60 hover:bg-neutral-800'
                  }`}
                  title="Klik untuk membuka/menutup Sampul"
                >
                  <span className="material-symbols-outlined text-[13px]">
                    {isCoverOpen ? 'lock_open' : 'lock'}
                  </span>
                  <span>{isCoverOpen ? 'Buka' : 'Tutup'}</span>
                </button>

                {/* Live / Preview Mode Button */}
                <button
                  type="button"
                  onClick={() => {
                    setIsPreview((prev) => {
                      const next = !prev;
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      return next;
                    });
                  }}
                  className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer flex items-center gap-1 border ${
                    isPreview
                      ? 'bg-blue-600/20 text-blue-300 border-blue-500/50 hover:bg-blue-600/30'
                      : 'bg-neutral-850 text-neutral-400 border-neutral-700/60 hover:bg-neutral-800'
                  }`}
                  title="Preview langsung masuk isi undangan"
                >
                  <span className="material-symbols-outlined text-[13px]">
                    {isPreview ? 'visibility' : 'cell_tower'}
                  </span>
                  <span>{isPreview ? 'Preview' : 'Live'}</span>
                </button>

                {/* Link to Editor Dashboard */}
                <Link
                  to="/dashboard"
                  className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 transition-all flex items-center gap-1"
                  title="Buka Editor Dashboard"
                >
                  <span className="material-symbols-outlined text-[13px]">dashboard</span>
                  <span>Editor</span>
                </Link>

                {/* Minimize Button */}
                <button
                  type="button"
                  onClick={() => setIsCollapsed(true)}
                  className="w-7 h-7 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 flex items-center justify-center transition-colors cursor-pointer border border-neutral-800"
                >
                  <span className="material-symbols-outlined text-base">expand_less</span>
                </button>
              </div>
            </div>

            {/* Row 2: 6-Segment Tab Bar */}
            <div className="grid grid-cols-6 gap-1 bg-black/50 p-1 rounded-xl border border-white/5">
              {TEMPLATE_LIST.map((tpl) => {
                const isActive = selectedTemplate === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => {
                      setSelectedTemplate(tpl.id);
                      setIsCoverOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`py-1.5 px-0.5 rounded-lg text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                      isActive
                        ? 'bg-neutral-800 text-white font-bold shadow-md border border-white/15'
                        : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
                    }`}
                  >
                    <span className="text-[10px] opacity-60 leading-none">{tpl.num}</span>
                    <span className="text-[11px] font-medium leading-tight truncate w-full">
                      {tpl.short}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Main Template Renderer */}
      <div className="w-full">
        {selectedTemplate === 'template1' && (
          <Template1Modern
            invitationId="demo-invitation-001"
            data={MOCK_MODERN_DATA}
            theme={MOCK_MODERN_THEME}
            wishes={MOCK_MODERN_WISHES}
            isCoverOpen={isCoverOpen}
            isPreview={isPreview}
          />
        )}

        {selectedTemplate === 'template2' && (
          <Template2Rustic
            invitationId="demo-invitation-002"
            data={MOCK_RUSTIC_DATA}
            theme={MOCK_RUSTIC_THEME}
            wishes={MOCK_RUSTIC_WISHES}
            isCoverOpen={isCoverOpen}
            isPreview={isPreview}
          />
        )}

        {selectedTemplate === 'template3' && (
          <Template3Jawa
            invitationId="demo-invitation-003"
            data={MOCK_JAWA_DATA}
            theme={MOCK_JAWA_THEME}
            wishes={MOCK_JAWA_WISHES}
            isCoverOpen={isCoverOpen}
            isPreview={isPreview}
          />
        )}

        {selectedTemplate === 'template4' && (
          <Template4Islami
            invitationId="demo-invitation-004"
            data={MOCK_ISLAMI_DATA}
            theme={MOCK_ISLAMI_THEME}
            wishes={MOCK_ISLAMI_WISHES}
            isCoverOpen={isCoverOpen}
            isPreview={isPreview}
          />
        )}

        {selectedTemplate === 'template5' && (
          <Template5Luxury
            invitationId="demo-invitation-005"
            data={MOCK_LUXURY_DATA}
            theme={MOCK_LUXURY_THEME}
            wishes={MOCK_LUXURY_WISHES}
            isCoverOpen={isCoverOpen}
            isPreview={isPreview}
          />
        )}

        {selectedTemplate === 'template6' && (
          <TemplateSundaSiger
            invitationId="demo-invitation-006"
            data={MOCK_SUNDA_DATA}
            theme={MOCK_SUNDA_THEME}
            wishes={MOCK_SUNDA_WISHES}
            isCoverOpen={isCoverOpen}
            isPreview={isPreview}
          />
        )}

        {selectedTemplate === 'template7' && (
          <TemplateMinangBaralek
            invitationId="demo-invitation-007"
            data={MOCK_MINANG_DATA}
            theme={MOCK_MINANG_THEME}
            wishes={MOCK_MINANG_WISHES}
            isCoverOpen={isCoverOpen}
            isPreview={isPreview}
          />
        )}

        {selectedTemplate === 'template8' && (
          <TemplateBatakToba
            invitationId="demo-invitation-008"
            data={MOCK_BATAK_DATA}
            theme={MOCK_BATAK_THEME}
            wishes={MOCK_BATAK_WISHES}
            isCoverOpen={isCoverOpen}
            isPreview={isPreview}
          />
        )}
      </div>
    </div>
  );
};

export default DemoSimulatorPage;
