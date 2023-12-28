import { logout } from "@/auth/authService";
import { useMutation } from "@tanstack/react-query";
import { useAuthActions } from "@/store";
import type { AxiosError } from "axios";
import type { BaseResponse } from "@/types/response";
import { useNavigate } from "react-router-dom";

export default function useLogout() {
  const navigate = useNavigate();
  const { clearUserInfo } = useAuthActions();

  return useMutation<BaseResponse, AxiosError<{ error: string } | { message: string }>>({
    mutationFn: logout,
    onSuccess() {
      clearUserInfo();
      navigate("/login");
    },
  });
}
