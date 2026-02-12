import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Dropdown, Space, Tooltip, type MenuProps } from "antd";
import Avatar from "antd/es/avatar";
import { Moon, Search, Sun } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../../stores/authStore";

const userMenuItems: MenuProps["items"] = [
  {
    key: "profile",
    label: "Hồ sơ của tôi",
    icon: <UserOutlined />,
  },
  {
    key: "settings",
    label: "Cài đặt",
    icon: <SettingOutlined />,
  },
  {
    type: "divider",
  },
  {
    key: "logout",
    label: "Đăng xuất",
    icon: <LogoutOutlined />,
    danger: true,
  },
];

const Header = () => {
  const [dark, setDark] = useState(false);
  const { user } = useAuthStore();

  const toggleDark = () => {
    setDark(!dark);
    document.documentElement.classList.toggle("dark");
  };

  if (!user) {
    return null;
  }

  const getInitials = (name: string | undefined): string => {
    if (!name) return "??";

    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();

    const firstLetter = parts[0].charAt(0);
    const lastLetter = parts[parts.length - 1].charAt(0);

    return (firstLetter + lastLetter).toUpperCase();
  };

  return (
    <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur  px-8 flex justify-between items-center">
      <div className="relative w-64 hidden md:block">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          size={18}
        />
        <input
          className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm outline-none"
          placeholder="Tìm nhanh..."
        />
      </div>

      <div className="flex items-center gap-4">
        <Tooltip placement="topRight" title={"Theme"}>
          <button
            onClick={toggleDark}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800"
          >
            {dark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </Tooltip>

        <Space size={20}>
          {/* Dropdown Avatar */}
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            arrow
            trigger={["click"]}
          >
            <Tooltip placement="topRight" title={"Account"}>
              <button className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800">
                <Avatar
                  style={{ backgroundColor: "red", verticalAlign: "middle" }}
                  size="small"
                >
                  {getInitials(user?.username)}
                </Avatar>
                <span className="hidden md:inline-block text-sm font-medium">
                  {user?.username}
                </span>
              </button>
            </Tooltip>
          </Dropdown>
        </Space>
      </div>
    </header>
  );
};

export default Header;
