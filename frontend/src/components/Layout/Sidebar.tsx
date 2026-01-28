import {
  History,
  LayoutDashboard,
  Settings,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transactions", label: "Lịch sử", icon: History },
  { to: "/income", label: "Thu nhập", icon: TrendingUp },
  { to: "/expense", label: "Chi tiêu", icon: TrendingDown },
  { to: "/groups", label: "Nhóm", icon: Users },
  { to: "/profile", label: "Hồ sơ", icon: Settings },
];

export default function AppSidebar() {
  return (
    <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
          <Wallet />
        </div>
        <span className="text-xl font-extrabold">Retrofin</span>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive
                ? "bg-indigo-600 text-white flex items-center gap-4 px-4 py-3 rounded-xl font-semibold transition"
                : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-4 px-4 py-3 rounded-xl font-semibold transition"
            }
          >
            <item.icon size={22} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
