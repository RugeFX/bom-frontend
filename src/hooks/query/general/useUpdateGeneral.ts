import apiClient from "@/api/apiClient";
import { General } from "@/types/general";
import { GetResponse } from "@/types/response";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export default function useUpdateGeneral() {
  const queryClient = useQueryClient();

  return useMutation<
    General,
    AxiosError,
    {
      id: number;
      data: Partial<General>;
    }
  >({
    async mutationFn({ id, data }) {
      const res = await apiClient.put<GetResponse<General>>(`generals/${id}`, data);

      return res.data.data;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["generals"] });
    },
  });
}
