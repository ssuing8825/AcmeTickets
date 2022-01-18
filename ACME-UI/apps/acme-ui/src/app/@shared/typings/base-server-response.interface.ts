export interface IBaseServerResponse<T> {
  data: T;
  totalRecords: number;
  message: string;
  error: string;
  warning: string;
}
