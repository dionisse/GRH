"use client";

import React from "react";

interface ProgressProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
  color?: "blue" | "green" | "amber" | "red" | "purple";
}

export function Progress({
  value,
  max = 100,
  label,
  showValue = true,
  size = "md",
  color = "blue",
}: ProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3",
  };

  const colorClasses = {
    blue: "bg-blue-600",
    green: "bg-green-600",
    amber: "bg-amber-500",
    red: "bg-red-600",
    purple: "bg-purple-600",
  };

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between mb-1">
          {label && (
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {label}
            </span>
          )}
          {showValue && (
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className={`progress-bar ${sizeClasses[size]}`}>
        <div
          className={`progress-bar-fill ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
