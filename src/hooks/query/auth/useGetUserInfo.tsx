import { getProfileInfo } from "@/auth/authService";
import { useQuery, type UndefinedInitialDataOptions } from "@tanstack/react-query";
import { type AxiosError } from "axios";
import type { MyProfileResponse } from "@/types/response";

export default function useGetUserInfo(
  options?: Partial<UndefinedInitialDataOptions<MyProfileResponse, AxiosError>>
) {
  return useQuery<MyProfileResponse, AxiosError>({
    queryKey: ["user-info"],
    queryFn: getProfileInfo,
    ...options,
  });
}
