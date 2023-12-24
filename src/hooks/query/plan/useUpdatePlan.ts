import apiClient from "@/api/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { GetResponse } from "@/types/response";
import type { AxiosError } from "axios";
import type { Plan } from "@/types/plan";

export default function useUpdatePlan() {
  const queryClient = useQueryClient();

  return useMutation<
    Plan,
    AxiosError,
    {
      id: number;
      data: {
        plan_code: string;
        name: string;
        address: string;
      };
    }
  >({
    async mutationFn({ id, data }) {
      const res = await apiClient.put<GetResponse<Plan>>(`plans/${id}`, data);

      return res.data.data;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
  });
}
