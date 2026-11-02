import { ForbiddenError, UnauthorizedError } from "@/errors";
import type { FieldErrors } from "@/types/action-result";
import type { GroupSummary } from "@/types/group";

export function validationErrors(error: {
  flatten: () => { fieldErrors: FieldErrors };
}): FieldErrors {
  return error.flatten().fieldErrors;
}

export function errorMessage(error: unknown): string {
  if (error instanceof UnauthorizedError) return "Log in to continue.";
  if (error instanceof ForbiddenError)
    return "You do not have access to this group.";
  return "The operation could not be completed.";
}

export function toGroupSummary(group: {
  id: string;
  name: string;
  inviteToken: string;
  createdAt: Date;
}): GroupSummary {
  return {
    id: group.id,
    name: group.name,
    inviteToken: group.inviteToken,
    createdAt: group.createdAt.toISOString(),
  };
}
