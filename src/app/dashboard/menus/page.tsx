"use client";

import React from "react";
import { useState, useEffect } from "react";
import { Tree, Button, message, Popconfirm, Space } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Menu } from "@/types/menu";
import { menuService } from "@/services/menu";
import { MenuDialog } from "./menu-dialog";
import * as Icons from "@ant-design/icons";
import type { DataNode } from "antd/es/tree";

const MenuPage = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [parentId, setParentId] = useState<number | null>(null);
  const [pathMenus, setPathMenus] = useState<Menu[]>([]);

  const handleFetchMenus = async () => {
    try {
      setLoading(true);
      const data = await menuService.getTree();
      setMenus(data);
      // 过滤出所有类型为path的菜单
      const filterPathMenus = (menus: Menu[]): Menu[] => {
        return menus.reduce<Menu[]>((acc, menu) => {
          if (menu.type === "path") {
            acc.push(menu);
          }
          if (menu.children) {
            acc.push(...filterPathMenus(menu.children));
          }
          return acc;
        }, []);
      };
      setPathMenus(filterPathMenus(data));
    } catch (error) {
      message.error("获取菜单列表失败");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await menuService.delete(id);
      message.success("删除成功");
      handleFetchMenus();
    } catch (error) {
      message.error("删除失败");
    }
  };

  const handleSave = async (values: any, id?: number) => {
    try {
      if (id) {
        await menuService.update(id, values);
        message.success("更新成功");
      } else {
        await menuService.create({
          ...values,
          parentId: parentId || null,
        });
        message.success("创建成功");
      }
      setDialogVisible(false);
      setEditingMenu(null);
      setParentId(null);
      handleFetchMenus();
    } catch (error) {
      message.error(id ? "更新失败" : "创建失败");
    }
  };

  const renderIcon = (icon: string) => {
    if (!icon) return null;
    const IconComponent = Icons[`${icon}Outlined` as keyof typeof Icons];
    return IconComponent ? React.createElement(IconComponent as any) : null;
  };

  const convertToTreeData = (menus: Menu[]): DataNode[] => {
    return menus.map((menu) => ({
      key: menu.id,
      title: (
        <div className="flex items-center justify-between w-full pr-4">
          <span className="flex items-center gap-2">
            {renderIcon(menu.icon as string)}
            <span>{menu.name}</span>
          </span>
          <Space size="middle">
            {menu.type === "path" && (
              <Button
                type="link"
                icon={<PlusOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  setParentId(menu.id);
                  setEditingMenu(null);
                  setDialogVisible(true);
                }}
              >
                添加子菜单
              </Button>
            )}
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                setEditingMenu(menu);
                setDialogVisible(true);
              }}
            >
              编辑
            </Button>

            <Popconfirm
              title="确定要删除该菜单吗？"
              onConfirm={(e) => {
                e?.stopPropagation();
                handleDelete(menu.id);
              }}
            >
              <Button
                type="link"
                danger
                icon={<DeleteOutlined />}
                onClick={(e) => e.stopPropagation()}
              >
                删除
              </Button>
            </Popconfirm>
          </Space>
        </div>
      ),
      children: menu.children ? convertToTreeData(menu.children) : undefined,
    }));
  };

  useEffect(() => {
    handleFetchMenus();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-lg font-medium">菜单管理</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingMenu(null);
            setParentId(null);
            setDialogVisible(true);
          }}
        >
          新增根菜单
        </Button>
      </div>

      <Tree
        className="menu-tree"
        treeData={convertToTreeData(menus)}
        showLine
        blockNode
      />

      <MenuDialog
        open={dialogVisible}
        menu={editingMenu}
        menuList={pathMenus}
        parentId={parentId as unknown as string}
        onCancel={() => {
          setDialogVisible(false);
          setEditingMenu(null);
          setParentId(null);
        }}
        onOk={handleSave}
      />
    </div>
  );
};

export default MenuPage;
