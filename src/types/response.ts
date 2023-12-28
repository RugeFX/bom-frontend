import type { MenuGroup, User } from "./user";

export type BaseResponse = {
  message: string;
};

export type GetResponse<T> = BaseResponse & {
  data: T;
};

export type LoginResponse = GetResponse<{
  user: User;
  privilege: MenuGroup[];
  token: string;
}>;

export type MyProfileResponse = GetResponse<{
  user: User;
  privilege: MenuGroup[];
}>;
