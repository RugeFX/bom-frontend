import { Color } from "./color";
import { Material } from "./material";

export type General = {
  id: number;
  item_code: string;
  name: string;
  quantity: number;
  master_code: string;
  // color_id: number;
  created_at: string;
  updated_at: string;
  material?: Material;
  color?: Color;
};
