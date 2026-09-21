export function CardProgress({ value }: { value: number }) {
  const clamped = Math.min(1, Math.max(0, value));
  return (
    <div className="absolute inset-x-0 bottom-0 h-1 bg-black/40">
      <div
        className="h-full bg-primary"
        style={{ width: `${clamped * 100}%` }}
        role="progressbar"
        aria-valuenow={Math.round(clamped * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}
