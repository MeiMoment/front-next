'use client';

import { useEffect } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { Resource, ResourceAction } from '@/types/resource';

interface ResourceDialogProps {
  open: boolean;
  resource?: Resource | null;
  onCancel: () => void;
  onOk: (values: any, id?: number) => void;
}

export const ResourceDialog = ({
  open,
  resource,
  onCancel,
  onOk,
}: ResourceDialogProps) => {
  const [form] = Form.useForm();
  const isEdit = !!resource;

  useEffect(() => {
    if (open) {
      if (resource) {
        form.setFieldsValue(resource);
      } else {
        form.resetFields();
      }
    }
  }, [open, resource, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onOk(values, resource?.id);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  return (
    <Modal
      title={isEdit ? '编辑资源' : '新建资源'}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ actions: [] }}
      >
        <Form.Item
          name="name"
          label="资源名称"
          rules={[{ required: true, message: '请输入资源名称' }]}
        >
          <Input placeholder="请输入资源名称" />
        </Form.Item>

        <Form.Item
          name="code"
          label="资源编码"
          rules={[{ required: true, message: '请输入资源编码' }]}
        >
          <Input placeholder="请输入资源编码" />
        </Form.Item>

        <Form.Item
          name="description"
          label="资源描述"
        >
          <Input.TextArea placeholder="请输入资源描述" rows={4} />
        </Form.Item>

        <Form.Item
          name="actions"
          label="操作权限"
          rules={[{ required: true, message: '请选择操作权限' }]}
        >
          <Select
            mode="multiple"
            placeholder="请选择操作权限"
            options={Object.values(ResourceAction).map(action => ({
              label: action,
              value: action,
            }))}
            allowClear
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}; 