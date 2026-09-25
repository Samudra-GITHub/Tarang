"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTilt } from "@/hooks/use-tilt";
import { easings } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { LinearProgress } from "@/components/ui/progress";
import { Body, Caption } from "@/components/ui/typography";
import { FOCUS_RING } from "@/lib/a11y";

export interface CardProps {
  /** Card width — matches the rail sizing used across Home/Search/Library. */
  width?: "sm" | "md" | "lg";
  tiltDegrees?: number;
  className?: string;
  children: React.ReactNode;
}

const WIDTH_CLASSES = {
  sm: "w-32 sm:w-36",
  md: "w-40 sm:w-44",
  lg: "w-44 sm:w-52",
} as const;

/** The tilt+hover motion wrapper shared by every card in Tarang. */
function Card({ width = "md", tiltDegrees = 8, className, children }: CardProps) {
  const { ref, rotateX, rotateY, onMouseMove, onMouseLeave } = useTilt(tiltDegrees);
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      whileHover={reducedMotion ? undefined : { y: -6, scale: 1.03 }}
      whileTap={reducedMotion ? undefined : { scale: 0.97 }}
      transition={easings.springSnappy}
      style={reducedMotion ? undefined : { rotateX, rotateY, transformPerspective: 800 }}
      className={cn("group shrink-0", WIDTH_CLASSES[width], className)}
      tabIndex={-1}
    >
      {children}
    </motion.div>
  );
}

export interface CardArtworkProps {
  src: string;
  alt?: string;
  href?: string;
  onClick?: () => void;
  ariaLabel: string;
  shape?: "square" | "circle" | "tall";
  /** Highlights the artwork as the current selection (e.g. active in a picker). */
  selected?: boolean;
  loading?: boolean;
  badge?: React.ReactNode;
  /** 0–1 download/watch progress, rendered as a thin bar along the bottom edge. */
  progress?: number;
  /** Tints the hover glow with this artwork's own dominant color — pass `useDominantColor(src)`. Falls back to the brand accent. */
  glowColor?: string;
  children?: React.ReactNode;
}

const SHAPE_CLASSES = {
  square: "aspect-square rounded-xl",
  tall: "aspect-[4/5] rounded-xl",
  circle: "aspect-square rounded-full",
} as const;

/**
 * The artwork slot shared by every card — image, hover sheen, optional badge/progress,
 * and either a real `<Link>` (real catalog pages) or a click handler (synthetic search
 * results, quick-look popups). `children` is for an absolutely-positioned overlay, e.g. PlayButton.
 */
function CardArtwork({
  src,
  alt = "",
  href,
  onClick,
  ariaLabel,
  shape = "square",
  selected = false,
  loading = false,
  badge,
  progress,
  glowColor,
  children,
}: CardArtworkProps) {
  const content = (
    <>
      {loading ? (
        <div className="flex size-full items-center justify-center bg-surface-2">
          <Spinner />
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="176px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
      {badge && <div className="absolute top-2 left-2">{badge}</div>}
    </>
  );

  const wrapperClassName = cn(
    "relative block w-full overflow-hidden border bg-surface-2 shadow-md shadow-black/20 transition-shadow duration-300 group-hover:shadow-[0_10px_30px_-8px_rgba(0,0,0,0.5),0_0_28px_-4px_var(--card-glow)]",
    FOCUS_RING,
    SHAPE_CLASSES[shape],
    selected ? "border-primary" : "border-border",
  );
  const glowStyle = { "--card-glow": glowColor ?? "var(--primary)" } as React.CSSProperties;

  return (
    <div className="relative" style={glowStyle}>
      {href ? (
        <Link href={href} className={wrapperClassName} aria-label={ariaLabel}>
          {content}
        </Link>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={onClick}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onClick?.();
            }
          }}
          className={cn(wrapperClassName, "cursor-pointer text-left")}
          aria-label={ariaLabel}
        >
          {content}
        </div>
      )}
      {children}
      {progress !== undefined && (
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 overflow-hidden",
            shape === "circle" ? "rounded-b-full" : "rounded-b-xl",
          )}
        >
          <LinearProgress value={progress} trackClassName="h-1 bg-black/40" aria-label="Progress" />
        </div>
      )}
    </div>
  );
}

export interface CardBodyProps {
  className?: string;
  children: React.ReactNode;
}

/** The text block under a card's artwork — pairs with CardTitle/CardSubtitle. */
function CardBody({ className, children }: CardBodyProps) {
  return <div className={cn("mt-2.5 min-w-0", className)}>{children}</div>;
}

export interface CardTitleProps {
  href?: string;
  className?: string;
  children: React.ReactNode;
}

/** A card's primary line — links to the real page when one exists. */
function CardTitle({ href, className, children }: CardTitleProps) {
  const classes = cn("block truncate font-medium text-foreground", className);
  if (href) {
    return (
      <Link href={href} className={cn(classes, "hover:underline")}>
        {children}
      </Link>
    );
  }
  return <Body className={classes}>{children}</Body>;
}

export interface CardSubtitleProps {
  href?: string;
  className?: string;
  children: React.ReactNode;
}

/** A card's secondary line — artist name, description, or other metadata. */
function CardSubtitle({ href, className, children }: CardSubtitleProps) {
  if (href) {
    return (
      <Link href={href} className="block truncate">
        <Caption className={cn("hover:text-foreground hover:underline", className)}>
          {children}
        </Caption>
      </Link>
    );
  }
  return <Caption className={cn("block truncate", className)}>{children}</Caption>;
}

export { Card, CardArtwork, CardBody, CardTitle, CardSubtitle };
