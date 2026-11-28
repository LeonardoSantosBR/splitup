import type { LambdaEventProps, LambdaResponseProps } from "../types";
import { lambdaResponseFunction } from "../functions/lambdaResponseFunction";
import { prisma } from "../../src/db/prismaDb";
import { calculateGroupBalances } from "../../src/utils/domain/groupFinancialDomain";
import { assertBalancesSumToZero } from "../../src/utils/domain/balancesDomain";
import { cents } from "../../src/utils/domain/moneyDomain";

export async function handler(
  event: LambdaEventProps
): Promise<LambdaResponseProps> {
  const expectedToken = process.env.LAMBDA_INTERNAL_TOKEN;
  const receivedToken = event.headers?.["x-internal-token"];

  if (!expectedToken || receivedToken !== expectedToken)
    return lambdaResponseFunction(401, { error: "Unauthorized" });

  const groupId = event.queryStringParameters?.groupId;
  if (!groupId)
    return lambdaResponseFunction(400, { error: "groupId is required" });

  try {
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: { include: { user: true } },
        expenses: { include: { shares: true } },
        settlements: true,
      },
    });

    if (!group)
      return lambdaResponseFunction(404, { error: "Group not found" });

    const balances = calculateGroupBalances(
      group.expenses.map((expense) => ({
        payerId: expense.payerId,
        shares: new Map(
          expense.shares.map((share) => [
            share.memberId,
            cents(share.amountCents),
          ])
        ),
      })),
      group.settlements
    );

    assertBalancesSumToZero(balances);

    return lambdaResponseFunction(200, {
      balances: group.members.map(({ user }) => ({
        memberId: user.id,
        memberName: user.name ?? user.email ?? "Membro",
        amountCents: balances.get(user.id) ?? cents(0),
      })),
    });
  } catch (error) {
    console.error("getGroupBalances failed", error);
    return lambdaResponseFunction(500, {
      error: "Could not load group balances",
    });
  }
}
