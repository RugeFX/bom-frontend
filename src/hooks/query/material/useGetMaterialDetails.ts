import apiClient from "@/api/apiClient";
import { MaterialItem } from "@/types/material";
import { GetResponse } from "@/types/response";
import { UndefinedInitialDataOptions, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

type DetailsResponse = GetResponse<MaterialItem>;

export default function useGetMaterialDetails(
  itemCode: string,
  options: Partial<UndefinedInitialDataOptions<DetailsResponse, AxiosError>> = {}
) {
  return useQuery<DetailsResponse, AxiosError>({
    queryKey: ["materials", "details", itemCode],
    async queryFn() {
      const res = await apiClient.get<DetailsResponse>(`materials/${itemCode}`);
      return res.data;
    },
    ...options,
  });
}
