import { Material } from "./material";

export type Motor = {
  id: number;
  item_code: string;
  name: string;
  quantity: number;
  master_code: string;
  created_at: string;
  updated_at: string;
  material?: Material;
};
