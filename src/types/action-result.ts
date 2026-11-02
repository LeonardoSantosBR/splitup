export type FieldErrors = Record<string, string[]>;

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; fieldErrors?: FieldErrors; formError?: string };
