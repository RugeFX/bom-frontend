import { z } from "zod";

export const productSchema = z.object({
  id: z.number(),
  kodeProduct: z.string(),
  name: z.string(),
  stock: z.number(),
  netPrice: z.number(),
  image: z.string(),
  information: z.string(),
  unitId: z.number(),
  categoryId: z.number(),
  supplierId: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Product = z.infer<typeof productSchema>;
