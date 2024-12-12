"use client";

import { useState, useEffect } from "react";
import { Table, Button, message, Popconfirm, Tag, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Resource, ResourceAction } from "@/types/resource";
import { resourceService } from "@/services/resource";
import { ResourceDialog } from "./resource-dialog";

const ResourcePage = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);

  const handleFetchResources = async () => {
    try {
      setLoading(true);
      const data = await resourceService.getList();
      setResources(data);
    } catch (error) {
      message.error("获取资源列表失败");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await resourceService.delete(id);
      message.success("删除成功");
      handleFetchResources();
    } catch (error) {
      message.error("删除失败");
    }
  };

  const handleSave = async (values: any, id?: number) => {
    try {
      if (id) {
        await resourceService.update(id, values);
        message.success("更新成功");
      } else {
        await resourceService.create(values);
        message.success("创建成功");
      }
      setDialogVisible(false);
      setEditingResource(null);
      handleFetchResources();
    } catch (error) {
      message.error(id ? "更新失败" : "创建失败");
    }
  };

  const columns: ColumnsType<Resource> = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "编码",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "操作权限",
      dataIndex: "actions",
      key: "actions",
      render: (actions: ResourceAction[]) => (
        <Space size={[0, 4]} wrap>
          {actions?.map((action) => (
            <Tag key={action} color="blue">
              {action}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "操作",
      key: "operation",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingResource(record);
              setDialogVisible(true);
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除该资源吗？"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    handleFetchResources();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-lg font-medium">资源管理</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingResource(null);
            setDialogVisible(true);
          }}
        >
          新建资源
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={resources}
        loading={loading}
        rowKey="id"
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
      />

      <ResourceDialog
        open={dialogVisible}
        resource={editingResource}
        onCancel={() => {
          setDialogVisible(false);
          setEditingResource(null);
        }}
        onOk={handleSave}
      />
    </div>
  );
};

export default ResourcePage;
