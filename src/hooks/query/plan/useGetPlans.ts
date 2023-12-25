import apiClient from "@/api/apiClient";
import {
  type DefinedInitialDataOptions,
  type FetchQueryOptions,
  useQuery,
} from "@tanstack/react-query";
import type { GetResponse } from "@/types/response";
import type { Plan } from "@/types/plan";
import type { AxiosError } from "axios";

type DetailsResponse = GetResponse<Plan[]>;

export const plansQuery: FetchQueryOptions<Plan[], AxiosError> = {
  queryKey: ["plans"],
  async queryFn() {
    const res = await apiClient.get<DetailsResponse>(`plans`);
    return res.data.data;
  },
};

export default function useGetPlans(
  options: Omit<DefinedInitialDataOptions<Plan[], AxiosError, Plan[]>, "queryKey" | "queryFn"> = {
    initialData: [],
  }
) {
  return useQuery({
    ...options,
    ...plansQuery,
    initialData: options.initialData,
  });
}
