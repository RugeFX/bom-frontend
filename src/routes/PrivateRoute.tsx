import { useAccessToken } from "@/store";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
  const token = useAccessToken();
  if (token) return <Outlet />;

  return <Navigate to="/login" replace />;
}
