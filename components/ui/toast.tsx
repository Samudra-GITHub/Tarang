"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, X, AlertTriangle, XCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToastStore, type ToastItem, type ToastVariant } from "@/lib/store/toast-store";
import { Body, Caption } from "@/components/ui/typography";
import { toastEnter } from "@/lib/motion-variants";
import { useMotionVariant, useReducedMotion } from "@/hooks/use-reduced-motion";

const VARIANT_ICON: Record<ToastVariant, React.ElementType> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const VARIANT_COLOR: Record<ToastVariant, string> = {
  success: "text-accent-success",
  error: "text-accent-danger",
  warning: "text-accent-warning",
  info: "text-primary",
};

function ToastCard({ toast }: { toast: ToastItem }) {
  const dismiss = useToastStore((s) => s.dismiss);
  const Icon = VARIANT_ICON[toast.variant];
  const reducedMotion = useReducedMotion();
  const variants = useMotionVariant(toastEnter);

  React.useEffect(() => {
    if (toast.duration <= 0) return;
    const timer = setTimeout(() => dismiss(toast.id), toast.duration);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, dismiss]);

  return (
    <motion.div
      layout={!reducedMotion}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      role={toast.variant === "error" ? "alert" : "status"}
      className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-border bg-surface-modal p-3.5 shadow-lg shadow-black/40"
    >
      <Icon className={cn("mt-0.5 size-5 shrink-0", VARIANT_COLOR[toast.variant])} aria-hidden />
      <div className="min-w-0 flex-1">
        <Body className="font-medium">{toast.title}</Body>
        {toast.description && <Caption className="mt-0.5 block">{toast.description}</Caption>}
      </div>
      <button
        type="button"
        onClick={() => dismiss(toast.id)}
        aria-label="Dismiss notification"
        className="text-muted-foreground hover:text-foreground"
      >
        <X className="size-4" aria-hidden />
      </button>
    </motion.div>
  );
}

/** Renders the app-wide toast queue — mounted once, near the root layout. */
function ToastViewport() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex flex-col items-center gap-2 px-4 md:inset-x-auto md:right-4 md:bottom-6 md:items-end"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <ToastCard key={t.id} toast={t} />
        ))}
      </AnimatePresence>
    </div>
  );
}

export { ToastViewport };
