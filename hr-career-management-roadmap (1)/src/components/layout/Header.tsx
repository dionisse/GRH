"use client";

import React, { useState } from "react";
import { Bell, Search, Menu, Wifi, WifiOff } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";

interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
}

export function Header({ title, onMenuClick }: HeaderProps) {
  const [isOnline, setIsOnline] = useState(true);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-slate-200/60">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-lg font-semibold text-slate-900">
            {title}
          </h1>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="hidden md:flex items-center bg-slate-100 rounded-lg px-3 py-2 border border-transparent focus-within:border-blue-200 focus-within:bg-white transition-colors">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="bg-transparent border-none outline-none ml-2 text-sm w-40 lg:w-60 text-slate-700 placeholder:text-slate-400"
            />
          </div>

          {/* Online status */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium ${
              isOnline
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-amber-50 text-amber-700 border border-amber-200"
            }`}
          >
            {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
            <span className="hidden sm:inline">{isOnline ? "En ligne" : "Hors ligne"}</span>
          </div>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
          </button>

          {/* User avatar */}
          <div className="flex items-center gap-2">
            <Avatar name="Admin RH" size="sm" />
          </div>
        </div>
      </div>

      {/* Offline banner */}
      {!isOnline && (
        <div className="bg-amber-50 text-amber-800 text-sm py-2 px-4 text-center border-b border-amber-200">
          Vous êtes hors ligne. Les modifications seront synchronisées à la reconnexion.
        </div>
      )}
    </header>
  );
}
