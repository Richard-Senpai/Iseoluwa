'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { Flip } from 'gsap/Flip';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { useGSAP } from '@gsap/react';

/**
 * Single registration file for GSAP and its plugins (Tech Stack Rule 4.1).
 * All components must import `gsap`, `ScrollTrigger`, `SplitText`, `DrawSVGPlugin`,
 * `Flip`, `Draggable`, `InertiaPlugin`, and `useGSAP` from `@/lib/animation/gsap`.
 */
let isRegistered = false;

export function registerGSAP(): void {
  if (
    typeof window === 'undefined' ||
    typeof window.matchMedia !== 'function' ||
    isRegistered
  ) {
    return;
  }
  gsap.registerPlugin(
    ScrollTrigger,
    SplitText,
    DrawSVGPlugin,
    Flip,
    Draggable,
    InertiaPlugin,
    useGSAP,
  );
  isRegistered = true;
}

registerGSAP();

export {
  gsap,
  ScrollTrigger,
  SplitText,
  DrawSVGPlugin,
  Flip,
  Draggable,
  InertiaPlugin,
  useGSAP,
};
