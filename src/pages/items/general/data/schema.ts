import { z } from "zod";
import { statuses } from "./data";

export const itemSchema = z.object({
  code: z.string(),
  bom_code: z.string(),
  plan_code: z.string(),
  name: z.string(),
  status: z.enum(statuses),
  information: z.string().nullish().or(z.literal("")),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Schema = z.infer<typeof itemSchema>;

export const formSchema = z.object({
  code: z.string().min(1),
  bom_code: z.string().min(1, { message: "Please choose a valid BOM Code." }),
  plan_code: z.string().min(1, { message: "Please choose a valid Plan Code." }),
  name: z.string().min(1),
  status: z.enum(statuses),
  information: z.string().min(3),
});
