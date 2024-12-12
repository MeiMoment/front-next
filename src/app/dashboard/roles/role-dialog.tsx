'use client';

import { useEffect, useState } from 'react';
import { Form, Input, Modal, Tree, Select, message } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { Role } from '@/types/role';
import { Menu } from '@/types/menu';
import { Resource } from '@/types/resource';
import { menuService } from '@/services/menu';

interface Props {
  open: boolean;
  role?: Role | null;
  resources: Resource[];
  onCancel: () => void;
  onOk: (values: any, id?: number) => void;
}

const RoleDialog = ({ open, role, resources, onCancel, onOk }: Props) => {
  const [form] = Form.useForm();
  const [menuTree, setMenuTree] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(false);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    if (open) {
      const menuIds = role?.menus?.map(menu => menu.id.toString()) || [];
      setCheckedKeys(menuIds);
      form.setFieldsValue({
        name: role?.name || "",
        description: role?.description || "",
        menuIds: menuIds,
        resourceIds: role?.resources?.map(resource => resource.id) || [],
      });
      fetchMenuTree();
    }
  }, [open, role, form]);

  const fetchMenuTree = async () => {
    try {
      setLoading(true);
      const data = await menuService.getTree();
      setMenuTree(data);
    } catch (error) {
      message.error("获取菜单列表失败");
    } finally {
      setLoading(false);
    }
  };

  const convertToTreeData = (menus: Menu[]): DataNode[] => {
    return menus.map((menu) => ({
      key: menu.id.toString(),
      title: menu.name,
      children: menu.children ? convertToTreeData(menu.children) : undefined,
    }));
  };

  const handleCheck = (checked: any) => {
    setCheckedKeys(checked);
    form.setFieldValue('menuIds', checked);
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    const formattedValues = {
      ...values,
      menuIds: values.menuIds.map((id: string) => parseInt(id, 10)),
    };
    onOk(formattedValues, role?.id);
  };

  return (
    <Modal
      title={role ? "编辑角色" : "新增角色"}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      width={600}
      destroyOnClose
    >
      <Form 
        form={form} 
        layout="vertical"
        initialValues={{ menuIds: [], resourceIds: [] }}
      >
        <Form.Item
          name="name"
          label="角色名称"
          rules={[{ required: true, message: "请输入角色名称" }]}
        >
          <Input placeholder="请输入角色名称" />
        </Form.Item>

        <Form.Item name="description" label="角色描述">
          <Input.TextArea placeholder="请输入角色描述" rows={4} />
        </Form.Item>

        <Form.Item
          name="menuIds"
          label="菜单权限"
          rules={[{ required: true, message: "请选择菜单" }]}
        >
          <Tree
            checkable
            treeData={convertToTreeData(menuTree)}
            defaultExpandAll
            className="bg-gray-50 p-4 rounded-lg max-h-[400px] overflow-y-auto"
            onCheck={handleCheck}
            checkedKeys={checkedKeys}
          />
        </Form.Item>

        <Form.Item
          name="resourceIds"
          label="资源权限"
        >
          <Select
            mode="multiple"
            placeholder="请选择资源权限"
            allowClear
            options={resources.map(resource => ({
              label: resource.name,
              value: resource.id,
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RoleDialog; 