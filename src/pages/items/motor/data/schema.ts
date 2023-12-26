import { z } from "zod";
import { statuses } from "./data";

export const itemSchema = z.object({
  code: z.string(),
  bom_code: z.string(),
  plan_code: z.string(),
  name: z.string(),
  status: z.enum(statuses),
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
  status: z.enum(statuses),
  information: z.string().min(3).optional().or(z.literal("")),
  hardcase_code: z.string().optional().or(z.literal("")),
  general: z
    .array(
      z.object({
        general_code: z.string(),
      })
    )
    .min(1),
});