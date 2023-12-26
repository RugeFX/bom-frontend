import { General } from "./general";
import { Hardcase } from "./hardcase";
import { Helmet } from "./helmet";
import { Medicine } from "./medicine";
import { Motor } from "./motor";

export type MaterialBOM = {
  item_code: string;
  created_at: string;
  updated_at: string;
  pivot: {
    bom_id: number;
    item_code: string;
  };
  general?: General | null;
  medicine?: Medicine | null;
  hardcase?: Hardcase | null;
  helmet?: Helmet | null;
  motor?: Motor | null;
}[];

export type BOM = {
  id: number;
  bom_code: string;
  created_at: string;
  updated_at: string;
  material: MaterialBOM;
};
