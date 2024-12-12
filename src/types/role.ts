import { Menu } from "./menu";
import { Resource } from "./resource";
import { User } from "./user";

export interface Role {
  id: number;
  name: string;
  description?: string;
  menus: Menu[];
  resources: Resource[];
  users: User[];
}

export interface CreateRoleDto {
  name: string;
  description?: string;
  menuIds?: number[];
  resourceIds?: number[];
}

export interface UpdateRoleDto extends Partial<CreateRoleDto> {}

export interface RoleListResponse {
  items: Role[];
  total: number;
  page: number;
  pageSize: number;
}
