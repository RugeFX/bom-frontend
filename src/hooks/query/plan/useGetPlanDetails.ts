import apiClient from "@/api/apiClient";
import type { GetResponse } from "@/types/response";
import type { Plan } from "@/types/plan";
import { type UndefinedInitialDataOptions, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

type DetailsResponse = GetResponse<Plan>;

export default function useGetPlanDetails(
  id: number | null,
  options: Partial<UndefinedInitialDataOptions<DetailsResponse, AxiosError>> = {}
) {
  return useQuery<DetailsResponse, AxiosError>({
    queryKey: ["plans", "details", id],
    async queryFn() {
      const res = await apiClient.get<DetailsResponse>(`plans/${id}`);
      return res.data;
    },
    ...options,
  });
}
