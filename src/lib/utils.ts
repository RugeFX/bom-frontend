import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";
import type { Theme } from "@/store/slices/themeSlice";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function changeRootTheme(theme: Theme) {
  const root = window.document.documentElement;

  root.classList.remove("light", "dark");

  if (theme === "system") {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

    root.classList.add(systemTheme);
    return;
  }

  root.classList.add(theme);
}

export function apiAsset(path: string) {
  return `${import.meta.env.VITE_BASE_API_URL}/${path}`;
}

export function convertToIDR(number: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(number);
}

export function convertToUSD(number: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(number);
}

export function parseDateStringToLocale(ds: string) {
  return new Date(ds).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
