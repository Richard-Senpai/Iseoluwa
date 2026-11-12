'use client';

import { create } from 'zustand';

export interface ZoomRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface ZoomTransitionRequest {
  direction: 'in' | 'out';
  targetHref: string;
  originKey: string;
  fromRect: ZoomRect | null;
  label: string;
  title?: string;
}

interface ZoomStoreState {
  activeRequest: ZoomTransitionRequest | null;
  savedOrigins: Record<string, { rect: ZoomRect; label: string }>;
  saveOrigin: (key: string, rect: ZoomRect, label: string) => void;
  startZoom: (request: ZoomTransitionRequest) => void;
  clearZoom: () => void;
}

export const useZoomStore = create<ZoomStoreState>((set) => ({
  activeRequest: null,
  savedOrigins: {},
  saveOrigin: (key, rect, label) =>
    set((state) => ({
      savedOrigins: {
        ...state.savedOrigins,
        [key]: { rect, label },
      },
    })),
  startZoom: (activeRequest) => set({ activeRequest }),
  clearZoom: () => set({ activeRequest: null }),
}));
