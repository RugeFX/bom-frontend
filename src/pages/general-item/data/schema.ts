import { z } from "zod";

export const itemSchema = z.object({
  code: z.string(),
  bom_code: z.string(),
  plan_code: z.string(),
  name: z.string(),
  status: z.enum(["Good Condition", "Scrab", "In Rental"]),
  information: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Schema = z.infer<typeof itemSchema>;

export const formSchema = z.object({
  code: z.string().min(1),
  bom_code: z.string().min(1),
  plan_code: z.string().min(1),
  name: z.string().min(1),
  status: z.enum(["Good Condition", "Scrab", "In Rental"]),
  information: z.string().min(3),
});
