import apiClient from "@/api/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type GetResponse } from "@/types/response";
import { type AxiosError } from "axios";
import { type Size } from "@/types/size";

export default function useUpdateSize() {
  const queryClient = useQueryClient();

  return useMutation<
    Size,
    AxiosError,
    {
      id: number;
      data: {
        master_code: string;
        name: string;
      };
    }
  >({
    async mutationFn({ id, data }) {
      const res = await apiClient.put<GetResponse<Size>>(`sizes/${id}`, data);

      return res.data.data;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["sizes"] });
    },
  });
}
