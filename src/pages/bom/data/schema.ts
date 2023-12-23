import { z } from "zod";

export const bomSchema = z.object({
  id: z.number(),
  bom_code: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type BOMSchema = z.infer<typeof bomSchema>;

export const formSchema = z.object({
  bom_code: z.string().min(3),
  items: z.array(z.string()).min(1),
});
