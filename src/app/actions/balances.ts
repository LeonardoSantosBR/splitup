"use server";

import { AuthUserGroupMember } from "@/auth/auth";
import type { ActionResultProps, GroupBalancesProps } from "@/types";
import { cents } from "@/utils/domain/moneyDomain";
import { errorMessage } from "@/utils/functions/errorMessageFunction";

export async function getGroupBalances(
  groupId: string
): Promise<ActionResultProps<GroupBalancesProps>> {
  try {
    await AuthUserGroupMember(groupId);
    const lambdaUrl = process.env.BALANCES_LAMBDA_URL;
    const lambdaToken = process.env.LAMBDA_INTERNAL_TOKEN;

    if (!lambdaUrl || !lambdaToken)
      throw new Error("Balances Lambda environment is not configured");

    const url = new URL(lambdaUrl);
    url.searchParams.set("groupId", groupId);
    const response = await fetch(url, {
      headers: { "x-internal-token": lambdaToken },
      cache: "no-store",
    });

    if (response.status === 404)
      return { success: false, formError: "Grupo não encontrado." };
    if (!response.ok)
      throw new Error(`Balances Lambda returned ${response.status}`);

    const result = (await response.json()) as GroupBalancesProps;

    return {
      success: true,
      data: {
        balances: result.balances.map((balance) => ({
          ...balance,
          amountCents: cents(balance.amountCents),
        })),
      },
    };
  } catch (error) {
    return {
      success: false,
      formError: errorMessage(error, "Não foi possível carregar os saldos."),
    };
  }
}
