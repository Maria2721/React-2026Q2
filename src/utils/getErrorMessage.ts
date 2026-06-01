import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export function getErrorMessage(error: unknown): string {
  if (!error) return 'Unknown error';

  const err = error as FetchBaseQueryError;

  if ('status' in err) {
    switch (err.status) {
      case 400:
        return 'Bad request. Please check your input.';
      case 401:
        return 'You are not authorized.';
      case 404:
        return 'Not found.';
      case 500:
        return 'Server error. Try again later.';
      default:
        return 'Something went wrong. Try again.';
    }
  }

  return 'Network error. Please check your connection.';
}
