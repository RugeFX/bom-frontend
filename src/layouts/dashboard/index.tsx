import { Toaster } from "@/components/ui/toaster";
import MainNav from "./components/MainNav";
import SidebarNav from "./components/SidebarNav";
import { Outlet, useLocation } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { Sheet } from "@/components/ui/sheet";
import { useEffect, useState } from "react";

export default function DashboardLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const { pathname } = useLocation();

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  return (
    <>
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <div className="flex flex-col w-full min-h-screen">
          <div className="border-b">
            <div className="flex h-16 items-center justify-end px-4">
              <MainNav mobile={isMobile} />
            </div>
          </div>
          <div className="flex-1 flex">
            <SidebarNav mobile={isMobile} />
            <div className="flex-1 min-w-0">
              <Outlet />
            </div>
          </div>
        </div>
      </Sheet>
      <Toaster />
    </>
  );
}
