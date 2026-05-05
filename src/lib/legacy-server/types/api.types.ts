export type ApiMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type ApiResponse<T> =
  | {
      success: true;
      message?: string;
      data: T;
      meta?: ApiMeta;
    }
  | {
      success: false;
      code: string;
      message: string;
      details?: unknown;
      requestId: string;
    };

export type PaginatedResult<T> = {
  data: T[];
  meta: ApiMeta;
};

