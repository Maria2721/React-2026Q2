import { describe, it, expect } from 'vitest';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { getErrorMessage } from './getErrorMessage';

describe('getErrorMessage', () => {
  it('returns unknown error when error is null', () => {
    expect(getErrorMessage(null)).toBe('Unknown error');
  });

  it('returns bad request message', () => {
    const error = {
      status: 400,
    } as FetchBaseQueryError;

    expect(getErrorMessage(error)).toBe(
      'Bad request. Please check your input.'
    );
  });

  it('returns unauthorized message', () => {
    const error = {
      status: 401,
    } as FetchBaseQueryError;

    expect(getErrorMessage(error)).toBe('You are not authorized.');
  });

  it('returns not found message', () => {
    const error = {
      status: 404,
    } as FetchBaseQueryError;

    expect(getErrorMessage(error)).toBe('Not found.');
  });

  it('returns server error message', () => {
    const error = {
      status: 500,
    } as FetchBaseQueryError;

    expect(getErrorMessage(error)).toBe('Server error. Try again later.');
  });

  it('returns default message for unknown status', () => {
    const error = {
      status: 418,
    } as FetchBaseQueryError;

    expect(getErrorMessage(error)).toBe('Something went wrong. Try again.');
  });

  it('returns network error when status is missing', () => {
    expect(getErrorMessage({ message: 'failed' })).toBe(
      'Network error. Please check your connection.'
    );
  });
});
