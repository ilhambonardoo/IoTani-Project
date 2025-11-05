import { ReactNode } from "react";

type StatCardProps = {
  title: string;
  value: string;
  icon: ReactNode;
  trend: string;
};

export function StatCard({ title, value, icon, trend }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-black p-6">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-400">{title}</span>
        {icon}
      </div>
      <p className="mt-2 text-4xl font-bold text-white">{value}</p>
      <p className="mt-2 text-sm text-gray-500">{trend}</p>
    </div>
  );
}
