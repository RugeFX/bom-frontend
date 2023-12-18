import { NavLink } from "react-router-dom";
import { type LucideIcon, Home, BoxIcon, PackageIcon } from "lucide-react";
import { SheetContent } from "@/components/ui/sheet";

const sidebarItems: { name: string; to: string; Icon: LucideIcon }[] = [
  {
    name: "Home",
    to: "/",
    Icon: Home,
  },
  {
    name: "Masters",
    to: "/masters",
    Icon: BoxIcon,
  },
  {
    name: "Generals",
    to: "/generals",
    Icon: PackageIcon,
  },
];

export default function SidebarNav({ mobile = false }: { mobile?: boolean }) {
  return mobile ? (
    <SheetContent side="left" className="p-0 pr-12 w-5/6 sm:max-w-2xl">
      <aside className="h-full">
        <SidebarItems />
      </aside>
    </SheetContent>
  ) : (
    <aside className="w-64 pl-4 py-2 h-full hidden flex-col md:flex">
      <SidebarItems />
    </aside>
  );
}

function SidebarItems() {
  return (
    <div className="space-y-1">
      {sidebarItems.map(({ name, to, Icon }) => (
        <NavLink
          key={name}
          className={({ isActive }) =>
            `flex w-full justify-start items-center gap-5 p-3 rounded-lg text-sm transition-colors ${
              isActive
                ? "text-primary-foreground bg-primary"
                : "hover:text-primary hover:bg-muted text-muted-foreground"
            }`
          }
          to={to}
        >
          <Icon className="w-5 h-5" />
          <span className="flex-1">{name}</span>
        </NavLink>
      ))}
    </div>
  );
}
