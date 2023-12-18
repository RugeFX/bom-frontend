import apiClient from "@/api/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type AxiosError } from "axios";
import type { BaseResponse } from "@/types/response";

export default function useDeleteMaster() {
  const queryClient = useQueryClient();

  return useMutation<
    BaseResponse,
    AxiosError,
    {
      id: string;
    }
  >({
    mutationKey: ["masters"],
    async mutationFn({ id }) {
      const res = await apiClient.delete<BaseResponse>(`masters/${id}`);
      return res.data;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["masters"] });
    },
  });
}
