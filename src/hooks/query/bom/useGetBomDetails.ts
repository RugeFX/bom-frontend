import apiClient from "@/api/apiClient";
import { BOM } from "@/types/bom";
import { GetResponse } from "@/types/response";
import { UndefinedInitialDataOptions, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

type DetailsResponse = GetResponse<BOM>;

export default function useGetBomDetails(
  id: number,
  options: Partial<UndefinedInitialDataOptions<DetailsResponse, AxiosError>> = {}
) {
  return useQuery<DetailsResponse, AxiosError>({
    queryKey: ["boms", "details", id],
    async queryFn() {
      const relations = [
        "material.helmet",
        "material.hardcase",
        "material.general",
        "material.medicine",
      ];
      const res = await apiClient.get<DetailsResponse>(`boms/${id}`, {
        params: { relations: relations.join(",") },
      });
      return res.data;
    },
    ...options,
  });
}
