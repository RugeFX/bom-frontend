import { z } from "zod";

export const sizeSchema = z.object({
  id: z.number(),
  plan_code: z.string(),
  name: z.string(),
  address: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Schema = z.infer<typeof sizeSchema>;

export const formSchema = z.object({
  plan_code: z.string().min(1),
  name: z.string().min(3),
  address: z.string().min(1),
});
