/**
 * Motion tokens from iseoluwa-design-system.md & iseoluwa-work-page-prompt.md.
 * Never hard-code eases, durations, or surface transition colours in components.
 */
export const MOTION = {
  ease: {
    smoothOut: 'power3.out',
    reveal: 'expo.out',
    transition: 'power4.inOut',
    linear: 'none',
  },
  duration: {
    micro: 0.25,
    reveal: 0.95,
    pageTransition: 0.7,
    themeReveal: 0.55,
    zoomTransition: 0.95,
    swiperSnap: 0.65,
  },
  stagger: {
    lines: 0.08,
    items: 0.06,
  },
  lenis: {
    lerp: 0.1,
    wheelMultiplier: 1,
  },
  projectStack: {
    outgoingScale: 0.94,
    outgoingScaleMobile: 0.97,
    outgoingOverlayOpacity: 0.45,
    innerParallaxPercent: 10,
  },
  swiper: {
    neighborScale: 0.88,
    neighborOpacity: 0.42,
    neighborRotateDeg: 2.5,
    maxVelocityTiltDeg: 3,
    maxVelocitySkewDeg: 2,
    rubberBandFactor: 0.28,
    lineSpeedRatio: 0.6,
    flickVelocityThreshold: 280,
  },
  flowingLine: {
    defaultAmplitude: 22,
    defaultFrequency: 0.0045,
    defaultSpeed: 0.025,
    defaultThickness: 1.75,
    velocityMultiplier: 0.35,
    pointerInfluenceRadius: 260,
    pointerMaxBend: 28,
    rippleAmplitude: 34,
    rippleDecay: 0.94,
  },
  surfaceTransition: {
    light: {
      from: {
        '--bg': '#ffffff',
        '--surface': '#f5f5f3',
        '--ink': '#0a0a0a',
        '--ink-muted': '#6b6b66',
        '--line': '#e6e6e2',
        '--line-accent': '#0b4d34',
      },
      to: {
        '--bg': '#0a0a0a',
        '--surface': '#121212',
        '--ink': '#f5f5f3',
        '--ink-muted': '#8f8f8a',
        '--line': '#242424',
        '--line-accent': '#19e37a',
      },
    },
    dark: {
      from: {
        '--bg': '#0a0a0a',
        '--surface': '#121212',
        '--ink': '#f5f5f3',
        '--ink-muted': '#8f8f8a',
        '--line': '#242424',
        '--line-accent': '#19e37a',
      },
      to: {
        '--bg': '#06150e',
        '--surface': '#0b2218',
        '--ink': '#f5f5f3',
        '--ink-muted': '#9ab0a4',
        '--line': '#183528',
        '--line-accent': '#19e37a',
      },
    },
  },
} as const;
