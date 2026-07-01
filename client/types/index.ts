export interface DecodedToken {
  id: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  body: T;
  status: number;
  pageSize?: number;
  pageNumber?: number;
  totalItems?: number;
  totalPages?: number;
}

export interface ApiErrorResponse {
  success: boolean;
  message: string;
  body: null;
  status: number;
}
