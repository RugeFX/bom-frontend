export type User = {
  id: number;
  username: string;
  staff_code: string;
  created_at: string;
  updated_at: string;
  staff?: Staff;
};

export type LocalUserInfo = {
  accessToken: string;
  refreshToken: string;
};

export type PersistedInfo = {
  state?: LocalUserInfo;
  version: number;
};

export type Role = {
  id: number;
  code: string;
  name: string;
  created_at: string;
  updated_at: string;
  staff?: Staff[];
  privilege?: Privilege[];
};

export type MenuGroup = {
  id: number;
  code: string;
  name: string;
  created_at: string;
  updated_at: string;
  menuitem?: MenuItem[];
};

export type MenuItem = {
  id: number;
  code: string;
  name: string;
  url: string;
  created_at: string;
  updated_at: string;
  privilege?: Privilege[];
  menugroup?: MenuGroup;
};

export type Privilege = {
  id: number;
  role_code: string;
  menuitem_code: string;
  view: number;
  add: number;
  edit: number;
  delete: number;
  import: number;
  export: number;
  created_at: string;
  updated_at: string;
  menuitem?: MenuItem;
};

export type Staff = {
  id: number;
  code: string;
  name: string;
  urlImage: string | null;
  role_code: string;
  information: string | null;
  created_at: string;
  updated_at: string;
  role?: Role;
  user?: User;
};
