"use client";

import { Button, Form, Input, Modal, Select } from "antd";
import { useToast } from "@/components/ui/use-toast";
import { channelService } from "@/services/channel";
import { roleService } from "@/services/role";
import { userService } from "@/services/user";
import { Channel } from "@/types/channel";
import { Role } from "@/types/role";
import { CreateUserDto, UpdateUserDto, User } from "@/types/user";
import { useEffect, useState } from "react";

interface UserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User;
  onSuccess: () => void;
}

export function UserDialog({
  isOpen,
  onClose,
  user,
  onSuccess,
}: UserDialogProps) {
  const [form] = Form.useForm();
  const { toast } = useToast();
  const [roles, setRoles] = useState<Role[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesData, channelsData] = await Promise.all([
          roleService.getRoles(),
          channelService.getChannels(),
        ]);
        setRoles(rolesData);
        setChannels(channelsData);
      } catch (error) {
        toast({
          title: "获取数据失败",
          variant: "destructive",
        });
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (user) {
      user.roles = user.roles.map((role) => {
        if (typeof role === "number") {
          return role;
        }
        return role.id;
      });
      form.setFieldsValue(user);
    } else {
      form.resetFields();
    }
  }, [user, form]);

  const handleSubmit = async (values: CreateUserDto | UpdateUserDto) => {
    try {
      if (user) {
        await userService.updateUser(user.id, {
          ...values,
          id: user.id,
        });
        toast({ title: "更新成功" });
      } else {
        await userService.createUser(values as CreateUserDto);
        toast({ title: "创建成功" });
      }
      onSuccess();
    } catch (error) {
      toast({
        title: user ? "更新失败" : "创建失败",
        variant: "destructive",
      });
    }
  };

  return (
    <Modal
      title={user ? "编辑用户" : "新增用户"}
      open={isOpen}
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          status: 1,
        }}
      >
        <Form.Item
          name="username"
          label="用户名"
          rules={[{ required: true, message: "请输入用户名" }]}
        >
          <Input disabled={!!user} />
        </Form.Item>

        {!user && (
          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password />
          </Form.Item>
        )}

        <Form.Item
          name="roles"
          label="角色"
          rules={[{ required: true, message: "请选择角色" }]}
        >
          <Select mode="multiple">
            {roles.map((role) => (
              <Select.Option key={role.id} value={role.id}>
                {role.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="channel" label="渠道">
          <Select allowClear>
            {channels.map((channel) => (
              <Select.Option key={channel.id} value={channel.code}>
                {channel.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="status"
          label="状态"
          rules={[{ required: true, message: "请选择状态" }]}
        >
          <Select>
            <Select.Option value={1}>启用</Select.Option>
            <Select.Option value={0}>禁用</Select.Option>
          </Select>
        </Form.Item>

        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>取消</Button>
          <Button type="primary" htmlType="submit">
            确定
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
