import { z } from "zod";

export const materialSchema = z.object({
  id: z.number(),
  item_code: z.string(),
  name: z.string(),
  model: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type GeneralSchema = z.infer<typeof materialSchema>;

export const formSchema = z.object({
  item_code: z.string().min(3),
  name: z.string().min(3),
  quantity: z.number().positive(),
  model: z.union([
    z.literal("hardcases"),
    z.literal("helmets"),
    z.literal("generals"),
    z.literal("medicines"),
    z.literal("motors"),
  ]),
  attributes: z
    .object({
      size_id: z.number().nullish(),
    })
    .nullish(),
});
