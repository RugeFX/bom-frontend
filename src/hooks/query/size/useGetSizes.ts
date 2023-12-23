import apiClient from "@/api/apiClient";
import { type UndefinedInitialDataOptions, useQuery } from "@tanstack/react-query";
import type { GetResponse } from "@/types/response";
import type { Size } from "@/types/size";
import type { AxiosError } from "axios";

type DetailsResponse = GetResponse<Size[]>;

export default function useGetSizes(
  options: Partial<UndefinedInitialDataOptions<Size[], AxiosError>> = {}
) {
  return useQuery<Size[], AxiosError>({
    queryKey: ["sizes"],
    async queryFn() {
      const res = await apiClient.get<DetailsResponse>(`sizes`);
      return res.data.data;
    },
    ...options,
  });
}
