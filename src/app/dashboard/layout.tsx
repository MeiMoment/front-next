"use client";
import React, { useState, useEffect } from "react";
import { Layout, Menu, Button, Avatar, Dropdown } from "antd";
import {
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { MenuItem } from "@/types/auth";

const { Header, Sider, Content } = Layout;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { logout, menuInfo } = useAuth();
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const renderIcon = (iconName: string) => {
    try {
      const IconComponent = require("@ant-design/icons")[`${iconName}Outlined`];
      return IconComponent ? <IconComponent /> : null;
    } catch (error) {
      return null;
    }
  };

  const convertMenuToAntdFormat = (menu: MenuItem) => {
    const menuItem: {
      key: string;
      icon: React.ReactNode | null;
      label: string;
      onClick?: () => void;
      children?: any[];
    } = {
      key: menu.path || menu.id.toString(),
      icon: menu.icon ? renderIcon(menu.icon) : null,
      label: menu.name,
      onClick: menu.path ? () => router.push(menu.path as string) : undefined,
    };

    if (menu.children && menu.children.length > 0) {
      menuItem.children = menu.children.map(convertMenuToAntdFormat);
    }

    return menuItem;
  };

  const findParentKeys = (items: MenuItem[], targetPath: string, parentKeys: string[] = []): string[] => {
    for (const item of items) {
      if (item.path === targetPath) {
        return parentKeys;
      }
      if (item.children) {
        const found = findParentKeys(item.children, targetPath, [...parentKeys, item.id.toString()]);
        if (found.length) {
          return found;
        }
      }
    }
    return [];
  };

  useEffect(() => {
    if (menuInfo && pathname) {
      const parentKeys = findParentKeys(menuInfo, pathname);
      setOpenKeys(prev => [...new Set([...prev, ...parentKeys])]);
    }
  }, [pathname, menuInfo]);

  const menuItems = menuInfo?.map(convertMenuToAntdFormat) || [];

  const handleLogout = () => {
    logout();
  };

  const userMenu = {
    items: [
      {
        key: "logout",
        icon: <LogoutOutlined />,
        label: "退出登录",
        onClick: handleLogout,
      },
    ],
  };

  return (
    <Layout className="min-h-screen">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="relative shadow-lg"
        width={260}
        style={{
          background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
        }}
      >
        <div className="h-16 flex items-center justify-center border-b border-white/10">
          <h1 className="text-white text-xl font-bold tracking-wider">ADMIN</h1>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          openKeys={openKeys}
          onOpenChange={setOpenKeys}
          items={menuItems}
          className="bg-transparent border-none [&_.ant-menu-item]:my-1 [&_.ant-menu-item]:mx-2 
                   [&_.ant-menu-item]:rounded-lg [&_.ant-menu-item-selected]:bg-white/20 
                   [&_.ant-menu-item-selected]:text-white [&_.ant-menu-item]:text-slate-300
                   [&_.ant-menu-item:hover]:text-white [&_.ant-menu-item:hover]:bg-white/10
                   [&_.ant-menu-submenu-title]:text-slate-300 [&_.ant-menu-submenu]:mx-2
                   [&_.ant-menu-submenu-active]:text-white
                   [&_.ant-menu-submenu-selected>.ant-menu-submenu-title]:text-white"
        />
      </Sider>
      <Layout>
        <Header className="bg-white px-4 flex justify-between items-center shadow-sm h-16 sticky top-0 z-10">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="text-lg hover:bg-gray-100 transition-colors"
          />
          <Dropdown menu={userMenu} placement="bottomRight">
            <div className="flex items-center cursor-pointer hover:bg-gray-50 px-3 py-1 rounded-full transition-colors">
              <Avatar icon={<UserOutlined />} className="bg-slate-700" />
              <span className="ml-2 text-gray-700 font-medium">管理员</span>
            </div>
          </Dropdown>
        </Header>
        <Content className="m-6 p-6 bg-white rounded-lg shadow-sm min-h-[280px]">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
