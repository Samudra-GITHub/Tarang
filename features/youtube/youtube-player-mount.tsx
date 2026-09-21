import { YOUTUBE_PLAYER_CONTAINER_ID } from "./youtube-engine";

/** Hidden host node for the YouTube IFrame Player — Tarang's own UI drives playback, never YouTube's chrome. */
export function YoutubePlayerMount() {
  return (
    <div
      aria-hidden
      style={{ position: "fixed", bottom: 0, right: 0, width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
    >
      <div id={YOUTUBE_PLAYER_CONTAINER_ID} />
    </div>
  );
}
