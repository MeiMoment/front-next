export interface Channel {
  id: number;
  name: string;
  code: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateChannelDto {
  name: string;
  code: string;
}

export interface UpdateChannelDto {
  name?: string;
  code?: string;
} 