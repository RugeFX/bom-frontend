import apiClient from "@/api/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type AxiosError } from "axios";
import type { BaseResponse } from "@/types/response";

export default function useDeleteBom() {
  const queryClient = useQueryClient();

  return useMutation<
    BaseResponse,
    AxiosError,
    {
      id: string;
    }
  >({
    async mutationFn({ id }) {
      const res = await apiClient.delete<BaseResponse>(`boms/${id}`);
      return res.data;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["boms"] });
    },
  });
}
