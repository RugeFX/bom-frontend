import apiClient from "@/api/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type GetResponse } from "@/types/response";
import { type AxiosError } from "axios";
import { type Size } from "@/types/size";

export default function useAddSize() {
  const queryClient = useQueryClient();

  return useMutation<
    Size,
    AxiosError,
    {
      data: {
        master_code: string;
        name: string;
      };
    }
  >({
    async mutationFn({ data }) {
      const res = await apiClient.post<GetResponse<Size>>("sizes", data);

      return res.data.data;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["sizes"] });
    },
  });
}
