import { useQuery, type UndefinedInitialDataOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { Reservation } from "@/types/reservation";
import type { GetResponse } from "@/types/response";
import apiClient from "@/api/apiClient";

type DetailsResponse = GetResponse<Reservation>;

export default function useGetReservationDetails(
  id: number | null,
  options: Partial<UndefinedInitialDataOptions<DetailsResponse, AxiosError>> = {}
) {
  return useQuery<DetailsResponse, AxiosError>({
    queryKey: ["reservations", "details", id],
    async queryFn() {
      const relations = [
        "helmetItems",
        "fakItems",
        "motorItems",
        "hardcaseItems",
        "return",
        "pickup",
        "motoritems.general",
      ];
      const res = await apiClient.get<DetailsResponse>(`reservations/${id}`, {
        params: {
          relations: relations.join(","),
        },
      });
      return res.data;
    },
    ...options,
  });
}
