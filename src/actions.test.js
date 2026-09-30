import { describe, expect, it, vi } from "vitest";

// Only fe-core's dispatcher is stubbed; the formatters are real, imported from their
// defining modules because fe-core's barrel imports itself.
const core = vi.hoisted(() => ({
  graphql: vi.fn((payload, type, meta) => ({ payload, type, meta })),
}));

vi.mock("@openimis/fe-core", async () => ({
  ...(await vi.importActual("@openimis/fe-core/helpers/api")),
  toISODate: (await vi.importActual("@openimis/fe-core/helpers/i18n")).toISODate,
  ...core,
}));

const actions = await import("./actions");
const { globalId } = await import("@openimis/fe-core/testing");

const REFS = {
  "product.ProductPicker.projection": "id,code,name",
  "policy.PolicyOfficerPicker.projection": "id,code,lastName",
  "insuree.FamilyPicker.projection": ["id", "uuid"],
  "location.Location.FlatProjection": "id,code,name",
};
const mm = {
  getRef: (key) => REFS[key],
  getProjection: () => "{id,code}",
};

const query = (result) => result.payload.replace(/\s+/g, " ");

const product = { id: globalId("ProductGQLType", "7") };
const family = { id: globalId("FamilyGQLType", "12") };
const officer = { id: globalId("OfficerGQLType", "3") };

describe("policy actions", () => {
  describe("family and insuree policies", () => {
    it("asks for the family's policies by default", () => {
      const result = actions.fetchFamilyOrInsureePolicies(mm, ['familyUuid: "family-1"']);

      expect(result.type).toBe("POLICY_FAMILY_POLICIES");
      expect(query(result)).toContain('policiesByFamily(familyUuid: "family-1") { totalCount');
      expect(query(result)).toContain("policyValue,balance");
    });

    it("asks for one insuree's policies when filtered on an insurance number", () => {
      const result = actions.fetchFamilyOrInsureePolicies(mm, ['chfId: "070707070"', "activeOrLastExpiredOnly: true"]);

      expect(result.type).toBe("POLICY_INSUREE_POLICIES");
      expect(query(result)).toContain('policiesByInsuree(chfId: "070707070",activeOrLastExpiredOnly: true)');
    });
  });

  describe("eligibility", () => {
    it("asks what the insuree is still entitled to", () => {
      const result = actions.fetchEligibility("070707070");

      expect(result.type).toBe("POLICY_INSUREE_ELIGIBILITY");
      expect(query(result)).toContain('policyEligibilityByInsuree(chfId:"070707070")');
      expect(query(result)).toContain("totalAdmissionsLeft");
    });

    it.each([
      ["item", "fetchItemEligibility", "POLICY_INSUREE_ITEM_ELIGIBILITY", 'policyItemEligibilityByInsuree(chfId:"070707070", itemCode:"PARA")', "isItemOk"],
      ["service", "fetchServiceEligibility", "POLICY_INSUREE_SERVICE_ELIGIBILITY", 'policyServiceEligibilityByInsuree(chfId:"070707070", serviceCode:"PARA")', "isServiceOk"],
    ])("asks whether one %s is covered", (_label, creator, type, call, field) => {
      const result = actions[creator]("070707070", "PARA");

      expect(result.type).toBe(type);
      expect(query(result)).toContain(call);
      expect(query(result)).toContain(field);
    });

    it.each([
      ["item", "itemEligibilityClear", "POLICY_INSUREE_ITEM_ELIGIBILITY_CLEAR"],
      ["service", "serviceEligibilityClear", "POLICY_INSUREE_SERVICE_ELIGIBILITY_CLEAR"],
    ])("clears the %s answer", (_label, creator, type) => {
      const dispatch = vi.fn();
      actions[creator]()(dispatch);

      expect(dispatch).toHaveBeenCalledExactlyOnceWith({ type });
    });
  });

  it("selects a policy", () => {
    const dispatch = vi.fn();
    actions.selectPolicy({ uuid: "policy-1" })(dispatch);

    expect(dispatch).toHaveBeenCalledExactlyOnceWith({ type: "POLICY_POLICY", payload: { uuid: "policy-1" } });
  });

  describe("policy search and load", () => {
    it("asks for a counted page with the pickers' projections", () => {
      const result = actions.fetchPolicySummaries(mm, ["first: 10"]);

      expect(result.type).toBe("POLICY_POLICIES");
      expect(query(result)).toContain("policies(first: 10) { totalCount");
      expect(query(result)).toContain("product{id,code,name}");
      expect(query(result)).toContain("officer{id,code,lastName}");
      expect(query(result)).toContain("family{id,uuid,location{id,code,name}}");
      expect(query(result)).toContain("value,sumPremiums");
      expect(query(result)).not.toContain("claimDedRems");
    });

    it("loads one policy with its history and its claim deductibles", () => {
      const result = actions.fetchPolicyFull(mm, "policy-1");

      expect(result.type).toBe("POLICY_POLICY");
      expect(query(result)).toContain('policies(uuid: "policy-1",showHistory: true)');
      expect(query(result)).toContain("claimDedRems{edges { node {dedG dedIp dedOp remG remIp remOp} } }");
      expect(query(result)).not.toContain("totalCount");
    });
  });

  describe("policy values", () => {
    const renewal = (expiryDate) => ({
      stage: "R",
      enrollDate: "2024-06-15",
      product,
      family,
      prevPolicy: { uuid: "prev-1", expiryDate },
    });

    it("computes a new policy from its enrolment date", () => {
      const result = actions.fetchPolicyValues({ stage: "N", enrollDate: "2024-06-15", product, family });

      expect(result.type).toBe("POLICY_FETCH_POLICY_VALUES");
      expect(query(result)).toContain(
        'policyValues(stage: "N",enrollDate: "2024-06-15T00:00:00",productId: 7,familyId: 12) { policy{startDate expiryDate value},warnings }',
      );
      expect(query(result)).not.toContain("prevUuid");
    });

    it.each([
      ["mid-month", "2024-06-30", "2024-07-01"],
      ["at the end of a month", "2024-01-31", "2024-02-01"],
      ["into a leap day", "2024-02-28", "2024-02-29"],
      ["across the year end", "2024-12-31", "2025-01-01"],
    ])("renews from the day after the previous policy expires, %s", (_label, expiry, expected) => {
      vi.stubEnv("TZ", "UTC");
      const sent = query(actions.fetchPolicyValues(renewal(expiry)));

      expect(sent).toContain(`stage: "R",enrollDate: "${expected}T00:00:00"`);
      expect(sent).toContain('prevUuid: "prev-1"');
    });

    it("renews from the day after expiry in a time zone east of UTC", () => {
      vi.stubEnv("TZ", "Asia/Kolkata");
      expect(new Date(2024, 0, 31).getTimezoneOffset()).toBe(-330);

      expect(query(actions.fetchPolicyValues(renewal("2024-01-31")))).toContain('enrollDate: "2024-02-01T00:00:00"');
    });

    // Currently fails: the expiry date string is parsed as UTC midnight but shifted and formatted
    // in local time, so west of UTC the "day after" lands on the expiry day itself.
    it.fails("renews from the day after expiry in a time zone west of UTC", () => {
      vi.stubEnv("TZ", "America/New_York");

      expect(query(actions.fetchPolicyValues(renewal("2024-01-31")))).toContain('enrollDate: "2024-02-01T00:00:00"');
    });

    it("accepts numeric ids as well as global ones", () => {
      const result = actions.fetchPolicyValues({
        stage: "N",
        enrollDate: "2024-06-15",
        product: { id: "7" },
        family: { id: "12" },
      });

      expect(query(result)).toContain("productId: 7,familyId: 12");
    });
  });

  describe("mutations", () => {
    const policy = (overrides = {}) => ({
      enrollDate: "2024-06-15",
      startDate: "2024-06-15",
      expiryDate: "2025-06-14",
      value: 120.456,
      product,
      family,
      officer,
      ...overrides,
    });

    it.each([
      ["createPolicy", "createPolicy", "POLICY_CREATE_POLICY_RESP"],
      ["updatePolicy", "updatePolicy", "POLICY_UPDATE_POLICY_RESP"],
      ["renewPolicy", "renewPolicy", "POLICY_RENEW_POLICY_RESP"],
    ])("%s sends the policy to %s", (creator, operation, resp) => {
      const result = actions[creator](mm, policy(), "Save policy");

      expect(result.type).toEqual(["POLICY_MUTATION_REQ", resp, "POLICY_MUTATION_ERR"]);
      expect(query(result)).toContain(`mutation ${operation} { ${operation}( input: {`);
      expect(query(result)).toContain(`clientMutationId: "${result.meta.clientMutationId}"`);
      expect(query(result)).toContain('clientMutationLabel: "Save policy"');
      expect(query(result)).toContain(
        'enrollDate: "2024-06-15" startDate: "2024-06-15" expiryDate: "2025-06-14" value: "120.46" productId: 7 familyId: 12 officerId: 3',
      );
      expect(result.meta).toMatchObject({ clientMutationLabel: "Save policy" });
      expect(result.meta.requestedDateTime).toBeInstanceOf(Date);
    });

    it("sends the uuid only for a saved policy", () => {
      expect(query(actions.createPolicy(mm, policy(), "Create"))).not.toContain("uuid:");
      expect(query(actions.updatePolicy(mm, policy({ uuid: "policy-1" }), "Update"))).toContain('uuid: "policy-1"');
    });

    it("sends the payment fields only when they are filled in", () => {
      const bare = query(actions.createPolicy(mm, policy(), "Create"));
      const paid = query(
        actions.createPolicy(mm, policy({ isPaid: true, receipt: "RC-7", payer: { uuid: "payer-1" } }), "Create"),
      );

      expect(bare).not.toMatch(/isPaid|receipt|payerUuid/);
      expect(paid).toContain('isPaid: true receipt: "RC-7" payerUuid: "payer-1"');
    });

    it("always sends the value with two decimals", () => {
      expect(query(actions.createPolicy(mm, policy({ value: 50 }), "Create"))).toContain('value: "50.00"');
    });

    // Currently fails: the receipt number is interpolated into the mutation unescaped, so a
    // quote in it ends the string early and the mutation is rejected as malformed, and fe-core's
    // formatGQLString must escape backslashes first.
    it.fails("escapes a quote in the receipt number", () => {
      expect(query(actions.createPolicy(mm, policy({ receipt: 'RC"7' }), "Create"))).toContain('receipt: "RC\\"7"');
    });

    it.each([
      ["updatePolicy", policy({ uuid: "policy-1" })],
      ["renewPolicy", policy()],
    ])("%s tags the policy with its client mutation id", (creator, subject) => {
      const result = actions[creator](mm, subject, "Save");

      expect(subject.clientMutationId).toBe(result.meta.clientMutationId);
    });

    it.each([
      ["suspendPolicy", "suspendPolicies", "POLICY_SUSPEND_POLICIES_RESP"],
      ["deletePolicy", "deletePolicies", "POLICY_DELETE_POLICIES_RESP"],
    ])("%s sends the policy uuid to %s", (creator, operation, resp) => {
      const subject = { uuid: "policy-1" };
      const result = actions[creator](mm, subject, "Act");

      expect(result.type).toEqual(["POLICY_MUTATION_REQ", resp, "POLICY_MUTATION_ERR"]);
      expect(query(result)).toContain(`${operation}( input: {`);
      expect(query(result)).toContain('uuids: ["policy-1"]');
      expect(subject.clientMutationId).toBe(result.meta.clientMutationId);
    });

    it.each(["suspendPolicy", "deletePolicy"])("%s prefers the uuid under the family summary's name", (creator) => {
      const result = actions[creator](mm, { policyUuid: "summary-1", uuid: "other" }, "Act");

      expect(query(result)).toContain('uuids: ["summary-1"]');
    });
  });

  describe("family", () => {
    it("loads a family by uuid, history included", () => {
      const result = actions.fetchFamily(mm, "family-1", "070707070");

      expect(result.type).toBe("INSUREE_FAMILY_OVERVIEW");
      expect(query(result)).toContain('families(uuid: "family-1",showHistory: true)');
      expect(query(result)).toContain("location{id,code}");
      expect(query(result)).toContain("headInsuree{id,uuid,chfId");
    });

    it("finds a family by its head's insurance number when there is no uuid", () => {
      const result = actions.fetchFamily(mm, null, "070707070");

      expect(query(result)).toContain('families(headInsuree_ChfId: "070707070")');
      expect(query(result)).not.toContain("showHistory");
    });
  });
});
