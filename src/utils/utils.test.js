import { describe, expect, it } from "vitest";

import {
  canDeletePolicy,
  canRenewPolicy,
  canSuspendPolicy,
  policyBalance,
  policyLabel,
  policyMutation,
  policySumDedRems,
} from "./utils";
import {
  POLICY_STATUS_ACTIVE,
  POLICY_STATUS_IDLE,
  POLICY_STATUS_SUSPENDED,
  RIGHT_POLICY_DELETE,
  RIGHT_POLICY_RENEW,
  RIGHT_POLICY_SUSPEND,
} from "../constants";

describe("policyLabel", () => {
  const mm = { getRef: () => (family) => `Family of ${family.headInsuree.lastName}` };

  it("names the family and the coverage period", () => {
    const policy = { family: { headInsuree: { lastName: "Doe" } }, startDate: "2024-01-01", expiryDate: "2024-12-31" };

    expect(policyLabel(mm, policy)).toBe("Family of Doe - 2024-01-01 : 2024-12-31");
  });

  it("leaves a blank for dates not computed yet", () => {
    const policy = { family: { headInsuree: { lastName: "Doe" } } };

    expect(policyLabel(mm, policy)).toBe("Family of Doe -   :  ");
  });

  it("is empty without a policy", () => {
    expect(policyLabel(mm, null)).toBe("");
  });
});

describe("policyBalance", () => {
  it.each([
    ["the value minus what was paid", { value: 100, sumPremiums: 40 }, 60],
    ["decimal strings as the API sends them", { value: "100.50", sumPremiums: "40.25" }, 60.25],
    ["a float sum rounded to cents", { value: 0.3, sumPremiums: 0.1 }, 0.2],
    ["the full value when nothing was paid", { value: 80, sumPremiums: null }, 80],
    ["a negative balance for an overpaid policy", { value: 50, sumPremiums: 75.5 }, -25.5],
  ])("gives %s", (_label, policy, expected) => {
    expect(policyBalance(policy)).toBe(expected);
  });

  it("is null without a policy", () => {
    expect(policyBalance(null)).toBeNull();
  });
});

describe("policySumDedRems", () => {
  const withClaims = (...nodes) => ({ uuid: "policy-1", claimDedRems: { edges: nodes.map((node) => ({ node })) } });

  it("totals each deductible and remuneration across the claims", () => {
    const policy = policySumDedRems(
      withClaims(
        { dedG: 1, dedIp: 2, dedOp: 3, remG: 4, remIp: 5, remOp: 6 },
        { dedG: 10, dedIp: 20, dedOp: 30, remG: 40, remIp: 50, remOp: 60 },
      ),
    );

    expect(policy).toMatchObject({
      sumClaimDedG: 11,
      sumClaimDedIp: 22,
      sumClaimDedOp: 33,
      sumClaimRemG: 44,
      sumClaimRemIp: 55,
      sumClaimRemOp: 66,
    });
  });

  it("counts a missing amount as zero and rounds the totals to cents", () => {
    const policy = policySumDedRems(withClaims({ dedG: 0.1, remOp: null }, { dedG: 0.2 }));

    expect(policy.sumClaimDedG).toBe(0.3);
    expect(policy.sumClaimRemOp).toBe(0);
    expect(policy.sumClaimDedIp).toBe(0);
  });

  it("gives zero totals for a policy with no claims", () => {
    expect(policySumDedRems(withClaims()).sumClaimDedG).toBe(0);
  });

  it("leaves a policy loaded without claim totals untouched", () => {
    expect(policySumDedRems({ uuid: "policy-1" })).toEqual({ uuid: "policy-1" });
  });
});

describe("policy action rights", () => {
  const ALL_RIGHTS = [RIGHT_POLICY_DELETE, RIGHT_POLICY_RENEW, RIGHT_POLICY_SUSPEND];
  const policy = (overrides = {}) => ({ uuid: "policy-1", status: POLICY_STATUS_ACTIVE, ...overrides });

  describe.each([
    ["delete", canDeletePolicy, RIGHT_POLICY_DELETE],
    ["renew", canRenewPolicy, RIGHT_POLICY_RENEW],
    ["suspend", canSuspendPolicy, RIGHT_POLICY_SUSPEND],
  ])("%s", (_label, can, right) => {
    it("is allowed on a current, saved, idle-mutation policy with the right", () => {
      expect(can([right], policy())).toBe(true);
    });

    it("accepts the uuid under the name the family summary uses", () => {
      expect(can([right], { policyUuid: "policy-1", status: POLICY_STATUS_ACTIVE })).toBe(true);
    });

    it.each([
      ["without the right", [], policy()],
      ["on a history row", ALL_RIGHTS, policy({ validityTo: "2024-01-01" })],
      ["on an unsaved policy", ALL_RIGHTS, policy({ uuid: undefined })],
      ["while a mutation on it is pending", ALL_RIGHTS, policy({ clientMutationId: "client-1" })],
    ])("is refused %s", (_case, rights, subject) => {
      expect(can(rights, subject)).toBe(false);
    });
  });

  it.each([
    ["idle", POLICY_STATUS_IDLE],
    ["suspended", POLICY_STATUS_SUSPENDED],
  ])("does not suspend a policy that is %s", (_label, status) => {
    expect(canSuspendPolicy(ALL_RIGHTS, policy({ status }))).toBe(false);
  });

  it("renews and deletes whatever the status", () => {
    expect(canRenewPolicy(ALL_RIGHTS, policy({ status: POLICY_STATUS_SUSPENDED }))).toBe(true);
    expect(canDeletePolicy(ALL_RIGHTS, policy({ status: POLICY_STATUS_IDLE }))).toBe(true);
  });
});

describe("policyMutation", () => {
  it.each([
    ["a listed policy has a pending mutation", { policies: [{}, { clientMutationId: "client-1" }] }, true],
    ["no listed policy has one", { policies: [{}, {}] }, false],
    ["the list is not loaded", { policies: null }, false],
  ])("tells the family overview whether %s", (_label, slice, expected) => {
    expect(policyMutation({ policy: slice })).toBe(expected);
  });

  it("is false before the policy slice exists", () => {
    expect(policyMutation({})).toBe(false);
  });
});
