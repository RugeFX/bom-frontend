import { NavLink } from "react-router-dom";
import {
  type LucideIcon,
  Home,
  PackageIcon,
  ReceiptIcon,
  DatabaseIcon,
  RulerIcon,
  WarehouseIcon,
  LibraryBigIcon,
  CrossIcon,
  BoxesIcon,
  BikeIcon,
  CassetteTapeIcon,
  ChevronDownIcon,
  HardHatIcon,
  BookOpenTextIcon,
} from "lucide-react";
import { SheetContent } from "@/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { useNavActions, useNavItemsState } from "@/store";

type SidebarItem = { name: string; Icon: LucideIcon } & (
  | { to?: undefined; subMenus: { name: string; Icon: LucideIcon; to: string }[] }
  | { to: string }
);

const sidebarItems: SidebarItem[] = [
  {
    name: "Home",
    to: "/",
    Icon: Home,
  },
  {
    name: "Reservations",
    to: "/reservations",
    Icon: BookOpenTextIcon,
  },
  {
    name: "Masters",
    to: "/masters",
    Icon: DatabaseIcon,
  },
  {
    name: "Sizes",
    to: "/sizes",
    Icon: RulerIcon,
  },
  {
    name: "Materials",
    to: "/materials",
    Icon: PackageIcon,
  },
  {
    name: "BOMs",
    to: "/boms",
    Icon: ReceiptIcon,
  },
  {
    name: "Plans",
    to: "/plans",
    Icon: WarehouseIcon,
  },
  {
    name: "Items",
    Icon: LibraryBigIcon,
    subMenus: [
      {
        name: "General",
        Icon: BoxesIcon,
        to: "/general-items",
      },
      {
        name: "Motor",
        Icon: BikeIcon,
        to: "/motor-items",
      },
      {
        name: "Helmet",
        Icon: HardHatIcon,
        to: "/helmet-items",
      },
      {
        name: "Hardcase",
        Icon: CassetteTapeIcon,
        to: "/hardcase-items",
      },
      {
        name: "FAK",
        Icon: CrossIcon,
        to: "/fak-items",
      },
    ],
  },
];

export default function SidebarNav({ mobile = false }: { mobile?: boolean }) {
  return mobile ? (
    <SheetContent side="left" className="p-0 pr-10 w-5/6 sm:max-w-md">
      <aside className="h-full m-2">
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
      {sidebarItems.map((item) =>
        item.to !== undefined ? (
          <NavLink
            key={item.name}
            className={({ isActive }) =>
              `flex w-full justify-start items-center gap-5 p-3 rounded-lg text-sm transition-colors ${
                isActive
                  ? "text-primary-foreground bg-primary"
                  : "hover:text-primary hover:bg-muted text-muted-foreground"
              }`
            }
            to={item.to}
          >
            <item.Icon className="w-5 h-5 shrink-0" />
            <span className="flex-1">{item.name}</span>
          </NavLink>
        ) : (
          <GroupItem key={item.name} name={item.name} Icon={item.Icon} subMenus={item.subMenus} />
        )
      )}
    </div>
  );
}

function GroupItem({
  name,
  Icon,
  subMenus,
}: {
  name: string;
  Icon: LucideIcon;
  subMenus: { name: string; to: string; Icon: LucideIcon }[];
}) {
  const navItemsState = useNavItemsState();
  const { setItemState } = useNavActions();

  const open = navItemsState[name];
  const onOpenChange = () => {
    setItemState(name, !open);
  };

  return (
    <Collapsible key={name} open={open} onOpenChange={onOpenChange}>
      <CollapsibleTrigger
        className={`flex w-full justify-start items-center gap-5 p-3 rounded-lg text-sm transition-colors hover:text-primary hover:bg-muted text-muted-foreground`}
      >
        <Icon className="w-5 h-5" />
        <span className="flex-1 text-start">{name}</span>
        <ChevronDownIcon
          className={cn("w-5 h-5 transition-transform", open ? "-rotate-180" : "rotate-0")}
        />
      </CollapsibleTrigger>
      <CollapsibleContent
        className={`mt-1 flex flex-col gap-1 rounded-lg bg-muted overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up [&[hidden]]:animate-none [&[hidden]]:mt-0`}
      >
        {subMenus.map((item) => (
          <NavLink
            key={item.name}
            className={({ isActive }) =>
              `flex w-full justify-start items-center gap-5 p-3 rounded-lg text-sm transition-colors ${
                isActive
                  ? "text-primary-foreground bg-primary"
                  : "hover:text-primary hover:bg-muted text-muted-foreground"
              }`
            }
            to={item.to}
          >
            <item.Icon className="w-5 h-5 shrink-0" />
            <span className="flex-1">{item.name}</span>
          </NavLink>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
