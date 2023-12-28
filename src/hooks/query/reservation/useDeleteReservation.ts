import apiClient from "@/api/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type AxiosError } from "axios";
import type { BaseResponse } from "@/types/response";

export default function useDeleteReservation() {
  const queryClient = useQueryClient();

  return useMutation<
    BaseResponse,
    AxiosError,
    {
      id: number;
    }
  >({
    async mutationFn({ id }) {
      const res = await apiClient.delete<BaseResponse>(`reservations/${id}`);
      return res.data;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
  });
}
