"use client";

import { motion } from "framer-motion";
import type { MoodEnvironment } from "@/data/moods";
import { WaveformAccent } from "@/components/decorative/waveform-accent";
import { FloatingParticles } from "@/components/decorative/floating-particles";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

function RippleRings({ color, fast = false }: { color: string; fast?: boolean }) {
  const reduced = useReducedMotion();
  const rings = [0, 1, 2, 3];

  return (
    <div className="absolute inset-0 flex items-center justify-center" aria-hidden>
      {rings.map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border"
          style={{ borderColor: color, width: 60, height: 60 }}
          initial={{ scale: 1, opacity: 0.7 }}
          animate={reduced ? undefined : { scale: [1, fast ? 6 : 10], opacity: [0.55, 0] }}
          transition={{
            duration: fast ? 3.2 : 6,
            repeat: Infinity,
            ease: "easeOut",
            delay: i * (fast ? 0.8 : 1.5),
          }}
        />
      ))}
    </div>
  );
}

function AuroraBlobs({ color }: { color: string }) {
  const reduced = useReducedMotion();
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <motion.div
        className="absolute -top-32 left-[-10%] size-[460px] rounded-full blur-[130px]"
        style={{ background: color, opacity: 0.35 }}
        animate={reduced ? undefined : { x: [0, 60, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-15%] right-[-5%] size-[400px] rounded-full blur-[120px]"
        style={{ background: color, opacity: 0.25 }}
        animate={reduced ? undefined : { x: [0, -40, 0], y: [0, -25, 0] }}
        transition={{ duration: 21, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
    </div>
  );
}

function WaveBands({ color }: { color: string }) {
  const reduced = useReducedMotion();
  const bands = [0, 1, 2];
  return (
    <div className="absolute inset-x-0 bottom-0 h-2/3 overflow-hidden" aria-hidden>
      {bands.map((i) => (
        <motion.svg
          key={i}
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          className="absolute bottom-0 h-full w-[200%]"
          style={{ opacity: 0.18 + i * 0.1 }}
          animate={reduced ? undefined : { x: [0, -720] }}
          transition={{ duration: 16 + i * 6, repeat: Infinity, ease: "linear" }}
        >
          <path
            d="M0,80 C240,140 480,20 720,60 C960,100 1200,160 1440,90 L1440,200 L0,200 Z M1440,80 C1680,140 1920,20 2160,60 C2400,100 2640,160 2880,90 L2880,200 L1440,200 Z"
            fill={color}
          />
        </motion.svg>
      ))}
    </div>
  );
}

export function MoodEnvironmentBackground({
  environment,
  color,
  className,
}: {
  environment: MoodEnvironment;
  color: string;
  className?: string;
}) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)} aria-hidden>
      <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 30%, color-mix(in srgb, ${color} 30%, transparent), transparent 70%)` }} />

      {environment === "ripple" && <RippleRings color={color} />}
      {environment === "pulse" && <RippleRings color={color} fast />}
      {environment === "aurora" && <AuroraBlobs color={color} />}
      {environment === "wave" && <WaveBands color={color} />}
      {environment === "particles" && (
        <>
          <AuroraBlobs color={color} />
          <FloatingParticles count={26} />
        </>
      )}
      {environment === "waveform" && (
        <div className="absolute inset-x-0 bottom-0 flex justify-center opacity-40">
          <WaveformAccent className="h-40 w-full max-w-2xl md:h-56" />
        </div>
      )}
    </div>
  );
}
