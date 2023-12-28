import { useAccessToken } from "@/store";
import { Navigate, Outlet } from "react-router-dom";

export default function GuestRoute() {
  const token = useAccessToken();
  if (token) return <Navigate to="/" replace />;

  return <Outlet />;
}
