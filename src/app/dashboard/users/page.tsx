"use client";

import { useState } from "react";
import { Button, Table } from "antd";
import { useToast } from "@/components/ui/use-toast";
import { userService } from "@/services/user";
import { User } from "@/types/user";
import { PlusOutlined } from "@ant-design/icons";
import { UserDialog } from "./user-dialog";
import { usePagination } from "ahooks";
import type { TablePaginationConfig } from "antd/es/table";

export default function UsersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const { toast } = useToast();

  const {
    data: userList,
    loading,
    pagination,
    refresh,
    run,
  } = usePagination(
    async ({ current, pageSize }) => {
      try {
        const { items, total } = await userService.getUsers({
          page: current,
          pageSize,
        });
        console.log("🚀 ~ data, total:", items, total);
        return {
          list: items,
          total,
        };
      } catch (error) {
        toast({
          title: "获取用户列表失败",
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
      await userService.deleteUser(id);
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
    { title: "用户名", dataIndex: "username", key: "username" },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status: number) => (status === 1 ? "启用" : "禁用"),
    },
    {
      title: "操作",
      key: "actions",
      render: (_: any, record: User) => (
        <div className="flex gap-2">
          <Button
            type="primary"
            onClick={() => {
              setSelectedUser(record);
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
        <h1 className="text-2xl font-bold">用户管理</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setSelectedUser(undefined);
            setIsDialogOpen(true);
          }}
        >
          新增用户
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={userList?.list}
        rowKey="id"
        pagination={{
          ...pagination,
          total: userList?.total,
        }}
        onChange={handleTableChange}
        loading={loading}
      />

      <UserDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        user={selectedUser}
        onSuccess={() => {
          setIsDialogOpen(false);
          refresh();
        }}
      />
    </div>
  );
}
