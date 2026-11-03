import type { Cents } from "./money";
import { assertNonNegativeCents, cents } from "./money";

export function splitEqually(
  total: Cents,
  participantIds: readonly string[],
): Map<string, Cents> {
  assertNonNegativeCents(total);
  if (participantIds.length === 0)
    throw new Error("At least one participant is required");

  if (new Set(participantIds).size !== participantIds.length)
    throw new Error("Participant IDs must be unique");

  const base = Math.floor(total / participantIds.length);
  const remainder = total % participantIds.length;
  return new Map(
    participantIds.map((participantId, index) => [
      participantId,
      cents(base + (index < remainder ? 1 : 0)),
    ]),
  );
}

export function splitByPercentages(
  total: Cents,
  percentages: ReadonlyMap<string, number>,
): Map<string, Cents> {
  assertNonNegativeCents(total);
  if (percentages.size === 0)
    throw new Error("At least one participant is required");

  const entries = [...percentages.entries()];
  if (
    entries.some(
      ([, percentage]) => percentage < 0 || !Number.isFinite(percentage),
    )
  ) {
    throw new Error("Percentages must be non-negative finite numbers");
  }
  const totalPercentage = entries.reduce(
    (sum, [, percentage]) => sum + percentage,
    0,
  );
  if (Math.abs(totalPercentage - 100) > 0.000001)
    throw new Error("Percentages must add up to 100");

  const shares = entries.map(
    ([participantId, percentage]) =>
      [participantId, Math.floor((total * percentage) / 100)] as const,
  );
  let remainder = total - shares.reduce((sum, [, share]) => sum + share, 0);
  const result = new Map(
    shares.map(([participantId, share]) => [participantId, cents(share)]),
  );
  for (const [participantId] of entries) {
    if (remainder === 0) break;
    const currentShare = result.get(participantId);
    if (currentShare === undefined)
      throw new Error("Missing participant share");
    result.set(participantId, cents(currentShare + 1));
    remainder -= 1;
  }
  return result;
}

export function splitByExactAmounts(
  total: Cents,
  shares: ReadonlyMap<string, Cents>,
): Map<string, Cents> {
  assertNonNegativeCents(total);
  if (shares.size === 0) {
    throw new Error("At least one participant is required");
  }
  for (const share of shares.values()) assertNonNegativeCents(share);
  const sum = [...shares.values()].reduce(
    (totalShare, share) => totalShare + share,
    0,
  );
  if (sum !== total) {
    throw new Error("Exact shares must add up to the total");
  }
  return new Map(shares);
}
