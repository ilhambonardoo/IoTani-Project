export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalMessages: number;
  pendingMessages: number;
}

export interface ZoneData {
  id: string;
  name: string;
  location: string;
  status: "online" | "offline";
  chartData?: unknown[];
}

export interface ActivityLog {
  id: number;
  robot: string;
  action: string;
  zone: string;
  timestamp: string;
}

export interface MenuItem {
  href: string;
  icon: React.ReactNode;
  label: string;
  roles: string[];
}
