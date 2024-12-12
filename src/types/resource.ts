export enum ResourceAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  MANAGE = 'manage',
  IMPORT = 'import',
  EXPORT = 'export'
}

export interface Resource {
  id: number;
  name: string;
  code: string;
  description?: string;
  actions: ResourceAction[];
}

export interface CreateResourceDto {
  name: string;
  code: string;
  description?: string;
  actions?: ResourceAction[];
}

export interface UpdateResourceDto {
  name?: string;
  description?: string;
  actions?: ResourceAction[];
} 