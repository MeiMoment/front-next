export interface Menu {
  id: number;
  name: string;
  path?: string;
  parentId?: number;
  order?: number;
  type: 'menu' | 'path';
  icon?: string;
  children?: Menu[];
  roles?: any[];
}

export interface CreateMenuDto {
  name: string;
  path?: string;
  parentId?: number;
  order?: number;
  type?: 'menu' | 'path';
  icon?: string;
}

export interface UpdateMenuDto extends Partial<CreateMenuDto> {} 