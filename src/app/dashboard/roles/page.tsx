"use client";

import { useState, useEffect } from "react";
import { Table, Button, message, Popconfirm, Space, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Role } from "@/types/role";
import { Menu } from "@/types/menu";
import { Resource } from "@/types/resource";
import { roleService } from "@/services/role";
import { menuService } from "@/services/menu";
import { resourceService } from "@/services/resource";
import RoleDialog from "./role-dialog";

const RolePage = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchRoles = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const data = await roleService.getList({ page, pageSize });
      setRoles(data.items);
      setPagination({
        current: data.page,
        pageSize: data.pageSize,
        total: data.total,
      });
    } catch (error) {
      message.error("获取角色列表失败");
    } finally {
      setLoading(false);
    }
  };

  const fetchMenusAndResources = async () => {
    try {
      const [menuData, resourceData] = await Promise.all([
        menuService.getList(),
        resourceService.getList(),
      ]);
      setMenus(menuData);
      setResources(resourceData);
    } catch (error) {
      message.error("获取菜单和资源列表失败");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await roleService.delete(id);
      message.success("删除成功");
      fetchRoles(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error("删除失败");
    }
  };

  const handleSave = async (values: any, id?: number) => {
    try {
      if (id) {
        await roleService.update(id, values);
        message.success("更新成功");
      } else {
        await roleService.create(values);
        message.success("创建成功");
      }
      setDialogVisible(false);
      setEditingRole(null);
      fetchRoles(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error(id ? "更新失败" : "创建失败");
    }
  };

  const columns: ColumnsType<Role> = [
    {
      title: "角色名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "菜单权限",
      dataIndex: "menus",
      key: "menus",
      render: (menus: Menu[]) => (
        <Space size={[0, 4]} wrap>
          {menus?.map((menu) => (
            <Tag key={menu.id} color="blue">
              {menu.name}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "资源权限",
      dataIndex: "resources",
      key: "resources",
      render: (resources: Resource[]) => (
        <Space size={[0, 4]} wrap>
          {resources?.map((resource) => (
            <Tag key={resource.id} color="green">
              {resource.name}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "操作",
      key: "operation",
      width: 180,
      fixed: "right",
      render: (_, record) => (
        <Space size={[4, 0]}>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingRole(record);
              setDialogVisible(true);
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除该角色吗？"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchRoles();
    fetchMenusAndResources();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-lg font-medium">角色管理</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingRole(null);
            setDialogVisible(true);
          }}
        >
          新建角色
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={roles}
        loading={loading}
        rowKey="id"
        scroll={{ x: 1200 }}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
          onChange: (page, pageSize) => fetchRoles(page, pageSize),
        }}
      />

      <RoleDialog
        open={dialogVisible}
        role={editingRole}
        resources={resources}
        onCancel={() => {
          setDialogVisible(false);
          setEditingRole(null);
        }}
        onOk={handleSave}
      />
    </div>
  );
};

export default RolePage;
