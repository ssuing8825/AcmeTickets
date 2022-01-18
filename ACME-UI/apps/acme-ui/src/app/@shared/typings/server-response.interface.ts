export interface ServerResponse {
  data?: unknown;
  error?: string;
  errorCode?: string;
  message: string;
  totalRecords?: number;
  warning?: string;
}
