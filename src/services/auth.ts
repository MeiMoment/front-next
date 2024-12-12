import { ajaxWithLogin } from "@/utils/request";
import { LoginParams, LoginResponse, MenuItem } from "@/types/auth";

export const authService = {
  login: async (params: LoginParams): Promise<LoginResponse> => {
    const { data } = await ajaxWithLogin.post<LoginResponse>(
      "/auth/signin",
      params
    );
    return data;
  },

  checkLoginStatus: async () => {
    const { data } = await ajaxWithLogin.get<{
      userInfo: any;
      menus: MenuItem[];
      resources: any[];
    }>("/auth/getUserInfo");
    return data;
  },
};
