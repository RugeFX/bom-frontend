import { BaseItem, HardcaseItem, MotorItem } from "./items";

export type Reservation = {
  id: number;
  reservation_code: string;
  pickupPlan_code: string;
  returnPlan_code?: string | null;
  information?: string | null;
  status: "Finished Rental" | "In Rental";
  updated_at: string;
  created_at: string;
  helmet_items: BaseItem[];
  fak_items: BaseItem[];
  motor_items: MotorItem[];
  hardcase_items: HardcaseItem[];
};
