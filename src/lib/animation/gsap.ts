'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { useGSAP } from '@gsap/react';

/**
 * Single registration file for GSAP and its plugins (Tech Stack Rule 4.1).
 * All components must import `gsap`, `ScrollTrigger`, `SplitText`, `DrawSVGPlugin`,
 * and `useGSAP` from `@/lib/animation/gsap`.
 */
let isRegistered = false;

export function registerGSAP(): void {
  if (typeof window === 'undefined' || isRegistered) return;
  gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, useGSAP);
  isRegistered = true;
}

registerGSAP();

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, useGSAP };
