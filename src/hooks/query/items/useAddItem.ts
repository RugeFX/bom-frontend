import apiClient from "@/api/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { GetResponse } from "@/types/response";
import type { AxiosError } from "axios";
import type { AnyItem } from "@/types/items";
import type { ItemModelValues } from "@/lib/models";

export default function useAddItem() {
  const queryClient = useQueryClient();

  return useMutation<
    AnyItem,
    AxiosError,
    {
      model: ItemModelValues;
      data: {
        code: string;
        bom_code: string;
        plan_code: string;
        name: string;
        status: string;
        information?: string;
        monorack_code?: string;
        hardcase_code?: string;
        general?: {
          general_code: string;
        }[];
      };
    }
  >({
    async mutationFn({ model, data }) {
      const res = await apiClient.post<GetResponse<AnyItem>>(`${model}Items`, data);

      return res.data.data;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}
