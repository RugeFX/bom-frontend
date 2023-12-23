import apiClient from "@/api/apiClient";
import { BOM } from "@/types/bom";
import { GetResponse } from "@/types/response";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export default function useAddBom() {
  const queryClient = useQueryClient();

  return useMutation<
    BOM,
    AxiosError,
    {
      data: { bom_code: string; items: string[] };
    }
  >({
    async mutationFn({ data }) {
      const payload = {
        bom_code: data.bom_code,
        item: data.items.map((code) => ({ item_code: code })),
      };
      const res = await apiClient.post<GetResponse<BOM>>("boms", payload);

      return res.data.data;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["boms"] });
    },
  });
}
