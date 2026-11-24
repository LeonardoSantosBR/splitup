import type {
  GroupFinancialDataProps,
  LambdaEventProps,
  LambdaResponseProps,
} from "../types";
import { response } from "../functions/responseFunction";
import { prisma } from "../../src/db/prismaDb";
import { assertBalancesSumToZero } from "../../src/utils/domain/balancesDomain";
import { calculateGroupBalances } from "../../src/utils/domain/groupFinancialDomain";
import { cents } from "../../src/utils/domain/moneyDomain";
import { simplifyDebts } from "../../src/utils/domain/settlementsDomain";

export async function handler(
  event: LambdaEventProps,
): Promise<LambdaResponseProps> {
  const expectedToken = process.env.LAMBDA_INTERNAL_TOKEN;
  const receivedToken = event.headers?.["x-internal-token"];

  if (!expectedToken || receivedToken !== expectedToken)
    return response(401, { error: "Unauthorized" });

  const groupId = event.queryStringParameters?.groupId;
  if (!groupId) return response(400, { error: "groupId is required" });

  try {
    const group = (await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: { include: { user: true } },
        expenses: { include: { shares: true } },
        settlements: true,
      },
    })) as GroupFinancialDataProps | null;

    if (!group) return response(404, { error: "Group not found" });

    const balances = calculateGroupBalances(
      group.expenses.map((expense) => ({
        payerId: expense.payerId,
        shares: new Map(
          expense.shares.map((share) => [
            share.memberId,
            cents(share.amountCents),
          ]),
        ),
      })),
      group.settlements,
    );

    assertBalancesSumToZero(balances);

    const names = new Map(
      group.members.map(({ user }) => [
        user.id,
        user.name ?? user.email ?? "Membro",
      ]),
    );

    return response(200, {
      settlements: simplifyDebts(balances).map((settlement) => ({
        fromMemberId: settlement.fromMemberId,
        fromMemberName: names.get(settlement.fromMemberId) ?? "Membro",
        toMemberId: settlement.toMemberId,
        toMemberName: names.get(settlement.toMemberId) ?? "Membro",
        amountCents: settlement.amount,
      })),
    });
  } catch (error) {
    console.error("getGroupSettlements failed", error);
    return response(500, { error: "Could not calculate settlements" });
  }
}
