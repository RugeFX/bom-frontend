import { useLocation } from "react-router-dom";

export default function NotFoundPage() {
  const { pathname } = useLocation();

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center">
      <span className="block text-9xl font-bold text-primary">404</span>
      <h1 className="text-4xl font-bold text-foreground">Not Found</h1>
      <p className="text-muted-foreground">
        Path <span className="font-semibold">"{pathname}"</span> does not exist.
      </p>
    </div>
  );
}
