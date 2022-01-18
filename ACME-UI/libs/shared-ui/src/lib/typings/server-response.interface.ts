/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IServerResponse {
  data: any;
  totalRecords: number;
  error: string;
  message: string;
  warning: string;
}
