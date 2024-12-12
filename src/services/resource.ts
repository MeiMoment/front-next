import { ajaxWithLogin } from "@/utils/request";
import {
  Resource,
  CreateResourceDto,
  UpdateResourceDto,
} from "@/types/resource";
import { AxiosResponse } from "axios";

const BASE_URL = "/resources";

// 定义API响应类型
type ResourceListResponse = AxiosResponse<Resource[]>;
type ResourceResponse = AxiosResponse<Resource>;

// 资源相关的API请求
export const resourceApi = {
  /**
   * 创建资源
   * @param data 创建资源的数据
   */
  create: (data: CreateResourceDto) => {
    return ajaxWithLogin.post<any, ResourceResponse>(BASE_URL, data);
  },

  /**
   * 获取资源列表
   */
  getList: () => {
    return ajaxWithLogin.get<any, ResourceListResponse>(BASE_URL);
  },

  /**
   * 根据ID获取资源详情
   * @param id 资源ID
   */
  getById: (id: number) => {
    return ajaxWithLogin.get<any, ResourceResponse>(`${BASE_URL}/${id}`);
  },

  /**
   * 更新资源信息
   * @param id 资源ID
   * @param data 更新的数据
   */
  update: (id: number, data: UpdateResourceDto) => {
    return ajaxWithLogin.patch<any, ResourceResponse>(
      `${BASE_URL}/${id}`,
      data
    );
  },

  /**
   * 删除资源
   * @param id 资源ID
   */
  delete: (id: number) => {
    return ajaxWithLogin.delete<void>(`${BASE_URL}/${id}`);
  },
};

// 封装业务逻辑处理层
export const resourceService = {
  /**
   * 创建资源
   */
  create: async (data: CreateResourceDto): Promise<Resource> => {
    const response = await resourceApi.create(data);
    return response.data;
  },

  /**
   * 获取资源列表
   */
  getList: async (): Promise<Resource[]> => {
    const response = await resourceApi.getList();
    return response.data;
  },

  /**
   * 获取资源详情
   */
  getById: async (id: number): Promise<Resource> => {
    const response = await resourceApi.getById(id);
    return response.data;
  },

  /**
   * 更新资源
   */
  update: async (id: number, data: UpdateResourceDto): Promise<Resource> => {
    const response = await resourceApi.update(id, data);
    return response.data;
  },

  /**
   * 删除资源
   */
  delete: async (id: number): Promise<void> => {
    await resourceApi.delete(id);
  },
};
