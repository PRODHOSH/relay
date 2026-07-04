"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import { User } from "next-auth";

export default function Topbar({ user }: { user?: User }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="h-16 flex items-center justify-end px-6 border-b border-white/10 bg-[#111118]">
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-3 bg-[#111118] border border-white/20 px-3 py-2 shadow-[2px_2px_0px_rgba(176,48,136,0.8)] hover:shadow-[4px_4px_0px_rgba(176,48,136,0.8)] hover:-translate-y-[2px] transition-all focus:outline-none rounded-none"
          suppressHydrationWarning
        >
          {user?.image ? (
            <img src={user.image} alt={user.name || "User"} className="w-8 h-8 rounded-none border border-white/20 object-cover" />
          ) : (
            <div className="w-8 h-8 bg-[#b04090] border border-white/20 flex items-center justify-center font-bold text-sm rounded-none">
              {user?.name?.charAt(0) || "U"}
            </div>
          )}
          <span className="font-bold text-sm tracking-widest uppercase text-white hidden sm:block">
            {user?.name || "User"}
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#8888a8]"><path d="m6 9 6 6 6-6"/></svg>
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-[#111118] border border-white/10 shadow-[4px_4px_0px_rgba(0,0,0,0.5)] z-50 flex flex-col py-2">
            <div className="px-4 py-2 border-b border-white/10 mb-2">
              <p className="text-sm font-bold truncate text-white">{user?.name}</p>
              <p className="text-xs text-[#8888a8] truncate">{user?.email}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="px-4 py-2 text-left text-sm font-bold uppercase hover:bg-white/5 transition-colors"
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
