import { z } from "zod";

export const updateUserProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Informe seu nome.")
    .max(80, "O nome deve ter no máximo 80 caracteres."),
});
