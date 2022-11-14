export interface Result<T> {
  code?: string | number;
  message?: string;
  // details?: any;
  data?: T;
}

export const okResult = <T>(result: Omit<Result<T>, "code">): Result<T> => ({
  ...result,
  code: 1,
});

export const errorResult = <T>(result: Omit<Result<T>, "code">): Result<T> => ({
  ...result,
  code: 0,
});
