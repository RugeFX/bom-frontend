import { login } from "@/auth/authService";
import { useMutation } from "@tanstack/react-query";
import { useAuthActions } from "@/store";
import type { LoginPayload } from "@/types/auth";
import type { LoginResponse } from "@/types/response";
import type { AxiosError } from "axios";

export default function useLogin() {
  const { setAccessToken, setUserData, setPrivileges } = useAuthActions();

  return useMutation<LoginResponse, AxiosError<{ error: string }>, LoginPayload>({
    mutationFn: login,
    async onSuccess({ data }) {
      const { user, token, privilege } = data;

      setAccessToken(token);
      setPrivileges(privilege);
      setUserData(user);
    },
  });
}
