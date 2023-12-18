import { z } from "zod";

export const masterSchema = z.object({
  id: z.number(),
  category_id: z.number(),
  master_code: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Product = z.infer<typeof masterSchema>;
