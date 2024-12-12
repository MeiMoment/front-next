"use client";

import { useState } from "react";
import { Card, Button } from "antd";
import { KeyOutlined } from "@ant-design/icons";
import ChangePasswordModal from "@/components/ChangePasswordModal";

const DashboardPage = () => {
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

  const quickActions = [
    {
      title: "修改密码",
      icon: <KeyOutlined />,
      onClick: () => setPasswordModalVisible(true),
    },
    // 这里可以添加更多快捷操作
  ];

  return (
    <div className="p-6 space-y-6">
      <Card title="常用操作" className="shadow-sm">
        <div className="flex gap-4">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              type="default"
              icon={action.icon}
              onClick={action.onClick}
            >
              {action.title}
            </Button>
          ))}
        </div>
      </Card>

      <ChangePasswordModal
        open={passwordModalVisible}
        onCancel={() => setPasswordModalVisible(false)}
      />
    </div>
  );
};

export default DashboardPage;
