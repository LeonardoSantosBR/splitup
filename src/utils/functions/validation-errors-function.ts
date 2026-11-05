import { FieldErrors } from "@/types";

export function validationErrors(error: {
  flatten: () => { fieldErrors: FieldErrors };
}): FieldErrors {
  return error.flatten().fieldErrors;
}
