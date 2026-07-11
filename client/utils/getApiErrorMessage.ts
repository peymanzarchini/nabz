import { ApiErrorResponse } from "@/types";
import { AxiosError } from "axios";

const DEFAULT_ERROR = "مشکلی پیش آمده. لطفاً دوباره تلاش کنید.";

export function getApiErrorMessage(error: unknown): string {
  if (!error) return DEFAULT_ERROR;

  if ((error as AxiosError).isAxiosError) {
    const axiosError = error as AxiosError<ApiErrorResponse>;

    const message = axiosError.response?.data.message;

    if (typeof message === "string" && message.length > 0) {
      return message;
    }

    if (error instanceof Error) {
      return error.message || DEFAULT_ERROR;
    }
  }

  return DEFAULT_ERROR;
}
