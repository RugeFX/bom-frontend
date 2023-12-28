import { z } from "zod";
import { statuses } from "./data";

export const reservationSchema = z.object({
  id: z.number(),
  plan_code: z.string(),
  name: z.string(),
  address: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Schema = z.infer<typeof reservationSchema>;

export const formSchema = z.object({
  reservation_code: z.string(),
  pickupPlan_code: z.string(),
  returnPlan_code: z.string().optional().or(z.literal("")),
  helmet: z.array(
    z.object({
      helmet_code: z.string(),
      status: z.enum(["Lost", "Scrab", "Ready For Rent"]).optional(),
    })
  ),
  fak: z.array(
    z.object({
      fak_code: z.string(),
      status: z.enum(["Complete", "Incomplete", "Lost"]).optional(),
    })
  ),
  motor: z.array(
    z.object({
      motor_code: z.string(),
      status: z.enum(["Ready For Rent", "Out Of Service"]).optional(),
    })
  ),
  hardcase: z
    .array(
      z.object({
        hardcase_code: z.string(),
        status: z.enum(["Lost", "Scrab", "Ready For Rent"]).optional(),
      })
    )
    .optional(),
  status: z.enum(statuses),
  information: z.string().optional().or(z.literal("")),
});
