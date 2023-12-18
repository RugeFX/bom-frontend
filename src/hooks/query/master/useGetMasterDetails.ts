import apiClient from "@/api/apiClient";
import { Category } from "@/types/category";
import { Master } from "@/types/master";
import { GetResponse } from "@/types/response";
import { UndefinedInitialDataOptions, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

type MasterDetailResponse = GetResponse<Master & { category: Category }>;

export default function useGetMasterDetails(
  id: number,
  options: Partial<UndefinedInitialDataOptions<MasterDetailResponse, AxiosError>> = {}
) {
  return useQuery<MasterDetailResponse, AxiosError>({
    queryKey: ["masters", "details", id],
    async queryFn() {
      const res = await apiClient.get<MasterDetailResponse>(`masters/${id}`, {
        params: { relations: "category" },
      });
      return res.data;
    },
    ...options,
  });
}
