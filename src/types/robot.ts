export interface RobotStatus {
  id: string;
  name: string;
  status: "idle" | "moving" | "spraying" | "charging" | "offline";
  battery: number;
}

export interface ExtendedRobotStatus extends RobotStatus {
  location: string;
  lastUpdate: string;
}

export interface CameraFeed {
  id: string;
  name: string;
  robotName: string;
  robotId: string;
  location: string;
  status: "online" | "offline";
  hasDetection: boolean;
  detectionType?: "pest" | "disease" | "weed";
  imageUrl: string;
}
