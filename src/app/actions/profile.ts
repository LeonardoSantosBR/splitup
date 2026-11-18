"use server";

import { AuthUserSessionAuth } from "@/auth/auth";
import { prisma } from "@/db/prismaDb";
import { UserProfileProps } from "@/types";
import type { ActionResultProps } from "@/types/actionResultProps";
import { errorMessage } from "@/utils/functions/errorMessageFunction";
import { validationErrors } from "@/utils/functions/validationErrorsFunction";
import { updateUserProfileSchema } from "@/utils/schemas/userSchema";

export async function updateUserProfile(
  input: unknown
): Promise<ActionResultProps<UserProfileProps>> {
  const parsed = updateUserProfileSchema.safeParse(input);
  if (!parsed.success)
    return { success: false, fieldErrors: validationErrors(parsed.error) };

  try {
    const user = await AuthUserSessionAuth();
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { name: parsed.data.name },
      select: { name: true, email: true, image: true },
    });
    return {
      success: true,
      data: {
        name: updated.name ?? parsed.data.name,
        email: updated.email ?? "",
        image: updated.image,
      },
    };
  } catch (error) {
    return {
      success: false,
      formError: errorMessage(error, "Não foi possível atualizar seu perfil."),
    };
  }
}
