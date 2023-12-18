import apiClient from "@/api/apiClient";
import { General } from "@/types/general";
import { GetResponse } from "@/types/response";
import { UndefinedInitialDataOptions, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

type DetailsResponse = GetResponse<General>;

export default function useGetGeneralDetails(
  id: number,
  options: Partial<UndefinedInitialDataOptions<DetailsResponse, AxiosError>> = {}
) {
  return useQuery<DetailsResponse, AxiosError>({
    queryKey: ["generals", "details", id],
    async queryFn() {
      const res = await apiClient.get<DetailsResponse>(`generals/${id}`, {
        params: { relations: "material,color" },
      });
      return res.data;
    },
    ...options,
  });
}
