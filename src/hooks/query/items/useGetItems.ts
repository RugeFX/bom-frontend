import apiClient from "@/api/apiClient";
import { useQuery, type DefinedInitialDataOptions } from "@tanstack/react-query";
import type { AnyItem } from "@/types/items";
import type { GetResponse } from "@/types/response";
import type { AxiosError } from "axios";
import { ItemModelValues } from "@/lib/models";

export default function useGetItems(
  model: ItemModelValues,
  options: Omit<DefinedInitialDataOptions<AnyItem[], AxiosError>, "queryKey" | "queryFn"> = {
    initialData: [],
  }
) {
  return useQuery({
    ...options,
    queryKey: ["items", model],
    async queryFn() {
      const res = await apiClient.get<GetResponse<AnyItem[]>>(`${model}Items`);
      return res.data.data;
    },
    initialData: options.initialData,
  });
}
