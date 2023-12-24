import apiClient from "@/api/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type GetResponse } from "@/types/response";
import { type AxiosError } from "axios";
import { type Plan } from "@/types/plan";

export default function useAddPlan() {
  const queryClient = useQueryClient();

  return useMutation<
    Plan,
    AxiosError,
    {
      data: {
        plan_code: string;
        name: string;
        address: string;
      };
    }
  >({
    async mutationFn({ data }) {
      const res = await apiClient.post<GetResponse<Plan>>("plans", data);

      return res.data.data;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
  });
}
