import { Bell, Moon, Search, Sun } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [dark, setDark] = useState(false);

  const toggleDark = () => {
    setDark(!dark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b px-8 flex justify-between items-center">
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
        <button
          onClick={toggleDark}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800"
        >
          {dark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <button className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800">
          <img
            src="https://i.pravatar.cc/300"
            alt="User Avatar"
            className="w-8 h-8 rounded-full"
          />
          <span className="hidden md:inline-block text-sm font-medium">
            Nguyễn Văn A
          </span>
        </button>
      </div>
    </header>
  );
}
