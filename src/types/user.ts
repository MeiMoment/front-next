import { Role } from "./role";

export interface User {
  id: number;
  username: string;
  password?: string;
  roles: number[] | Role[];
  status: number;
  channel: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  username: string;
  password: string;
  roles: number[] | Role[];
  channel: number;
  status: number;
}

export interface UpdateUserDto extends CreateUserDto {
  id: number;
}
