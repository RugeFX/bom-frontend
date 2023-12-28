import { type RouteObject, createBrowserRouter, redirect } from "react-router-dom";
import type { QueryClient } from "@tanstack/react-query";
import NotFoundPage from "@/pages/NotFoundPage";
import DashboardLayout from "@/layouts/dashboard";
import HomePage from "@/pages/dashboard";
import PrivateRoute from "./PrivateRoute";
import ScannerPage from "@/pages/scanner";
import MasterPage, { loader as masterLoader } from "@/pages/master";
import ReservationPage, { loader as reservationLoader } from "@/pages/reservation";
import BomPage, { loader as bomLoader } from "@/pages/bom";
import MaterialPage, { loader as materialLoader } from "@/pages/material";
import SizePage, { loader as sizeLoader } from "@/pages/size";
import PlanPage, { loader as planLoader } from "@/pages/plan";
import GeneralItemPage, { loader as generalItemLoader } from "@/pages/items/general";
import FAKItemPage, { loader as fakItemLoader } from "@/pages/items/fak";
import HelmetItemPage, { loader as helmetItemLoader } from "@/pages/items/helmet";
import MotorItemPage, { loader as motorItemLoader } from "@/pages/items/motor";
import HardcaseItemPage, { loader as hardcaseItemLoader } from "@/pages/items/hardcase";
import LoginPage from "@/pages/login";
import GuestRoute from "./GuestRoute";

const privateRoutes = (queryClient: QueryClient): RouteObject => ({
  element: <PrivateRoute />,
  children: [
    {
      path: "/",
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
          path: "/reservations",
          element: <ReservationPage />,
          loader: reservationLoader(queryClient),
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
  ],
});

const publicRoutes: RouteObject = {
  element: <GuestRoute />,
  children: [
    {
      path: "/",
      loader() {
        return redirect("/login");
      },
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
  ],
};

export const router = (queryClient: QueryClient) =>
  createBrowserRouter([publicRoutes, privateRoutes(queryClient)]);
