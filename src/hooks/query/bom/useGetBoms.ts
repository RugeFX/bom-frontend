import apiClient from "@/api/apiClient";
import type { BOM } from "@/types/bom";
import type { GetResponse } from "@/types/response";
import { useQuery, type FetchQueryOptions, DefinedInitialDataOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const bomsQuery: FetchQueryOptions<BOM[], AxiosError> = {
  queryKey: ["boms"],
  queryFn: async () => {
    const relations = [
      "material.helmet",
      "material.hardcase",
      "material.general",
      "material.medicine",
      "material.motor",
    ];
    const res = await apiClient.get<GetResponse<BOM[]>>("boms", {
      params: { relations: relations.join(",") },
    });

    return res.data.data;
  },
};

export default function useGetBoms(
  options: Omit<DefinedInitialDataOptions<BOM[], AxiosError, BOM[]>, "queryKey" | "queryFn"> = {
    initialData: [],
  }
) {
  return useQuery({ ...bomsQuery, ...options, initialData: options.initialData });
}
