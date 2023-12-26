import apiClient from "@/api/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { BaseResponse } from "@/types/response";
import type { ItemModelValues } from "@/lib/models";

export default function useDeleteItem() {
  const queryClient = useQueryClient();

  return useMutation<
    BaseResponse,
    AxiosError,
    {
      code: string;
      model: ItemModelValues;
    }
  >({
    async mutationFn({ code, model }) {
      const res = await apiClient.delete<BaseResponse>(`${model}Items/${code}`);
      return res.data;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}
