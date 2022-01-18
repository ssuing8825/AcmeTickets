import { appConstants } from '@shared/constants/app.constant';

export class ParsedCustomServerError {
  error?: string | null;
  public message: string | null;
  warning?: string | null;

  constructor(error?: string, message?: string) {
    this.error = error || appConstants.defaultServerError.error;
    this.message = message || appConstants.defaultServerError.message;
  }
}
