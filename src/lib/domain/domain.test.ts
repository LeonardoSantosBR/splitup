import { describe, expect, it } from "vitest";
import { assertBalancesSumToZero, calculateBalances } from "./balances";
import { cents } from "./money";
import { simplifyDebts } from "./settlements";
import {
  splitByExactAmounts,
  splitByPercentages,
  splitEqually,
} from "./splits";

describe("splitEqually", () => {
  it("distributes leftover cents in stable participant order", () => {
    expect(
      [...splitEqually(cents(100), ["a", "b", "c"])].map(([, value]) => value),
    ).toEqual([34, 33, 33]);
  });

  it("supports zero, one participant, and large groups", () => {
    expect([...splitEqually(cents(0), ["a", "b"])]).toEqual([
      ["a", 0],
      ["b", 0],
    ]);
    expect([...splitEqually(cents(7), ["a"])]).toEqual([["a", 7]]);
    expect(
      splitEqually(
        cents(1000),
        Array.from({ length: 100 }, (_, index) => String(index)),
      ).size,
    ).toBe(100);
  });
});

describe("percentage and exact splits", () => {
  it("splits percentages and assigns rounding leftovers deterministically", () => {
    expect(
      [
        ...splitByPercentages(
          cents(101),
          new Map([
            ["a", 50],
            ["b", 50],
          ]),
        ),
      ].map(([, value]) => value),
    ).toEqual([51, 50]);
  });

  it("validates percentage and exact totals", () => {
    expect(() =>
      splitByPercentages(cents(100), new Map([["a", 30]])),
    ).toThrow();
    expect(() =>
      splitByExactAmounts(cents(100), new Map([["a", cents(99)]])),
    ).toThrow();
    expect(
      [
        ...splitByExactAmounts(
          cents(100),
          new Map([
            ["a", cents(40)],
            ["b", cents(60)],
          ]),
        ),
      ].map(([, value]) => value),
    ).toEqual([40, 60]);
  });
});

describe("balances", () => {
  it("computes payer credit minus each participant share", () => {
    const balances = calculateBalances([
      {
        payerId: "a",
        shares: new Map([
          ["a", cents(50)],
          ["b", cents(50)],
        ]),
      },
    ]);
    expect([...balances]).toEqual([
      ["a", 50],
      ["b", -50],
    ]);
    expect(() => assertBalancesSumToZero(balances)).not.toThrow();
  });
});

describe("simplifyDebts", () => {
  it("matches the largest creditor and debtor", () => {
    expect(
      simplifyDebts(
        new Map([
          ["a", cents(100)],
          ["b", cents(-70)],
          ["c", cents(-30)],
        ]),
      ),
    ).toEqual([
      { fromMemberId: "b", toMemberId: "a", amount: 70 },
      { fromMemberId: "c", toMemberId: "a", amount: 30 },
    ]);
  });

  it("returns no transfers for a settled group and rejects non-zero totals", () => {
    expect(simplifyDebts(new Map([["a", cents(0)]]))).toEqual([]);
    expect(() => simplifyDebts(new Map([["a", cents(10)]]))).toThrow();
  });
});
