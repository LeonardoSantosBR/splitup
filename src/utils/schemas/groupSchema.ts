import { z } from "zod";

export const createGroupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Informe um nome para o grupo.")
    .max(80, "O nome deve ter no máximo 80 caracteres."),
});

export const updateGroupNameSchema = createGroupSchema.extend({
  groupId: z.string().min(1),
});

export const joinGroupSchema = z.object({
  inviteToken: z.string().trim().min(1, "Informe um convite válido."),
});
