import {
    policyLabel,
    policyBalance,
    policySumDedRems,
    canDeletePolicy,
    canRenewPolicy,
    canSuspendPolicy,
    policyMutation,
  } from "../src/utils/utils.js";
  import {
    RIGHT_POLICY_DELETE,
    RIGHT_POLICY_RENEW,
    RIGHT_POLICY_SUSPEND,
    POLICY_STATUS_ACTIVE,
  } from "../src/constants.js";
  
  describe("policy utils", () => {
    const basePolicy = {
      uuid: "POL123",
      policyUuid: "POL123",
      family: "Doe",
      startDate: "2025-01-01",
      expiryDate: "2025-12-31",
      value: 1000,
      sumPremiums: 200,
      status: POLICY_STATUS_ACTIVE,
      claimDedRems: {
        edges: [
          { node: { dedG: 50, dedIp: 20, dedOp: 10, remG: 5, remIp: 2, remOp: 1 } },
          { node: { dedG: 30, dedIp: 10, dedOp: 5, remG: 3, remIp: 1, remOp: 0 } },
        ],
      },
    };
  
    const rights = [RIGHT_POLICY_DELETE, RIGHT_POLICY_RENEW, RIGHT_POLICY_SUSPEND];
  
    describe("policyLabel()", () => {
      it("returns formatted label with dates", () => {
        const mockMM = { getRef: jest.fn(() => (family => family)) };
        expect(policyLabel(mockMM, basePolicy)).toBe("Doe - 2025-01-01 : 2025-12-31");
      });
  
      it("returns empty string if policy is null", () => {
        expect(policyLabel({}, null)).toBe("");
      });
    });
  
    describe("policyBalance()", () => {
      it("calculates balance correctly", () => {
        expect(policyBalance(basePolicy)).toBeCloseTo(800);
      });
  
      it("returns null if policy is null", () => {
        expect(policyBalance(null)).toBeNull();
      });
    });
  
    describe("policySumDedRems()", () => {
      it("sums all deductions and reimbursements correctly", () => {
        const result = policySumDedRems({ ...basePolicy });
        expect(result.sumClaimDedG).toBe(80);
        expect(result.sumClaimDedIp).toBe(30);
        expect(result.sumClaimDedOp).toBe(15);
        expect(result.sumClaimRemG).toBe(8);
        expect(result.sumClaimRemIp).toBe(3);
        expect(result.sumClaimRemOp).toBe(1);
      });
  
      it("returns policy unchanged if no claimDedRems", () => {
        const p = { ...basePolicy, claimDedRems: null };
        expect(policySumDedRems(p)).toEqual(p);
      });
    });
  
    describe("canDeletePolicy()", () => {
      it("returns true if rights include delete and policy is valid", () => {
        expect(canDeletePolicy(rights, basePolicy)).toBe(true);
      });
  
      it("returns false if validityTo is set", () => {
        expect(canDeletePolicy(rights, { ...basePolicy, validityTo: "2025-12-31" })).toBe(false);
      });
  
      it("returns false if rights missing", () => {
        expect(canDeletePolicy([], basePolicy)).toBe(false);
      });
    });
  
    describe("canRenewPolicy()", () => {
      it("returns true if rights include renew and policy is valid", () => {
        expect(canRenewPolicy(rights, basePolicy)).toBe(true);
      });
  
      it("returns false if rights missing", () => {
        expect(canRenewPolicy([], basePolicy)).toBe(false);
      });
    });
  
    describe("canSuspendPolicy()", () => {
      it("returns true if rights include suspend and status active", () => {
        expect(canSuspendPolicy(rights, basePolicy)).toBe(true);
      });
  
      it("returns false if status is not active", () => {
        expect(canSuspendPolicy(rights, { ...basePolicy, status: "SUSPENDED" })).toBe(false);
      });
  
      it("returns false if rights missing", () => {
        expect(canSuspendPolicy([], basePolicy)).toBe(false);
      });
    });
  
    describe("policyMutation()", () => {
      it("returns true if a policy has clientMutationId", () => {
        const state = { policy: { policies: [{ clientMutationId: "abc" }] } };
        expect(policyMutation(state)).toBe(true);
      });
  
      it("returns false if no policy has clientMutationId", () => {
        const state = { policy: { policies: [{}] } };
        expect(policyMutation(state)).toBe(false);
      });
  
      it("returns false if no policies", () => {
        expect(policyMutation({ policy: { policies: [] } })).toBe(false);
      });
    });
  });
  