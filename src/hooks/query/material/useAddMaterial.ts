import apiClient from "@/api/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type GetResponse } from "@/types/response";
import { type Material } from "@/types/material";
import { type AxiosError } from "axios";

export default function useAddMaterial() {
  const queryClient = useQueryClient();

  return useMutation<
    Material,
    AxiosError,
    {
      data: {
        item_code: string;
        name: string;
        quantity: number;
        model: "hardcases" | "helmets" | "generals" | "medicines" | "motors";
        attributes?:
          | {
              size_id?: number | null | undefined;
            }
          | null
          | undefined;
      };
    }
  >({
    async mutationFn({ data }) {
      const { item_code, name, model, quantity, attributes } = data;
      const payload = ["helmets", "hardcases"].includes(model)
        ? { item_code, name, quantity, size_id: attributes?.size_id }
        : { item_code, name, quantity };

      const res = await apiClient.post<GetResponse<Material>>(model, payload);

      return res.data.data;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
    },
  });
}
