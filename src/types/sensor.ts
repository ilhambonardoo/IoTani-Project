export interface SensorData {
  pH: number;
  moisture: number;
  temperature: number;
  status: "normal" | "warning" | "critical";
  timestamp?: string;
}

export interface SensorStatus {
  id: string;
  name: string;
  type: "pH" | "moisture" | "temperature";
  status: "online" | "offline";
  lastReading: string;
  value: number;
}

export interface SensorAlertProps {
  type: "warning" | "critical";
  sensor: "pH" | "moisture" | "temperature";
  message: string;
  value: number;
  unit: string;
  onClose?: () => void;
  showCloseButton?: boolean;
}

export interface SensorAlertBannerProps {
  alerts: Array<{
    id: string;
    type: "warning" | "critical";
    sensor: "pH" | "moisture" | "temperature";
    message: string;
    value: number;
    unit: string;
    severity: "low" | "medium" | "high";
  }>;
  onClose?: (id: string) => void;
}
