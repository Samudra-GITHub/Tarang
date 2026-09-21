import { create } from "zustand";
import { persist } from "zustand/middleware";

export type VisualizerStyle = "bars" | "mirror" | "dots" | "line";

const STYLES: VisualizerStyle[] = ["bars", "mirror", "dots", "line"];

export const VISUALIZER_STYLE_LABELS: Record<VisualizerStyle, string> = {
  bars: "Bars",
  mirror: "Mirror",
  dots: "Dots",
  line: "Line",
};

interface VisualizerState {
  style: VisualizerStyle;
  cycleStyle: () => void;
}

export const useVisualizerStore = create<VisualizerState>()(
  persist(
    (set, get) => ({
      style: "bars",
      cycleStyle: () => {
        const nextIndex = (STYLES.indexOf(get().style) + 1) % STYLES.length;
        set({ style: STYLES[nextIndex] });
      },
    }),
    { name: "tarang-visualizer" },
  ),
);
