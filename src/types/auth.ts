export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

export interface MenuItem {
  id: number;
  name: string;
  path: string | null;
  parentId: number | null;
  order: number | null;
  type: string;
  icon: string;
  children?: MenuItem[];
}

export interface AuthContextType {
  menuInfo: MenuItem[];
}
