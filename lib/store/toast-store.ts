import { create } from "zustand";

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
  /** ms before auto-dismiss; 0 disables auto-dismiss. */
  duration: number;
}

interface ToastState {
  toasts: ToastItem[];
  push: (toast: Omit<ToastItem, "id" | "duration"> & { duration?: number }) => string;
  dismiss: (id: string) => void;
}

const DEFAULT_DURATION = 4000;

/** The app-wide toast queue — call `toast(...)` from anywhere rather than using this store directly. */
export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (item) => {
    const id = crypto.randomUUID();
    set((state) => ({
      toasts: [...state.toasts, { ...item, id, duration: item.duration ?? DEFAULT_DURATION }],
    }));
    return id;
  },
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

/** Queue a toast — the single entry point the rest of the app should use. */
export function toast(options: Omit<ToastItem, "id" | "duration"> & { duration?: number }) {
  return useToastStore.getState().push(options);
}

toast.success = (title: string, description?: string) =>
  toast({ variant: "success", title, description });
toast.error = (title: string, description?: string) =>
  toast({ variant: "error", title, description });
toast.warning = (title: string, description?: string) =>
  toast({ variant: "warning", title, description });
toast.info = (title: string, description?: string) =>
  toast({ variant: "info", title, description });
