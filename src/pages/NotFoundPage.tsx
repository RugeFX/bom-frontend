import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

export default function NotFoundPage() {
  const { pathname } = useLocation();

  return (
    <>
      <Link
        to="/"
        className={cn(
          buttonVariants({ variant: "link" }),
          "py-2 px-4 text-base fixed top-0 left-0"
        )}
      >
        &#x2190; Back to dashboard
      </Link>
      <div className="w-full min-h-screen flex flex-col items-center justify-center">
        <span className="block text-9xl font-bold text-primary">404</span>
        <h1 className="text-4xl font-bold text-foreground">Not Found</h1>
        <p className="text-muted-foreground">
          Page with the path <span className="font-semibold">"{pathname}"</span> does not exist.
        </p>
      </div>
    </>
  );
}
