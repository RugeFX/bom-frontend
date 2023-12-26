import apiClient from "@/api/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { GetResponse } from "@/types/response";
import type { AxiosError } from "axios";
import type { AnyItem } from "@/types/items";
import type { ItemModelValues } from "@/lib/models";

export default function useUpdateItem() {
  const queryClient = useQueryClient();

  return useMutation<
    AnyItem,
    AxiosError,
    {
      code: string;
      model: ItemModelValues;
      data: Omit<AnyItem, "id" | "created_at" | "updated_at">;
    }
  >({
    async mutationFn({ code, model, data }) {
      const res = await apiClient.put<GetResponse<AnyItem>>(`${model}Items/${code}`, data);

      return res.data.data;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}
