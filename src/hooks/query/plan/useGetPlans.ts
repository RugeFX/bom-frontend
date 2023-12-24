import apiClient from "@/api/apiClient";
import { type UndefinedInitialDataOptions, useQuery } from "@tanstack/react-query";
import type { GetResponse } from "@/types/response";
import type { Plan } from "@/types/plan";
import type { AxiosError } from "axios";

type DetailsResponse = GetResponse<Plan[]>;

export default function useGetPlans(
  options: Partial<UndefinedInitialDataOptions<Plan[], AxiosError>> = {}
) {
  return useQuery<Plan[], AxiosError>({
    queryKey: ["plans"],
    async queryFn() {
      const res = await apiClient.get<DetailsResponse>(`plans`);
      return res.data.data;
    },
    ...options,
  });
}
