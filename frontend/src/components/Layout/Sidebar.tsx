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
  { key: "/category", icon: <TagsOutlined size={18} />, label: "Categories" },
  { key: "/personal", icon: <UserOutlined size={18} />, label: "Personal" },
  { key: "/group", icon: <TeamOutlined size={18} />, label: "Group" },
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
      <div className="flex items-center px-6 py-6 space-x-2 overflow-hidden justify-between">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center p-1 justify-center text-white shadow">
              <Wallet size={14} />
            </div>
          </div>
        )}
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          className="text-lg w-10 h-10 flex items-center justify-center hover:bg-indigo-50 text-indigo-600"
        />
      </div>

      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={items}
        className="border-none px-2 flex-1"
        style={{
          fontWeight: 500,
        }}
      />
    </Sider>
  );
};

export default AppSidebar;
