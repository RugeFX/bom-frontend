export type Material = {
  id: number;
  item_code: string;
  name: string;
  quantity: number;
  size_id?: number;
  master_code: string;
  created_at: string;
  updated_at: string;
};

export type MaterialItem = {
  id: number;
  item_code: string;
  name: string;
  quantity: number;
  model: "hardcases" | "helmets" | "generals" | "medicines" | "motors";
  attributes: {
    size: {
      id: number;
      name: string;
      master_code: string;
      created_at: string;
      updated_at: string;
    } | null;
  };
  created_at: string;
  updated_at: string;
};
