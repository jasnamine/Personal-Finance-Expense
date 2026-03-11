import {
  AppstoreOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TagsOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Menu, Tooltip } from "antd";
import Sider from "antd/es/layout/Sider";
import { Wallet } from "lucide-react";
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

const rawItems = [
  {
    key: "/dashboard",
    icon: <AppstoreOutlined size={18} />,
    label: "Dashboard",
  },
  { key: "/category", icon: <TagsOutlined size={18} />, label: "Danh mục" },
  { key: "/personal", icon: <UserOutlined size={18} />, label: "Cá nhân" },
  { key: "/group", icon: <TeamOutlined size={18} />, label: "Nhóm" },
];

const AppSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const items = rawItems.map((item) => ({
    key: item.key,
    icon: collapsed ? (
      <Tooltip title={item.label} placement="right">
        {item.icon}
      </Tooltip>
    ) : (
      item.icon
    ),
    label: <NavLink to={item.key}>{item.label}</NavLink>,
  }));

  return (
    <Sider
      theme="light"
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={240}
      className="border-r border-gray-100 flex flex-col"
    >
      {/* Logo */}
      <div className="flex items-center px-6 py-6 space-x-2 overflow-hidden">
        <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center p-1 justify-center text-white shadow">
          <Wallet size={16} />
        </div>
        {!collapsed && (
          <span className="font-bold text-xl tracking-tight text-indigo-600 whitespace-nowrap">
            Retrofin
          </span>
        )}
      </div>

      {/* Menu */}
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={items}
        className="border-none px-2 flex-1"
        style={{
          fontWeight: 500,
        }}
      />

      {/* Toggle button */}
      <div className="flex justify-center py-4 border-t">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          className="text-lg w-10 h-10 flex items-center justify-center hover:bg-indigo-50 text-indigo-600"
        />
      </div>
    </Sider>
  );
};

export default AppSidebar;
