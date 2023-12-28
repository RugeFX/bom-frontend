import { Plan } from "./plan";
import { Reservation } from "./reservation";

export type BaseItem = {
  code: string;
  bom_code: string;
  plan_code: string;
  name: string;
  status: string;
  information?: string;
  created_at: string;
  updated_at: string;
  plan?: Plan;
  reservation?: Reservation[];
};

export interface HardcaseItem extends BaseItem {
  monorack_code?: string | null;
}

export interface MotorItem extends BaseItem {
  hardcase_code?: string | null;
  general?: {
    code: string;
    name: string;
    bom_code: string;
    plan_code: string;
    status: string;
    information: string;
    created_at: string;
    updated_at: string;
  }[];
}

export interface AnyItem extends BaseItem {
  monorack_code?: string | null;
  hardcase_code?: string | null;
  general?: {
    code: string;
    name: string;
    bom_code: string;
    plan_code: string;
    status: string;
    information: string;
    created_at: string;
    updated_at: string;
  }[];
}
