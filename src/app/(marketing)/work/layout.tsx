import type { ReactNode } from 'react';
import { ZoomTransition } from '@/components/motion/ZoomTransition';

/**
 * Persistent layout for `/work`, `/work/[category]`, and `/work/[category]/[slug]`.
 * Hosts `ZoomTransition` so the shared-element clone survives route changes inside `/work`.
 */
export default function WorkLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ZoomTransition />
      {children}
    </>
  );
}
