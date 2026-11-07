import { z } from "zod";

export const createExpenseSchema = z.object({
  groupId: z.string().min(1),
  description: z.string().trim().min(1, "Informe uma descrição.").max(120),
  amount: z.string().trim().min(1, "Informe um valor."),
  payerId: z.string().min(1, "Selecione quem pagou."),
  participantIds: z
    .array(z.string())
    .min(1, "Selecione ao menos um participante."),
});
