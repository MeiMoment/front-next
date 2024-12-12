"use client";

import { Button, Table } from "antd";
import { useToast } from "@/components/ui/use-toast";
import { channelService } from "@/services/channel";
import { Channel } from "@/types/channel";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { ChannelDialog } from "./channel-dialog";
import dayjs from "dayjs";
import { usePagination } from "ahooks";
import type { TablePaginationConfig } from "antd/es/table";

export default function ChannelsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<Channel | undefined>();
  const { toast } = useToast();

  const {
    data: channelList,
    loading,
    pagination,
    refresh,
    run,
  } = usePagination(
    async ({ current, pageSize }) => {
      try {
        const { items, total } = await channelService.getList({
          page: current,
          pageSize,
        });
        return {
          list: items,
          total,
        };
      } catch (error) {
        toast({
          title: "获取渠道列表失败",
          variant: "destructive",
        });
        return {
          list: [],
          total: 0,
        };
      }
    },
    {
      defaultPageSize: 10,
      defaultCurrent: 1,
    }
  );
  const handleTableChange = (newPagination: TablePaginationConfig) => {
    run({
      current: newPagination.current ?? 1,
      pageSize: newPagination.pageSize ?? 10,
    });
  };

  const handleDelete = async (id: number) => {
    try {
      await channelService.deleteChannel(id);
      toast({ title: "删除成功" });
      refresh();
    } catch (error) {
      toast({
        title: "删除失败",
        variant: "destructive",
      });
    }
  };

  const columns = [
    { title: "名称", dataIndex: "name", key: "name" },
    { title: "代码", dataIndex: "code", key: "code" },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => dayjs(date).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "操作",
      key: "actions",
      render: (_: any, record: Channel) => (
        <div className="flex gap-2">
          <Button
            type="primary"
            onClick={() => {
              setSelectedChannel(record);
              setIsDialogOpen(true);
            }}
          >
            编辑
          </Button>
          <Button danger onClick={() => handleDelete(record.id)}>
            删除
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">渠道管理</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setSelectedChannel(undefined);
            setIsDialogOpen(true);
          }}
        >
          新增渠道
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={channelList?.list}
        rowKey="id"
        pagination={{
          ...pagination,
          total: channelList?.total,
        }}
        onChange={handleTableChange}
        loading={loading}
      />

      <ChannelDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        channel={selectedChannel}
        onSuccess={() => {
          setIsDialogOpen(false);
          refresh();
        }}
      />
    </div>
  );
}
