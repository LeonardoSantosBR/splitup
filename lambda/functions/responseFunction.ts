import type { LambdaResponseProps } from "../types/lambdaResponseProps";

export function response(
  statusCode: number,
  body: unknown,
): LambdaResponseProps {
  return {
    statusCode,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  };
}
