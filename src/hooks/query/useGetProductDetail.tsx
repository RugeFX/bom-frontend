import apiClient from "@/api/apiClient";
import { useQuery, type UndefinedInitialDataOptions } from "@tanstack/react-query";
import { type AxiosError } from "axios";
import type { ProductDetailResponse } from "@/types/response";

export default function useGetProductDetail(
  id: string,
  options?: Partial<UndefinedInitialDataOptions<ProductDetailResponse, AxiosError>>
) {
  return useQuery<ProductDetailResponse, AxiosError>({
    queryKey: ["products", "details", id],
    async queryFn() {
      const res = await apiClient.get<ProductDetailResponse>(`product/${id}`);
      return res.data;
    },
    ...options,
  });
}
