import { General } from "./general";
import { Hardcase } from "./hardcase";
import { Helmet } from "./helmet";
import { Material } from "./material";
import { Medicine } from "./medicine";

export type MaterialBOM = (Material & {
  general?: General | null;
  medicine?: Medicine | null;
  hardcase?: Hardcase | null;
  helmet?: Helmet | null;
})[];

export type BOM = {
  id: number;
  bom_code: string;
  created_at: string;
  updated_at: string;
  material: MaterialBOM;
};
