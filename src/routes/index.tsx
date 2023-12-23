import { createBrowserRouter } from "react-router-dom";
import type { QueryClient } from "@tanstack/react-query";
import NotFoundPage from "@/pages/NotFoundPage";
import DashboardLayout from "@/layouts/dashboard";
import HomePage from "@/pages/dashboard";
import MasterPage, { loader as masterLoader } from "@/pages/master";
import BomPage, { loader as bomLoader } from "@/pages/bom";
import MaterialPage, { loader as materialLoader } from "@/pages/material";

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
          path: "/materials",
          element: <MaterialPage />,
          loader: materialLoader(queryClient),
        },
        {
          path: "/boms",
          element: <BomPage />,
          loader: bomLoader(queryClient),
        },
      ],
    },
    {
      path: "*",
      element: <NotFoundPage />,
    },
  ]);
