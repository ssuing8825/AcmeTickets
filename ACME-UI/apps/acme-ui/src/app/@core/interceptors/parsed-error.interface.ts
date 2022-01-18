export interface ParsedError {
  angularRoute: string;
  appId: string;
  errorName: string | null;
  firstName?: string | null;
  id?: string;
  message: string;
  originalErrorStack: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parsedStackInfo?: any;
  stackFrames: string;
  timeInEpochMilliseconds: number;
  userName?: string | null;
}
