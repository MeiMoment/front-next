import { ajaxWithLogin } from "@/utils/request";
import { Menu, CreateMenuDto, UpdateMenuDto } from "@/types/menu";
import { AxiosResponse } from "axios";

const BASE_URL = "/menus";

type MenuListResponse = AxiosResponse<Menu[]>;
type MenuResponse = AxiosResponse<Menu>;
type MenuTreeResponse = AxiosResponse<Menu[]>;

export const menuApi = {
  create: (data: CreateMenuDto) => {
    return ajaxWithLogin.post<any, MenuResponse>(BASE_URL, data);
  },

  getList: () => {
    return ajaxWithLogin.get<any, MenuListResponse>(BASE_URL);
  },

  getTree: () => {
    return ajaxWithLogin.get<any, MenuTreeResponse>(`${BASE_URL}/tree`);
  },

  getById: (id: number) => {
    return ajaxWithLogin.get<any, MenuResponse>(`${BASE_URL}/${id}`);
  },

  update: (id: number, data: UpdateMenuDto) => {
    return ajaxWithLogin.patch<any, MenuResponse>(`${BASE_URL}/${id}`, data);
  },

  delete: (id: number) => {
    return ajaxWithLogin.delete(`${BASE_URL}/${id}`);
  },
};

export const menuService = {
  create: async (data: CreateMenuDto): Promise<Menu> => {
    const response = await menuApi.create(data);
    return response.data;
  },

  getList: async (): Promise<Menu[]> => {
    const response = await menuApi.getList();
    return response.data;
  },

  getTree: async (): Promise<Menu[]> => {
    const response = await menuApi.getTree();
    return response.data;
  },

  getById: async (id: number): Promise<Menu> => {
    const response = await menuApi.getById(id);
    return response.data;
  },

  update: async (id: number, data: UpdateMenuDto): Promise<Menu> => {
    const response = await menuApi.update(id, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await menuApi.delete(id);
  },
}; 