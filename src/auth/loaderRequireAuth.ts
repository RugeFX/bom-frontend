import { useStore } from "@/store";
import { redirect } from "react-router-dom";

export default async function loaderRequireAuth() {
  const token = useStore.getState().accessToken;
  if (!token) {
    throw redirect("/login");
  }
}
