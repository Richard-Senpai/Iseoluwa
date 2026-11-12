'use client';

import { create } from 'zustand';
import type { CurrencyCode } from '@/content/packages';

export type CursorVariant = 'default' | 'view' | 'talk' | 'play' | 'drag' | 'enter';

interface UIState {
  isMenuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  toggleMenu: () => void;

  cursorVariant: CursorVariant;
  cursorLabel: string;
  setCursor: (variant: CursorVariant, label?: string) => void;
  resetCursor: () => void;

  scrollVelocity: number;
  setScrollVelocity: (velocity: number) => void;

  isFooterDarkZone: boolean;
  setFooterDarkZone: (active: boolean) => void;

  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;

  transitionTargetTitle: string | null;
  setTransitionTargetTitle: (title: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMenuOpen: false,
  setMenuOpen: (open) => set({ isMenuOpen: open }),
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),

  cursorVariant: 'default',
  cursorLabel: '',
  setCursor: (variant, label = '') => set({ cursorVariant: variant, cursorLabel: label }),
  resetCursor: () => set({ cursorVariant: 'default', cursorLabel: '' }),

  scrollVelocity: 0,
  setScrollVelocity: (scrollVelocity) => set({ scrollVelocity }),

  isFooterDarkZone: false,
  setFooterDarkZone: (isFooterDarkZone) => set({ isFooterDarkZone }),

  currency: 'USD',
  setCurrency: (currency) => set({ currency }),

  transitionTargetTitle: null,
  setTransitionTargetTitle: (transitionTargetTitle) => set({ transitionTargetTitle }),
}));
