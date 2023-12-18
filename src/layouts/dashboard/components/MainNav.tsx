import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { List, Search } from "lucide-react";
import { Link } from "react-router-dom";

interface MainNavProps extends React.HTMLAttributes<HTMLElement> {
  mobile: boolean;
}

export default function MainNav({ mobile, ...props }: MainNavProps) {
  return (
    <nav className={"flex w-full justify-between items-center"} {...props}>
      {mobile && (
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="mr-2">
            <List className="text-foreground" aria-label="Open sidebar" />
          </Button>
        </SheetTrigger>
      )}
      <div className={"flex w-full justify-between items-center"}>
        <Link to="/" className="py-4 flex gap-2 justify-center">
          <Icons.logo className="w-8 h-8 text-primary" aria-label="Dashboard" />
          <span className="text-xl font-bold hidden whitespace-nowrap lg:block">BOM Ruge</span>
        </Link>
        <div
          className={
            "hidden sm:flex w-full max-w-md h-10 items-center rounded-md border border-input pl-3 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
          }
        >
          <Search className="h-5 w-5 absolute pointer-events-none" />
          <input
            type="search"
            placeholder="Search"
            className="w-full p-2 bg-background pl-8 placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>
    </nav>
  );
}
