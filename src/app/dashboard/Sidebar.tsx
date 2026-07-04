"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, FileCode2, Send, Settings, LogOut } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Templates", href: "/dashboard/templates", icon: FileCode2 },
    { name: "Send Batch", href: "/dashboard/send", icon: Send },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="w-64 border-r border-white/10 bg-[#111118] h-full flex flex-col">
      <div className="h-16 flex items-center px-6 gap-3 border-b border-white/10">
        <img src="/logo.png" alt="Relay Logo" className="w-8 h-8 rounded-none border border-white/20 shadow-[2px_2px_0px_rgba(176,48,136,0.8)] object-cover" />
        <span className="text-xl font-bold uppercase tracking-widest text-white">Relay</span>
      </div>

      <div className="flex-1 overflow-auto py-6 px-4 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wider transition-all
                ${isActive 
                  ? "bg-[#b04090]/10 text-[#c8a0e0] border-l-2 border-[#b04090]" 
                  : "text-[#8888a8] hover:bg-white/5 hover:text-white border-l-2 border-transparent"
                }
              `}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-3 px-4 py-3 w-full text-left text-sm font-bold uppercase tracking-wider text-[#8888a8] hover:text-white hover:bg-white/5 transition-all"
        >
          <LogOut size={18} />
          Log Out
        </button>
      </div>
    </div>
  );
}
