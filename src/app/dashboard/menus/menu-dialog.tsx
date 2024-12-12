"use client";

import React, { useEffect } from "react";
import { Modal, Form, Input, Select, InputNumber } from "antd";
import * as Icons from "@ant-design/icons";
import { Menu } from "@/types/menu";

// 获取所有图标组件
const iconList = Object.keys(Icons)
  .filter((key) => key.endsWith("Outlined")) // 只使用 Outlined 类型的图标
  .map((key) => ({
    label: key.replace("Outlined", ""),
    value: key,
    icon: React.createElement(
      Icons[key as keyof typeof Icons] as React.ComponentType
    ),
  }));

interface MenuDialogProps {
  open: boolean;
  menu?: Menu | null;
  menuList?: Menu[];
  onCancel: () => void;
  parentId: string;
  onOk: (values: any, id?: number) => void;
}

export const MenuDialog = ({
  open,
  menu,
  menuList = [],
  onCancel,
  onOk,
  parentId,
}: MenuDialogProps) => {
  const [form] = Form.useForm();
  const isEdit = !!menu;

  useEffect(() => {
    if (open) {
      if (menu) {
        // 处理图标回显
        const iconName = menu.icon?.endsWith("Outlined")
          ? menu.icon
          : menu.icon
          ? `${menu.icon}Outlined`
          : undefined;

        form.setFieldsValue({
          ...menu,
          icon: iconName,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, menu, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      // 处理图标名称，移除 Outlined 后缀
      if (values.icon) {
        values.icon = values.icon.replace("Outlined", "");
      }
      onOk(values, menu?.id);
    } catch (error) {
      console.error("表单验证失败:", error);
    }
  };

  // 渲染当前选中的图标
  const selectedIcon = form.getFieldValue("icon");
  const IconComponent = selectedIcon
    ? Icons[selectedIcon as keyof typeof Icons]
    : null;

  return (
    <Modal
      title={isEdit ? "编辑菜单" : "新建菜单"}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      destroyOnClose
    >
      <Form form={form} layout="vertical" initialValues={{ type: "menu" }}>
        <Form.Item
          name="name"
          label="菜单名称"
          rules={[{ required: true, message: "请输入菜单名称" }]}
        >
          <Input placeholder="请输入菜单名称" />
        </Form.Item>

        <Form.Item name="path" label="菜单路径">
          <Input placeholder="请输入菜单路径" />
        </Form.Item>

        <Form.Item name="parentId" label="上级菜单" initialValue={parentId}>
          <Select
            placeholder="请选择上级菜单"
            allowClear
            options={menuList.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="type"
          label="菜单类型"
          rules={[{ required: true, message: "请选择菜单类型" }]}
        >
          <Select
            options={[
              { label: "菜单", value: "menu" },
              { label: "路径", value: "path" },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="icon"
          label="菜单图标"
          extra={
            IconComponent && (
              <div className="mt-2">
                当前图标：{React.createElement(IconComponent as any)}
              </div>
            )
          }
        >
          <Select
            showSearch
            allowClear
            placeholder="请选择图标"
            optionFilterProp="label"
            options={iconList}
            optionRender={(option) => (
              <div className="flex items-center gap-2">
                {option.data.icon}
                <span>{option.data.label}</span>
              </div>
            )}
          />
        </Form.Item>

        <Form.Item name="order" label="排序号">
          <InputNumber placeholder="请输入排序号" style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
