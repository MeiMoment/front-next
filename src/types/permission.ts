export enum Action {
  Manage = "manage",
  Create = "create",
  Read = "read",
  Update = "update",
  Delete = "delete",
}

export interface Resource {
  id: string;
  name: string;
  identifier: string;
  actions: Action[];
}

export type Permission = `${string}:${Action}`;

export interface Role {
  id: string;
  name: string;
  code: string;
  description: string;
  permissions: Permission[];
  menuKeys: string[];
}
