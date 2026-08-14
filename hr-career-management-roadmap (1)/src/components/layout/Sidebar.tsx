"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  Calendar,
  Target,
  GraduationCap,
  TrendingUp,
  Briefcase,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  User,
  Wallet,
  LogOut,
} from "lucide-react";

const menuItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Tableau de bord" },
  { href: "/employees", icon: Users, label: "Employés" },
  { href: "/departments", icon: Building2, label: "Départements" },
  { href: "/payroll", icon: Wallet, label: "Paie" },
  { href: "/leaves", icon: Calendar, label: "Congés" },
  { href: "/evaluations", icon: Target, label: "Évaluations" },
  { href: "/trainings", icon: GraduationCap, label: "Formations" },
  { href: "/careers", icon: TrendingUp, label: "Carrières" },
  { href: "/recruitment", icon: Briefcase, label: "Recrutement" },
  { href: "/documents", icon: FileText, label: "Documents" },
  { href: "/settings", icon: Settings, label: "Paramètres" },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : ""}`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-100">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-600/20 flex-shrink-0">
          RH
        </div>
        {!collapsed && (
          <span className="text-xl font-bold text-slate-900">RH360</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-0.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`sidebar-link ${isActive ? "active" : ""}`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User section */}
      <div className="border-t border-slate-100 p-3">
        <div className="flex items-center gap-3 px-1">
          <div className="w-9 h-9 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center flex-shrink-0">
            <User size={18} className="text-slate-600" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">Admin RH</p>
              <p className="text-xs text-slate-500 truncate">admin@rh360.com</p>
            </div>
          )}
          {!collapsed && (
            <button className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors" title="Déconnexion">
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 bg-white rounded-full flex items-center justify-center text-slate-500 hover:text-blue-600 border border-slate-200 shadow-sm transition-colors"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  );
}
