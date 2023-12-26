import { type UndefinedInitialDataOptions, useQuery } from "@tanstack/react-query";
import apiClient from "@/api/apiClient";
import type { GetResponse } from "@/types/response";
import type { AnyItem } from "@/types/items";
import type { AxiosError } from "axios";
import type { ItemModelValues } from "@/lib/models";

type DetailsResponse = GetResponse<AnyItem>;

export default function useGetItemDetails(
  code: string | null,
  model: ItemModelValues,
  options: Partial<UndefinedInitialDataOptions<DetailsResponse, AxiosError>> = {}
) {
  return useQuery<DetailsResponse, AxiosError>({
    queryKey: ["items", "details", model, code],
    async queryFn() {
      const res = await apiClient.get<DetailsResponse>(`${model}Items/${code}`);
      return res.data;
    },
    ...options,
  });
}
