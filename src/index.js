import React from "react";
import { ListAlt } from "@material-ui/icons";
import { PoliciesPage } from "./pages/PoliciesPage";
import FamilyOrInsureePoliciesSummary from "./components/FamilyOrInsureePoliciesSummary";
import InsureeEligibilitySummary from "./components/InsureeEligibilitySummary";
import InsureeEligibilityEnquiry from "./components/InsureeEligibilityEnquiry";
import InsureePolicyEligibilitySummary from "./components/InsureePolicyEligibilitySummary";
import messages_en from "./translations/en.json";
import { FormattedMessage } from "@openimis/fe-core";
import { reducer } from "./reducer";
import { RIGHT_POLICY } from "./constants";

const ROUTE_POLICY_POLICIES = "policy/policies";

const DEFAULT_CONFIG = {
  "translations": [{ key: 'en', messages: messages_en }],
  "reducers": [{ key: 'policy', reducer }],
  "refs": [
    { key: "policy.FamilyOrInsureePoliciesSummary", ref: FamilyOrInsureePoliciesSummary },
    { key: "policy.InsureeEligibilitySummary", ref: InsureeEligibilitySummary },
    { key: "policy.InsureeEligibilityEnquiry", ref: InsureeEligibilityEnquiry },
    { key: "policy.InsureePolicyEligibilitySummary", ref: InsureePolicyEligibilitySummary },
  ],
  "core.Router": [
    { path: ROUTE_POLICY_POLICIES, component: PoliciesPage },
  ],
  "insuree.MainMenu": [
    {
      text: <FormattedMessage module="policy" id="menu.policies" />,
      icon: <ListAlt />,
      route: "/" + ROUTE_POLICY_POLICIES,
      filter: rights => rights.includes(RIGHT_POLICY)
    },
  ],
  "insuree.EnquiryDialog": [FamilyOrInsureePoliciesSummary, InsureeEligibilityEnquiry, InsureeEligibilitySummary],
  "insuree.FamilyOverview.panels": [FamilyOrInsureePoliciesSummary],
}

export const PolicyModule = (cfg) => {
  return { ...DEFAULT_CONFIG, ...cfg };
}
