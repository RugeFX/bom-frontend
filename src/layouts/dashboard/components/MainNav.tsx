import { Icons } from "@/components/Icons";
import ThemeToggler from "@/components/theme/ThemeToggler";
import { Button } from "@/components/ui/button";
import { SheetTrigger } from "@/components/ui/sheet";
import { ListIcon } from "lucide-react";
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
            <ListIcon className="text-foreground" aria-label="Open sidebar" />
          </Button>
        </SheetTrigger>
      )}
      <div className={"flex w-full justify-between items-center"}>
        <Link to="/" className="py-4 flex gap-2 justify-center">
          <Icons.logo className="w-8 h-8 text-primary" aria-label="Dashboard" />
          <span className="text-xl font-bold hidden whitespace-nowrap lg:block">BOM Ruge</span>
        </Link>
        <div className="flex w-full max-w-md justify-end items-center gap-2">
          <ThemeToggler />
        </div>
      </div>
    </nav>
  );
}
