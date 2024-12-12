import { ajaxWithLogin } from "@/utils/request";
import {
  Role,
  CreateRoleDto,
  UpdateRoleDto,
  RoleListResponse,
} from "@/types/role";
import { AxiosResponse } from "axios";

const BASE_URL = "/roles";

export const roleApi = {
  create: (data: CreateRoleDto) => {
    return ajaxWithLogin.post<any, AxiosResponse<Role>>(BASE_URL, data);
  },

  getList: (params?: { page?: number; pageSize?: number }) => {
    return ajaxWithLogin.get<any, AxiosResponse<RoleListResponse>>(
      `${BASE_URL}/page`,
      {
        params,
      }
    );
  },

  getAll: () => {
    return ajaxWithLogin.get<any, AxiosResponse<Role[]>>(`${BASE_URL}`);
  },

  getById: (id: number) => {
    return ajaxWithLogin.get<any, AxiosResponse<Role>>(`${BASE_URL}/${id}`);
  },

  update: (id: number, data: UpdateRoleDto) => {
    return ajaxWithLogin.patch<any, AxiosResponse<Role>>(
      `${BASE_URL}/${id}`,
      data
    );
  },

  delete: (id: number) => {
    return ajaxWithLogin.delete<void>(`${BASE_URL}/${id}`);
  },
};

export const roleService = {
  create: async (data: CreateRoleDto): Promise<Role> => {
    const response = await roleApi.create(data);
    return response.data;
  },

  getList: async (params?: {
    page?: number;
    pageSize?: number;
  }): Promise<RoleListResponse> => {
    const response = await roleApi.getList(params);
    return response.data;
  },

  getAll: async (): Promise<Role[]> => {
    const response = await roleApi.getAll();
    return response.data;
  },

  getRoles: async (): Promise<Role[]> => {
    const response = await roleApi.getAll();
    return response.data;
  },

  getById: async (id: number): Promise<Role> => {
    const response = await roleApi.getById(id);
    return response.data;
  },

  update: async (id: number, data: UpdateRoleDto): Promise<Role> => {
    const response = await roleApi.update(id, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await roleApi.delete(id);
  },
};
