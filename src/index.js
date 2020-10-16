import React from "react";
import { ListAlt } from "@material-ui/icons";
import PolicyOfficerPicker from "./pickers/PolicyOfficerPicker";
import PolicyStagePicker from "./pickers/PolicyStagePicker";
import PolicyStatusPicker from "./pickers/PolicyStatusPicker";
import PoliciesPage from "./pages/PoliciesPage";
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
    { key: "policy.PolicyOfficerPicker", ref: PolicyOfficerPicker },
    { key: "policy.PolicyOfficerPicker.projection", ref: ["id", "uuid", "code", "lastName", "otherNames"] },
    { key: "policy.PolicyStatusPicker", ref: PolicyStatusPicker },
    { key: "policy.PolicyStatusPicker.projection", ref: null },
    { key: "policy.PolicyStagePicker", ref: PolicyStagePicker },
    { key: "policy.PolicyStagePicker.projection", ref: null },
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
