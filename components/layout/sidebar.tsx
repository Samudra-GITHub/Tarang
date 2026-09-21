import { SidebarContent } from "@/components/layout/sidebar-content";

export function Sidebar() {
  return (
    <aside
      className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar md:flex"
      aria-label="Main navigation"
    >
      <SidebarContent />
    </aside>
  );
}
