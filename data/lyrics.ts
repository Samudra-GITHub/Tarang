export interface LyricLine {
  time: number;
  text: string;
}

/**
 * Hand-timed lyrics for a handful of flagship tracks, enough to demonstrate
 * synced scrolling. Most of the catalog has no lyrics yet — that's an honest
 * empty state, not a bug.
 */
export const lyricsBySongId: Record<string, LyricLine[]> = {
  "album-tarang-t1": [
    { time: 0, text: "♪ instrumental ♪" },
    { time: 12, text: "Every wave that leaves the shore" },
    { time: 18, text: "Carries something gone before" },
    { time: 24, text: "Tarang, tarang, ripple through the dark" },
    { time: 31, text: "Find the light, follow the spark" },
    { time: 40, text: "I was still, now I'm the tide" },
    { time: 47, text: "Nothing left for me to hide" },
    { time: 55, text: "♪ instrumental ♪" },
    { time: 68, text: "Every wave that leaves the shore" },
    { time: 74, text: "Carries something gone before" },
    { time: 82, text: "Tarang, tarang, ripple through the dark" },
    { time: 90, text: "Find the light, follow the spark" },
    { time: 105, text: "Underneath the water's skin" },
    { time: 112, text: "Every ending, a begin" },
    { time: 130, text: "♪ instrumental ♪" },
    { time: 160, text: "Tarang, tarang, ripple through the dark" },
    { time: 168, text: "Find the light, follow the spark" },
    { time: 200, text: "♪ instrumental outro ♪" },
  ],
  "album-golden-hour-t1": [
    { time: 0, text: "♪ instrumental ♪" },
    { time: 9, text: "Six o'clock and the sky's on fire" },
    { time: 14, text: "Nowhere else that I'd rather be" },
    { time: 20, text: "You're the gold in my golden hour" },
    { time: 26, text: "Only light I need to see" },
    { time: 33, text: "Windows down, radio low" },
    { time: 38, text: "Every mile feels like home" },
    { time: 45, text: "You're the gold in my golden hour" },
    { time: 51, text: "Never letting this one go" },
    { time: 65, text: "♪ instrumental ♪" },
    { time: 90, text: "Six o'clock and the sky's on fire" },
    { time: 96, text: "Nowhere else that I'd rather be" },
    { time: 110, text: "You're the gold in my golden hour" },
    { time: 130, text: "♪ fade out ♪" },
  ],
  "album-analog-hearts-t1": [
    { time: 0, text: "♪ instrumental ♪" },
    { time: 14, text: "Paper skies above the town" },
    { time: 20, text: "Fold the edges, let it down" },
    { time: 27, text: "We were static, we were young" },
    { time: 33, text: "Every heartbeat someone sung" },
    { time: 45, text: "I kept your letters in a drawer" },
    { time: 51, text: "Didn't know what love was for" },
    { time: 58, text: "Paper skies, they tear so slow" },
    { time: 64, text: "Some things you just have to know" },
    { time: 90, text: "♪ instrumental ♪" },
    { time: 120, text: "We were static, we were young" },
    { time: 126, text: "Every heartbeat someone sung" },
    { time: 160, text: "♪ instrumental outro ♪" },
  ],
  "album-slow-burn-t1": [
    { time: 0, text: "♪ instrumental ♪" },
    { time: 16, text: "Slow burn, don't you rush the fire" },
    { time: 23, text: "Let it climb up, take us higher" },
    { time: 30, text: "Slow burn, in no hurry now" },
    { time: 37, text: "We got time to figure out how" },
    { time: 55, text: "Candle low but the wax still gold" },
    { time: 61, text: "Some things better when they unfold" },
    { time: 75, text: "Slow burn, don't you rush the fire" },
    { time: 82, text: "Let it climb up, take us higher" },
    { time: 110, text: "♪ instrumental ♪" },
    { time: 150, text: "Slow burn, in no hurry now" },
    { time: 157, text: "We got time to figure out how" },
    { time: 190, text: "♪ fade out ♪" },
  ],
};
