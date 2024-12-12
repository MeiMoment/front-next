"use client";

import { Button, Form, Input, Modal } from "antd";
import { useToast } from "@/components/ui/use-toast";
import { channelService } from "@/services/channel";
import { Channel, CreateChannelDto } from "@/types/channel";
import { useEffect } from "react";

interface ChannelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  channel?: Channel;
  onSuccess: () => void;
}

export function ChannelDialog({
  isOpen,
  onClose,
  channel,
  onSuccess,
}: ChannelDialogProps) {
  const [form] = Form.useForm();
  const { toast } = useToast();

  useEffect(() => {
    if (channel) {
      form.setFieldsValue(channel);
    } else {
      form.resetFields();
    }
  }, [channel, form]);

  const handleSubmit = async (values: CreateChannelDto) => {
    try {
      if (channel) {
        await channelService.updateChannel(channel.id, values);
        toast({ title: "更新成功" });
      } else {
        await channelService.createChannel(values);
        toast({ title: "创建成功" });
      }
      onSuccess();
    } catch (error) {
      toast({
        title: channel ? "更新失败" : "创建失败",
        variant: "destructive",
      });
    }
  };

  return (
    <Modal
      title={channel ? "编辑渠道" : "新增渠道"}
      open={isOpen}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="name"
          label="名称"
          rules={[{ required: true, message: "请输入渠道名称" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="code"
          label="代码"
          rules={[{ required: true, message: "请输入渠道代码" }]}
        >
          <Input />
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
