import { describe, expect, it, vi } from "vitest";

// fe-core's barrel imports itself, so the real helpers come from their defining modules.
vi.mock("@openimis/fe-core", async () => vi.importActual("@openimis/fe-core/helpers/api"));

const { reducer } = await import("./reducer");
const { graphqlErrors, relayPage, serverError } = await import("@openimis/fe-core/testing");

const initial = () => reducer(undefined, { type: "@@INIT" });
const dispatch = (state, type, { payload, meta } = {}) => reducer(state, { type, payload, meta });
const respond = (state, type, data, extra = {}) => dispatch(state, type, { payload: { data, ...extra } });
const fail = (state, type, payload = serverError(500, "Internal Server Error", "boom")) =>
  dispatch(state, type, { payload });

const SERVER_ERROR = { code: 500, message: "Internal Server Error", detail: "boom" };
const DATA_ERROR = { code: "Data error", message: "Server returned data error status", detail: "bad filter" };

describe("policy reducer", () => {
  describe("initialisation", () => {
    it("starts with nothing loaded and nothing in flight", () => {
      const state = initial();

      expect(state.policies).toBeNull();
      expect(state.policy).toBeNull();
      expect(state.policyValues).toBeNull();
      expect(state.policiesPageInfo).toEqual({ totalCount: 0 });
      expect(state.submittingMutation).toBe(false);
      expect(state.mutation).toEqual({});
    });

    it("returns the same state object for an unrelated action", () => {
      const state = initial();

      expect(reducer(state, { type: "SOMETHING_ELSE" })).toBe(state);
    });
  });

  it("stores the policy picked in a list", () => {
    const picked = { uuid: "policy-1" };

    expect(dispatch(initial(), "POLICY_POLICY", { payload: picked }).policy).toBe(picked);
  });

  describe("policy lists", () => {
    const LISTS = [
      ["the family's policies", "POLICY_FAMILY_POLICIES", "policiesByFamily"],
      ["the insuree's policies", "POLICY_INSUREE_POLICIES", "policiesByInsuree"],
      ["the policy search", "POLICY_POLICIES", "policies"],
    ];

    it.each(LISTS)("marks %s as loading and clears the previous error", (_label, prefix) => {
      const stale = { ...initial(), fetchedPolicies: true, errorPolicies: SERVER_ERROR };
      const state = dispatch(stale, `${prefix}_REQ`);

      expect(state.fetchingPolicies).toBe(true);
      expect(state.fetchedPolicies).toBe(false);
      expect(state.errorPolicies).toBeNull();
    });

    it.each(LISTS)("unwraps and counts the page of %s", (_label, prefix, entity) => {
      const state = respond(initial(), `${prefix}_RESP`, {
        [entity]: relayPage([{ uuid: "policy-1" }, { uuid: "policy-2" }], {
          totalCount: 7,
          pageInfo: { hasNextPage: true },
        }),
      });

      expect(state.fetchingPolicies).toBe(false);
      expect(state.fetchedPolicies).toBe(true);
      expect(state.policies).toEqual([{ uuid: "policy-1" }, { uuid: "policy-2" }]);
      expect(state.policiesPageInfo).toMatchObject({ totalCount: 7, hasNextPage: true });
      expect(state.errorPolicies).toBeNull();
    });

    it.each(LISTS)("surfaces a data error from %s", (_label, prefix, entity) => {
      const state = respond(initial(), `${prefix}_RESP`, { [entity]: null }, graphqlErrors("bad filter"));

      expect(state.policies).toEqual([]);
      expect(state.errorPolicies).toEqual(DATA_ERROR);
    });

    it.each([
      ["the family's policies", "POLICY_FAMILY_POLICIES"],
      ["the insuree's policies", "POLICY_INSUREE_POLICIES"],
    ])("stops loading %s and formats a transport failure", (_label, prefix) => {
      const state = fail(dispatch(initial(), `${prefix}_REQ`), `${prefix}_ERR`);

      expect(state.fetchingPolicies).toBe(false);
      expect(state.errorPolicies).toEqual(SERVER_ERROR);
    });

    // Currently fails: the search failure writes `fetching` and `error`, keys nothing reads,
    // so the searcher keeps spinning and never shows why it failed.
    it.fails("stops the policy search and formats a transport failure", () => {
      const state = fail(dispatch(initial(), "POLICY_POLICIES_REQ"), "POLICY_POLICIES_ERR");

      expect(state.fetchingPolicies).toBe(false);
      expect(state.errorPolicies).toEqual(SERVER_ERROR);
    });

    const loaded = () => ({ ...initial(), policies: [{ uuid: "policy-1" }], policy: { uuid: "policy-1" } });

    it.each([
      ["the family's policies", "POLICY_FAMILY_POLICIES", null],
      ["the insuree's policies", "POLICY_INSUREE_POLICIES", null],
      ["the policy search", "POLICY_POLICIES", []],
    ])("empties the list when %s is requested", (_label, prefix, empty) => {
      expect(dispatch(loaded(), `${prefix}_REQ`).policies).toEqual(empty);
    });

    it.each([
      ["the family's policies", "POLICY_FAMILY_POLICIES"],
      ["the insuree's policies", "POLICY_INSUREE_POLICIES"],
    ])("empties the list when %s is requested and also drops the selection", (_label, prefix) => {
      expect(dispatch(loaded(), `${prefix}_REQ`).policy).toBeNull();
    });

    it("keeps the selected policy while searching, so an open form is not emptied", () => {
      const selected = { uuid: "policy-1" };
      const state = dispatch({ ...initial(), policy: selected }, "POLICY_POLICIES_REQ");

      expect(state.policy).toBe(selected);
    });

    it("drops the policies of the previous family when a family overview is requested", () => {
      const loaded = {
        ...initial(),
        fetchingPolicies: true,
        fetchedPolicies: true,
        policies: [{ uuid: "policy-1" }],
        policy: { uuid: "policy-1" },
        errorPolicies: SERVER_ERROR,
      };
      const state = dispatch(loaded, "INSUREE_FAMILY_OVERVIEW_REQ");

      expect(state).toMatchObject({
        fetchingPolicies: false,
        fetchedPolicies: false,
        policies: null,
        policy: null,
        errorPolicies: null,
      });
    });
  });

  describe("eligibility", () => {
    const ELIGIBILITY = [
      ["insuree", "POLICY_INSUREE_ELIGIBILITY", "policyEligibilityByInsuree", "InsureeEligibility"],
      ["item", "POLICY_INSUREE_ITEM_ELIGIBILITY", "policyItemEligibilityByInsuree", "InsureeItemEligibility"],
      [
        "service",
        "POLICY_INSUREE_SERVICE_ELIGIBILITY",
        "policyServiceEligibilityByInsuree",
        "InsureeServiceEligibility",
      ],
    ];
    const field = (suffix) => suffix.charAt(0).toLowerCase() + suffix.slice(1);

    it.each(ELIGIBILITY)("drops the previous %s answer when a new check starts", (_label, prefix, _entity, suffix) => {
      const stale = { ...initial(), [field(suffix)]: { stale: true }, [`error${suffix}`]: SERVER_ERROR };
      const state = dispatch(stale, `${prefix}_REQ`);

      expect(state[`fetching${suffix}`]).toBe(true);
      expect(state[`fetched${suffix}`]).toBe(false);
      expect(state[field(suffix)]).toBeNull();
      expect(state[`error${suffix}`]).toBeNull();
    });

    it.each(ELIGIBILITY)("stores the %s answer as returned", (_label, prefix, entity, suffix) => {
      const answer = { isItemOk: true, itemLeft: 3 };
      const state = respond(dispatch(initial(), `${prefix}_REQ`), `${prefix}_RESP`, { [entity]: answer });

      expect(state[`fetching${suffix}`]).toBe(false);
      expect(state[`fetched${suffix}`]).toBe(true);
      expect(state[field(suffix)]).toEqual(answer);
      expect(state[`error${suffix}`]).toBeNull();
    });

    it.each(ELIGIBILITY)("surfaces a data error from the %s check", (_label, prefix, entity, suffix) => {
      const state = respond(initial(), `${prefix}_RESP`, { [entity]: null }, graphqlErrors("bad filter"));

      expect(state[`error${suffix}`]).toEqual(DATA_ERROR);
    });

    it.each(ELIGIBILITY)("stops the %s check and formats a transport failure", (_label, prefix, _entity, suffix) => {
      const state = fail(dispatch(initial(), `${prefix}_REQ`), `${prefix}_ERR`);

      expect(state[`fetching${suffix}`]).toBe(false);
      expect(state[`error${suffix}`]).toEqual(SERVER_ERROR);
    });

    it.each(ELIGIBILITY.slice(1))("clears the %s answer entirely", (_label, prefix, entity, suffix) => {
      const answered = respond(initial(), `${prefix}_RESP`, { [entity]: { ok: true } }, graphqlErrors("bad filter"));
      const state = dispatch(answered, `${prefix}_CLEAR`);

      expect(state[`fetching${suffix}`]).toBe(false);
      expect(state[`fetched${suffix}`]).toBe(false);
      expect(state[field(suffix)]).toBeNull();
      expect(state[`error${suffix}`]).toBeNull();
    });
  });

  describe("single policy", () => {
    const fullPolicy = (overrides = {}) => ({
      uuid: "policy-1",
      value: "100.50",
      sumPremiums: "40.25",
      claimDedRems: {
        edges: [
          { node: { dedG: 10.1, dedIp: 0, dedOp: 5, remG: 1, remIp: 2, remOp: 3 } },
          { node: { dedG: 0.2, dedIp: 7, dedOp: null, remG: 1, remIp: 0, remOp: 0 } },
        ],
      },
      ...overrides,
    });

    it("clears the previous policy while loading one", () => {
      const state = dispatch({ ...initial(), policy: { uuid: "old" }, errorPolicy: SERVER_ERROR }, "POLICY_POLICY_REQ");

      expect(state.fetchingPolicy).toBe(true);
      expect(state.fetchedPolicy).toBe(false);
      expect(state.policy).toBeNull();
      expect(state.errorPolicy).toBeNull();
    });

    it("computes the balance and the deductible and remuneration totals of the loaded policy", () => {
      const state = respond(initial(), "POLICY_POLICY_RESP", { policies: relayPage([fullPolicy()]) });

      expect(state.fetchingPolicy).toBe(false);
      expect(state.fetchedPolicy).toBe(true);
      expect(state.errorPolicy).toBeNull();
      expect(state.policy).toMatchObject({
        uuid: "policy-1",
        balance: 60.25,
        sumClaimDedG: 10.3,
        sumClaimDedIp: 7,
        sumClaimDedOp: 5,
        sumClaimRemG: 2,
        sumClaimRemIp: 2,
        sumClaimRemOp: 3,
      });
    });

    it("keeps only the first policy when history rows come back with it", () => {
      const state = respond(initial(), "POLICY_POLICY_RESP", {
        policies: relayPage([fullPolicy(), fullPolicy({ uuid: "history-1" })]),
      });

      expect(state.policy.uuid).toBe("policy-1");
    });

    // Currently fails: the reducer takes the first row and sets `balance` on it without checking
    // there is one, so a data error (no rows) throws inside the reducer instead of being shown.
    it.fails("surfaces a data error when loading a policy instead of throwing", () => {
      const state = respond(initial(), "POLICY_POLICY_RESP", { policies: null }, graphqlErrors("bad filter"));

      expect(state.errorPolicy).toEqual(DATA_ERROR);
      expect(state.fetchingPolicy).toBe(false);
    });

    // Currently fails: an empty result (unknown or deleted uuid) throws the same way.
    it.fails("reports a policy that does not exist instead of throwing", () => {
      const state = respond(initial(), "POLICY_POLICY_RESP", { policies: relayPage([]) });

      expect(state.fetchedPolicy).toBe(true);
      expect(state.policy).toBeFalsy();
    });

    it("stops loading and formats a transport failure", () => {
      const state = fail(dispatch(initial(), "POLICY_POLICY_REQ"), "POLICY_POLICY_ERR");

      expect(state.fetchingPolicy).toBe(false);
      expect(state.errorPolicy).toEqual(SERVER_ERROR);
    });
  });

  describe("policy values", () => {
    it("drops the previous values while they are recomputed", () => {
      const state = dispatch(
        { ...initial(), policyValues: { policy: {} }, errorPolicyValues: SERVER_ERROR },
        "POLICY_FETCH_POLICY_VALUES_REQ",
      );

      expect(state.fetchingPolicyValues).toBe(true);
      expect(state.fetchedPolicyValues).toBe(false);
      expect(state.policyValues).toBeNull();
      expect(state.errorPolicyValues).toBeNull();
    });

    it("stores the computed dates, value and warnings", () => {
      const values = { policy: { startDate: "2024-02-01", expiryDate: "2025-01-31", value: 120 }, warnings: [] };
      const state = respond(dispatch(initial(), "POLICY_FETCH_POLICY_VALUES_REQ"), "POLICY_FETCH_POLICY_VALUES_RESP", {
        policyValues: values,
      });

      expect(state.fetchingPolicyValues).toBe(false);
      expect(state.fetchedPolicyValues).toBe(true);
      expect(state.policyValues).toEqual(values);
    });

    // Currently fails: the response case never reads `errors`, so a failed calculation leaves
    // the value empty with no message.
    it.fails("surfaces a data error from the value calculation", () => {
      const state = respond(initial(), "POLICY_FETCH_POLICY_VALUES_RESP", { policyValues: null }, graphqlErrors("bad filter"));

      expect(state.errorPolicyValues).toEqual(DATA_ERROR);
    });

    it("stops computing and formats a transport failure", () => {
      const state = fail(dispatch(initial(), "POLICY_FETCH_POLICY_VALUES_REQ"), "POLICY_FETCH_POLICY_VALUES_ERR");

      expect(state.fetchingPolicyValues).toBe(false);
      expect(state.errorPolicyValues).toEqual(SERVER_ERROR);
    });
  });

  describe("mutations", () => {
    const submitting = () =>
      dispatch(initial(), "POLICY_MUTATION_REQ", {
        meta: { clientMutationId: "client-1", clientMutationLabel: "Save policy" },
      });

    it("marks a mutation as in flight and remembers its client id", () => {
      const state = submitting();

      expect(state.submittingMutation).toBe(true);
      expect(state.mutation).toMatchObject({ id: "client-1", clientMutationLabel: "Save policy" });
    });

    it.each([
      ["POLICY_CREATE_POLICY_RESP", "createPolicy"],
      ["POLICY_UPDATE_POLICY_RESP", "updatePolicy"],
      ["POLICY_RENEW_POLICY_RESP", "renewPolicy"],
      ["POLICY_SUSPEND_POLICIES_RESP", "suspendPolicies"],
      ["POLICY_DELETE_POLICIES_RESP", "deletePolicies"],
    ])("finishes %s and keeps the internal id from %s", (actionType, service) => {
      const state = respond(submitting(), actionType, { [service]: { internalId: "internal-1" } });

      expect(state.submittingMutation).toBe(false);
      expect(state.mutation.id).toBe("internal-1");
    });

    it("raises an alert when a mutation fails", () => {
      const state = fail(submitting(), "POLICY_MUTATION_ERR", { status: 500 });

      expect(JSON.parse(state.alert)).toEqual({ status: 500 });
    });

    // Currently fails: dispatchMutationErr in fe-core only stores the alert, so the
    // module is left believing the mutation is still being submitted.
    it.fails("stops submitting once a mutation has failed", () => {
      expect(fail(submitting(), "POLICY_MUTATION_ERR", { status: 500 }).submittingMutation).toBe(false);
    });
  });
});
