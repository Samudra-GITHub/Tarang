export function PlaceholderPage({ title, note }: { title: string; note: string }) {
  return (
    <div className="flex flex-col gap-2 px-4 py-6 md:px-6">
      <h1 className="font-heading text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="text-sm text-muted-foreground">{note}</p>
    </div>
  );
}
