import { createContext, useContext } from 'react';

/**
 * PhoneDockContext:
 * Menyediakan target DOM container dock secara terisolasi per PhoneMockupPreview instance.
 * Menghindari bug tabrakan document.getElementById('phone-dock-target')
 * saat modal pratinjau dibuka bersamaan dengan panel desktop.
 */
export const PhoneDockContext = createContext<HTMLDivElement | null>(null);

export const usePhoneDock = () => useContext(PhoneDockContext);
