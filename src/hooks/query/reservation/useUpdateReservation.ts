import apiClient from "@/api/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { GetResponse } from "@/types/response";
import type { AxiosError } from "axios";
import type { Reservation } from "@/types/reservation";

export default function useUpdateReservation() {
  const queryClient = useQueryClient();

  return useMutation<
    Reservation,
    AxiosError,
    {
      id: number;
      data: {
        reservation_code: string;
        pickupPlan_code: string;
        returnPlan_code: string;
        information?: string;
        status: string;
        motor: { motor_code: string; status: string }[];
        fak: { fak_code: string; status: string }[];
        helmet: { helmet_code: string; status: string }[];
        hardcase?: { hardcase_code: string; status: string }[];
      };
    }
  >({
    async mutationFn({ id, data }) {
      const res = await apiClient.put<GetResponse<Reservation>>(`reservations/${id}`, data);

      return res.data.data;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
  });
}
