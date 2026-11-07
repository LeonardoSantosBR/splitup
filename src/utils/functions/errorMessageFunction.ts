import { ForbiddenError, UnauthorizedError } from "@/errors";

export function errorMessage(error: unknown, message: string): string {
  if (error instanceof UnauthorizedError) return message;
  if (error instanceof ForbiddenError) return message;
  return "A operação não pôde ser concluída.";
}
