import { ajaxWithLogin } from "@/utils/request";
import { CreateUserDto, UpdateUserDto, User } from "@/types/user";

interface UserListParams {
  page?: number;
  pageSize?: number;
}

interface UserListResponse {
  items: User[];
  total: number;
}

export const userService = {
  getUsers: async (params: UserListParams): Promise<UserListResponse> => {
    const { data } = await ajaxWithLogin.get<UserListResponse>("/users/page", {
      params,
    });
    return data;
  },

  createUser: async (createUserDto: CreateUserDto) => {
    const { data } = await ajaxWithLogin.post<User>("/users", createUserDto);
    return data;
  },

  updateUser: async (id: number, updateUserDto: UpdateUserDto) => {
    const { data } = await ajaxWithLogin.patch<User>(
      `/users/admin/${id}`,
      updateUserDto
    );
    return data;
  },

  deleteUser: async (id: number) => {
    await ajaxWithLogin.delete(`/users/${id}`);
  },

  changePassword: (data: { oldPwd: string; newPwd: string }) => {
    return ajaxWithLogin.post("/auth/modifyPwd", data);
  },
};
