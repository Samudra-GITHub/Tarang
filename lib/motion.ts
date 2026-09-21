/** Shared spring/easing presets — Apple Music / Linear–style tactility, kept consistent app-wide. */

export const springSnappy = { type: "spring", stiffness: 420, damping: 32, mass: 0.7 } as const;
export const springSmooth = { type: "spring", stiffness: 220, damping: 26, mass: 1 } as const;
export const springGentle = { type: "spring", stiffness: 160, damping: 22, mass: 1 } as const;

export const easeOutExpo = [0.22, 1, 0.36, 1] as const;
