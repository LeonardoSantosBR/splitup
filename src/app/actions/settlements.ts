"use server";

import { AuthUserGroupMember } from "@/auth/auth";
import { prisma } from "@/db/prismaDb";
import type { ActionResultProps, GroupSettlementsProps } from "@/types";
import { cents } from "@/utils/domain/moneyDomain";
import { errorMessage } from "@/utils/functions/errorMessageFunction";

export async function getGroupSettlements(
  groupId: string
): Promise<ActionResultProps<GroupSettlementsProps>> {
  try {
    await AuthUserGroupMember(groupId);
    const lambdaUrl = process.env.SETTLEMENTS_LAMBDA_URL;
    const lambdaToken = process.env.LAMBDA_INTERNAL_TOKEN;

    if (!lambdaUrl || !lambdaToken)
      throw new Error("Settlements Lambda environment is not configured");

    const url = new URL(lambdaUrl);
    url.searchParams.set("groupId", groupId);
    const response = await fetch(url, {
      headers: { "x-internal-token": lambdaToken },
      cache: "no-store",
    });

    if (response.status === 404)
      return { success: false, formError: "Grupo não encontrado." };
    if (!response.ok)
      throw new Error(`Settlements Lambda returned ${response.status}`);

    const result = (await response.json()) as GroupSettlementsProps;
    return {
      success: true,
      data: {
        settlements: result.settlements.map((settlement) => ({
          ...settlement,
          amountCents: cents(settlement.amountCents),
        })),
      },
    };
  } catch (error) {
    return {
      success: false,
      formError: errorMessage(error, "Não foi possível calcular os acertos."),
    };
  }
}

export async function createSettlement(input: {
  groupId: string;
  fromMemberId: string;
  toMemberId: string;
  amountCents: number;
}): Promise<ActionResultProps<null>> {
  try {
    await AuthUserGroupMember(input.groupId);
    if (
      input.fromMemberId === input.toMemberId ||
      input.amountCents <= 0 ||
      !Number.isInteger(input.amountCents)
    )
      return { success: false, formError: "Pagamento inválido." };
    await prisma.settlement.create({ data: input });
    return { success: true, data: null };
  } catch (error) {
    return {
      success: false,
      formError: errorMessage(error, "Não foi possível registrar o pagamento."),
    };
  }
}
