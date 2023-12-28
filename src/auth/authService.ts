import apiClient from "@/api/apiClient";
import { useStore } from "@/store";
import type { LoginPayload } from "@/types/auth";
import type { BaseResponse, LoginResponse, MyProfileResponse } from "@/types/response";

export const login = async (payload: LoginPayload) => {
  await apiClient.get("csrf-cookie");

  const res = await apiClient.post<LoginResponse>("auth", payload);
  return res.data;
};

export const logout = async () => {
  const res = await apiClient.post<BaseResponse>("logout");
  return res.data;
};

export const getProfileInfo = async () => {
  const res = await apiClient.get<MyProfileResponse>("profile");
  return res.data;
};

export const updateLocalAccessToken = (accessToken?: string) => {
  useStore.setState({ accessToken });
};
