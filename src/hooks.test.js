import { describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";

const core = vi.hoisted(() => ({ useGraphqlQuery: vi.fn() }));

vi.mock("@openimis/fe-core", () => core);

const { useContributionPlanQuery } = await import("./hooks");
const { relayPage } = await import("@openimis/fe-core/testing");

const answer = (data) => core.useGraphqlQuery.mockReturnValue({ isLoading: false, error: null, data, refetch: vi.fn() });

describe("useContributionPlanQuery", () => {
  it("sends the picker's filters and config with the query", () => {
    answer(undefined);
    renderHook(() => useContributionPlanQuery({ filters: { first: 15 } }, { skip: true }));

    const [text, variables, config] = core.useGraphqlQuery.mock.calls[0];
    expect(text.replace(/\s+/g, " ")).toContain("contributionPlan( first: $first");
    expect(variables).toEqual({ first: 15 });
    expect(config).toEqual({ skip: true });
  });

  it("unwraps the plans and counts the page", () => {
    answer({
      contributionPlan: relayPage([{ id: "plan-1" }, { id: "plan-2" }], { totalCount: 9, pageInfo: { hasNextPage: true } }),
    });
    const { result } = renderHook(() => useContributionPlanQuery({ filters: {} }));

    expect(result.current.data.contributionPlan).toEqual([{ id: "plan-1" }, { id: "plan-2" }]);
    expect(result.current.data.pageInfo).toMatchObject({ totalCount: 9, hasNextPage: true });
  });

  it("gives an empty list before anything has loaded", () => {
    answer(undefined);
    const { result } = renderHook(() => useContributionPlanQuery({ filters: {} }));

    expect(result.current.data).toEqual({ contributionPlan: [], pageInfo: {} });
  });
});
