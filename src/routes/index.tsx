import { createBrowserRouter } from "react-router-dom";
import type { QueryClient } from "@tanstack/react-query";
import NotFoundPage from "@/pages/NotFoundPage";
import DashboardLayout from "@/layouts/dashboard";
import HomePage from "@/pages/dashboard";
import MasterPage, { loader as masterLoader } from "@/pages/master";
import GeneralPage, { loader as generalLoader } from "@/pages/general";

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
          path: "/generals",
          element: <GeneralPage />,
          loader: generalLoader(queryClient),
        },
      ],
    },
    {
      path: "*",
      element: <NotFoundPage />,
    },
  ]);
