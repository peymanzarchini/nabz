import { AuthenticatedUser } from "./index.ts";

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }

    interface Response {
      success: <T>(
        message: string,
        body: T,
        status?: number,
        pagination?: {
          pageSize: number;
          pageNumber: number;
          totalItems: number;
          totalPages: number;
        },
      ) => Response;

      fail: <T>(message: string, body?: T, status?: number) => Response;
    }
  }
}

export {};
