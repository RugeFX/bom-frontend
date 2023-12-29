import { z } from "zod";
import { statuses } from "./data";

export const reservationSchema = z.object({
  id: z.number(),
  reservation_code: z.string(),
  pickupPlan_code: z.string(),
  returnPlan_code: z.string().nullish().or(z.literal("")),
  helmet_items: z.array(
    z.object({
      code: z.string(),
      status: z.enum(["Lost", "Scrab", "Ready For Rent", "In Rental"]).nullish(),
    })
  ),
  fak_items: z.array(
    z.object({
      code: z.string(),
      status: z.enum(["Complete", "Incomplete", "Lost", "In Rental"]).nullish(),
    })
  ),
  motor_items: z.array(
    z.object({
      code: z.string(),
      status: z.enum(["Ready For Rent", "Out Of Service", "In Rental"]).nullish(),
    })
  ),
  hardcase_items: z
    .array(
      z.object({
        code: z.string(),
        status: z.enum(["Lost", "Scrab", "Ready For Rent", "In Rental"]).nullish(),
      })
    )
    .optional(),
  status: z.enum(statuses),
  information: z.string().nullish().or(z.literal("")),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Schema = z.infer<typeof reservationSchema>;

export const pickupSchema = z.object({
  reservation_code: z.string(),
  pickupPlan_code: z
    .string()
    .refine((arg) => arg !== "", { message: "Pickup Plan field must not be empty!" }),
  helmet: z.array(z.object({ helmet_code: z.string() })),
  fak: z.array(z.object({ fak_code: z.string() })),
  motor: z.array(z.object({ motor_code: z.string() })),
  hardcase: z.array(z.object({ hardcase_code: z.string() })).optional(),
  status: z.enum(statuses),
  information: z.string().optional().or(z.literal("")),
});

export const returnSchema = z.object({
  reservation_code: z.string(),
  pickupPlan_code: z.string().min(1),
  returnPlan_code: z
    .string()
    .refine((arg) => arg !== "", { message: "Return Plan field must not be empty!" }),
  helmet: z.array(
    z.object({
      helmet_code: z.string(),
      status: z.enum(["Lost", "Scrab", "Ready For Rent"]),
    })
  ),
  fak: z.array(
    z.object({
      fak_code: z.string(),
      status: z.enum(["Complete", "Incomplete", "Lost"]),
    })
  ),
  motor: z.array(
    z.object({
      motor_code: z.string(),
      status: z.enum(["Ready For Rent", "Out Of Service"]),
    })
  ),
  hardcase: z
    .array(
      z.object({
        hardcase_code: z.string(),
        status: z.enum(["Lost", "Scrab", "Ready For Rent"]),
      })
    )
    .optional(),
  status: z.enum(statuses),
  information: z.string().optional().or(z.literal("")),
});
