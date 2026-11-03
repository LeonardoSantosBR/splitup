export type FieldErrors = Record<string, string[]>;

export type ActionResultProps<T> =
  | { success: true; data: T }
  | { success: false; fieldErrors?: FieldErrors; formError?: string };
