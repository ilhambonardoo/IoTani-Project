export interface User {
  id: string;
  email: string;
  fullName: string;
  role: "user" | "admin" | "owner";
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SensorData {
  pH: number;
  moisture: number;
  temperature: number;
  status: "normal" | "warning" | "critical";
  timestamp?: string;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  condition: "sunny" | "rainy" | "cloudy";
  windSpeed: number;
}

export interface RobotStatus {
  id: string;
  name: string;
  status: "idle" | "moving" | "spraying" | "charging" | "offline";
  battery: number;
}

export interface Template {
  id: string;
  name: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  title: string;
  content: string;
  author: string;
  authorEmail: string;
  createdAt: string;
  replies?: Reply[];
}

export interface Reply {
  id: string;
  content: string;
  author: string;
  authorEmail: string;
  createdAt: string;
}

export interface Content {
  id: string;
  title: string;
  content: string;
  category: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Chili {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  characteristics?: string;
  uses?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface QuestionMessage {
  id: string;
  title: string;
  content: string;
  category: string;
  authorName: string;
  authorEmail?: string;
  authorRole?: string;
  recipientRole?: string;
  createdAt: string;
  replies?: QuestionReply[];
}

export interface QuestionReply {
  id: string;
  responderName: string;
  responderRole?: string;
  content: string;
  createdAt: string;
}

export interface QuestionThread {
  id: string;
  title: string;
  category: string;
  content: string;
  createdAt: string;
  authorName?: string;
  authorEmail?: string;
  recipientRole?: string;
  replies: QuestionReply[];
}

export interface ChatBubble {
  id: string;
  sender: "user" | "admin" | "owner";
  content: string;
  timestamp: string;
  senderLabel: string;
  replyId?: string;
}

export interface ExtendedSessionUser {
  fullName?: string | null;
  role?: string | null;
  email?: string | null;
  name?: string | null;
}

export interface SessionUser {
  fullName?: string;
  email?: string;
  [key: string]: unknown;
}

export interface ZoneData {
  id: string;
  name: string;
  location: string;
  status: "online" | "offline";
  chartData?: unknown[];
}

export interface MLAnalysisResult {
  objek?: string;
  penyakit?: string;
  confidence?: string;
  error?: string;
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

export interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  imageUrl?: string;
  author?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionFormData {
  title: string;
  category: string;
  content: string;
  recipientRole: string;
}

export interface LoginUserData {
  id?: string;
  email: string;
  password: string;
  role?: string;
  fullName?: string;
  [key: string]: unknown;
}

export interface ApiResponse<T = unknown> {
  status: boolean;
  message?: string;
  data?: T;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalMessages: number;
  pendingMessages: number;
}

export interface ServiceResponse<T = unknown> {
  status: boolean;
  statusCode: number;
  message?: string;
  data?: T;
  error?: unknown;
}

export interface ContentPayload {
  title: string;
  category: string;
  content: string;
  role?: string;
}

export interface ChiliPayload {
  name: string;
  description: string;
  imageUrl?: string;
  characteristics?: string;
  uses?: string;
}

export interface QuestionPayload {
  title: string;
  content: string;
  category: string;
  authorName: string;
  authorEmail?: string;
  authorRole?: string;
  recipientRole?: string;
}

export interface QuestionReplyPayload {
  responderName: string;
  responderRole?: string;
  content: string;
}

export interface TemplatePayload {
  name: string;
  title: string;
  content: string;
  category?: string;
}

export interface GoogleUserPayload {
  email: string;
  fullName: string;
  type?: string;
  role?: string;
}

export interface ProfileData {
  phone?: string;
  location?: string;
  bio?: string;
  avatarUrl?: string;
  instagram?: string;
  fullName?: string;
  email?: string;
}

export interface EmailConfig {
  to: string;
  subject: string;
  html: string;
}

export interface ExtendedToken {
  email?: string | null;
  fullName?: string;
  role?: string;
}

export interface ExtendedSession {
  user: {
    email?: string | null;
    fullName?: string;
    role?: string;
    name?: string | null;
    image?: string | null;
  };
}

export interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
  toDate: () => Date;
  toMillis: () => number;
}

export interface UserData {
  id: string;
  email: string;
  fullName: string;
  password?: string;
  role?: string;
  [key: string]: unknown;
}

export interface SensorStatus {
  id: string;
  name: string;
  type: "pH" | "moisture" | "temperature";
  status: "online" | "offline";
  lastReading: string;
  value: number;
}

export interface ActivityLog {
  id: number;
  robot: string;
  action: string;
  zone: string;
  timestamp: string;
}

export interface ExtendedRobotStatus extends RobotStatus {
  location: string;
  lastUpdate: string;
}

export interface ExportData {
  date: string;
  suhu: number;
  kelembapan: number;
  pH: number;
}

export interface MenuItem {
  href: string;
  icon: React.ReactNode;
  label: string;
  roles: string[];
}

export interface AnimatedChartProps {
  title: string;
  data: Array<{
    date: string;
    suhu?: number;
    kelembapan?: number;
    pH?: number;
  }>;
  lines: Array<{
    key: string;
    color: string;
    name: string;
  }>;
  animationSpeed?: "slow" | "normal" | "fast";
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
