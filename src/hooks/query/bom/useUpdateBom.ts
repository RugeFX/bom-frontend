import apiClient from "@/api/apiClient";
import { BOM } from "@/types/bom";
import { GetResponse } from "@/types/response";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export default function useUpdateBom() {
  const queryClient = useQueryClient();

  return useMutation<
    BOM,
    AxiosError,
    {
      id: number;
      data: { bom_code: string; items: string[] };
    }
  >({
    async mutationFn({ id, data }) {
      const payload = {
        bom_code: data.bom_code,
        item: data.items.map((code) => ({ item_code: code })),
      };
      const res = await apiClient.put<GetResponse<BOM>>(`boms/${id}`, payload);

      return res.data.data;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["boms"] });
    },
  });
}
