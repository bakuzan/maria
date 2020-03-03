export interface FetchResponse {
  success: boolean;
  data?: any;
  error?: Error;
  errorMessages?: string[];
  errors?: any[];
}
