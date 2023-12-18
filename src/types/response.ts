export type BaseResponse = {
  message: string;
};

export type GetResponse<T> = BaseResponse & {
  data: T;
};
