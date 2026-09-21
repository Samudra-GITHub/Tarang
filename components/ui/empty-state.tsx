"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  className?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`flex flex-col items-center gap-4 px-4 py-14 text-center ${className ?? ""}`}
    >
      <div className="relative flex size-20 items-center justify-center">
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/15 blur-xl"
          animate={reduced ? undefined : { scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          animate={reduced ? undefined : { y: [0, -6, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex size-16 items-center justify-center rounded-2xl bg-surface-2 ring-1 ring-border-strong"
        >
          <Icon className="size-7 text-primary" aria-hidden />
        </motion.div>
      </div>

      <div className="flex flex-col gap-1">
        <p className="font-heading text-base font-semibold text-foreground">{title}</p>
        <p className="max-w-xs text-sm text-muted-foreground">{description}</p>
      </div>

      {(action || secondaryAction) && (
        <div className="mt-1 flex items-center gap-3">
          {action &&
            (action.href ? (
              <Button asChild size="sm" className="rounded-full">
                <Link href={action.href}>{action.label}</Link>
              </Button>
            ) : (
              <Button size="sm" className="rounded-full" onClick={action.onClick}>
                {action.label}
              </Button>
            ))}
          {secondaryAction &&
            (secondaryAction.href ? (
              <Button asChild size="sm" variant="ghost" className="rounded-full">
                <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
              </Button>
            ) : (
              <Button size="sm" variant="ghost" className="rounded-full" onClick={secondaryAction.onClick}>
                {secondaryAction.label}
              </Button>
            ))}
        </div>
      )}
    </motion.div>
  );
}
