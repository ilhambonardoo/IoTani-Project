export interface ApiResponse<T = unknown> {
  status: boolean;
  message?: string;
  data?: T;
}

export interface ServiceResponse<T = unknown> {
  status: boolean;
  statusCode: number;
  message?: string;
  data?: T;
  error?: unknown;
}
