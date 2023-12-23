import apiClient from "@/api/apiClient";
import type { GetResponse } from "@/types/response";
import { Size } from "@/types/size";
import { type UndefinedInitialDataOptions, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

type DetailsResponse = GetResponse<Size>;

export default function useGetSizeDetails(
  id: number | null,
  options: Partial<UndefinedInitialDataOptions<DetailsResponse, AxiosError>> = {}
) {
  return useQuery<DetailsResponse, AxiosError>({
    queryKey: ["sizes", "details", id],
    async queryFn() {
      const res = await apiClient.get<DetailsResponse>(`sizes/${id}`);
      return res.data;
    },
    ...options,
  });
}
