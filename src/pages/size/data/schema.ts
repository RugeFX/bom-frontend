import { z } from "zod";

export const sizeSchema = z.object({
  id: z.number(),
  name: z.string(),
  master_code: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Schema = z.infer<typeof sizeSchema>;

export const formSchema = z.object({
  name: z.string().min(3),
  master_code: z.string().min(1),
});
