import apiClient from "@/api/apiClient";
import { General } from "@/types/general";
import { GetResponse } from "@/types/response";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export default function useAddGeneral() {
  const queryClient = useQueryClient();

  return useMutation<
    General,
    AxiosError,
    {
      data: Omit<
        General,
        "id" | "master_code" | "created_at" | "updated_at" | "material" | "color"
      >;
    }
  >({
    async mutationFn({ data }) {
      const res = await apiClient.post<GetResponse<General>>("generals", data);

      return res.data.data;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["generals"] });
    },
  });
}
