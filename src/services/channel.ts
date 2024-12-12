import { ajaxWithLogin } from "@/utils/request";
import { Channel, CreateChannelDto, UpdateChannelDto } from "@/types/channel";

const BASE_URL = "/channels";

export const channelService = {
  getList: async (params?: { page?: number; pageSize?: number }) => {
    const { data } = await ajaxWithLogin.get<any, any>(`${BASE_URL}/page`, {
      params,
    });
    return data;
  },

  getChannels: async () => {
    const { data } = await ajaxWithLogin.get<Channel[]>(BASE_URL);
    return data;
  },

  createChannel: async (createChannelDto: CreateChannelDto) => {
    const { data } = await ajaxWithLogin.post<Channel>(
      BASE_URL,
      createChannelDto
    );
    return data;
  },

  updateChannel: async (id: number, updateChannelDto: UpdateChannelDto) => {
    const { data } = await ajaxWithLogin.patch<Channel>(
      `${BASE_URL}/${id}`,
      updateChannelDto
    );
    return data;
  },

  deleteChannel: async (id: number) => {
    await ajaxWithLogin.delete(`${BASE_URL}/${id}`);
  },
};
