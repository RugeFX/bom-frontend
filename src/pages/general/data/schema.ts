import { z } from "zod";

export const generalSchema = z.object({
  id: z.number(),
  item_code: z.string(),
  name: z.string(),
  quantity: z.number(),
  master_code: z.string(),
  color_id: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  material: z
    .object({
      id: z.number(),
      item_code: z.string(),
      created_at: z.string(),
      updated_at: z.string(),
    })
    .optional(),
  color: z
    .object({
      id: z.number(),
      name: z.string(),
      created_at: z.string(),
      updated_at: z.string(),
    })
    .optional(),
});

export type GeneralSchema = z.infer<typeof generalSchema>;

export const formSchema = z.object({
  item_code: z.string().min(3),
  name: z.string().min(3),
  quantity: z.number().positive(),
  color_id: z.number().positive(),
});
