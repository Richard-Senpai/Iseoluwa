'use client';

import type { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';

export interface ThemeRevealProps {
  children: ReactNode;
}

/**
 * Wraps the app in `next-themes` without flash on load and supports the circular
 * View Transitions API reveal triggered by `ThemeToggle`.
 */
export function ThemeReveal({ children }: ThemeRevealProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
