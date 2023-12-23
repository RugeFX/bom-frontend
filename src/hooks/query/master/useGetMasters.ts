import apiClient from "@/api/apiClient";
import { Master } from "@/types/master";
import { GetResponse } from "@/types/response";
import { type DefinedInitialDataOptions, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

type DetailsResponse = GetResponse<Master[]>;

export default function useGetMasters(
  options: Partial<DefinedInitialDataOptions<Master[], AxiosError>> = {}
) {
  return useQuery<Master[], AxiosError>({
    queryKey: ["masters"],
    async queryFn() {
      const res = await apiClient.get<DetailsResponse>(`masters`);
      return res.data.data;
    },
    ...options,
  });
}
