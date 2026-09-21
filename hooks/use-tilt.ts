"use client";

import { useRef } from "react";
import { useMotionValue, useSpring, useReducedMotion, type MotionValue } from "framer-motion";

interface TiltHandlers {
  ref: React.RefObject<HTMLDivElement | null>;
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  onMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave: () => void;
}

/** A subtle cursor-tracked 3D tilt for cards — springs back to flat on leave. */
export function useTilt(maxDegrees = 8): TiltHandlers {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(rawX, { stiffness: 300, damping: 25, mass: 0.5 });
  const rotateY = useSpring(rawY, { stiffness: 300, damping: 25, mass: 0.5 });

  const onMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    rawY.set(px * maxDegrees);
    rawX.set(-py * maxDegrees);
  };

  const onMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return { ref, rotateX, rotateY, onMouseMove, onMouseLeave };
}
