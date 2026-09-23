import { SidebarContent } from "@/components/layout/sidebar-content";
import { GLASS_PANEL } from "@/lib/glass";
import { cn } from "@/lib/utils";

export function Sidebar() {
  return (
    <aside
      className={cn("m-3 hidden w-64 shrink-0 md:flex", GLASS_PANEL)}
      aria-label="Main navigation"
    >
      <SidebarContent />
    </aside>
  );
}
