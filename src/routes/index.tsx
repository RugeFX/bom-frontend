import { createBrowserRouter } from "react-router-dom";
import type { QueryClient } from "@tanstack/react-query";
import NotFoundPage from "@/pages/NotFoundPage";
import DashboardLayout from "@/layouts/dashboard";
import HomePage from "@/pages/dashboard";
import MasterPage, { loader as masterLoader } from "@/pages/master";
import BomPage, { loader as bomLoader } from "@/pages/bom";
import MaterialPage, { loader as materialLoader } from "@/pages/material";
import SizePage, { loader as sizeLoader } from "@/pages/size";
import PlanPage, { loader as planLoader } from "@/pages/plan";
import GeneralItemPage, { loader as generalItemLoader } from "@/pages/items/general";
import FAKItemPage, { loader as fakItemLoader } from "@/pages/items/fak";
import HelmetItemPage, { loader as helmetItemLoader } from "@/pages/items/helmet";
import MotorItemPage, { loader as motorItemLoader } from "@/pages/items/motor";
import HardcaseItemPage, { loader as hardcaseItemLoader } from "@/pages/items/hardcase";
import ScannerPage from "@/pages/scanner";

export const router = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      element: <DashboardLayout />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: "/masters",
          element: <MasterPage />,
          loader: masterLoader(queryClient),
        },
        {
          path: "/sizes",
          element: <SizePage />,
          loader: sizeLoader(queryClient),
        },
        {
          path: "/materials",
          element: <MaterialPage />,
          loader: materialLoader(queryClient),
        },
        {
          path: "/boms",
          element: <BomPage />,
          loader: bomLoader(queryClient),
        },
        {
          path: "/plans",
          element: <PlanPage />,
          loader: planLoader(queryClient),
        },
        {
          path: "/general-items",
          element: <GeneralItemPage />,
          loader: generalItemLoader(queryClient),
        },
        {
          path: "/motor-items",
          element: <MotorItemPage />,
          loader: motorItemLoader(queryClient),
        },
        {
          path: "/helmet-items",
          element: <HelmetItemPage />,
          loader: helmetItemLoader(queryClient),
        },
        {
          path: "/hardcase-items",
          element: <HardcaseItemPage />,
          loader: hardcaseItemLoader(queryClient),
        },
        {
          path: "/fak-items",
          element: <FAKItemPage />,
          loader: fakItemLoader(queryClient),
        },
        {
          path: "/scan",
          element: <ScannerPage />,
        },
      ],
    },
    {
      path: "*",
      element: <NotFoundPage />,
    },
  ]);
