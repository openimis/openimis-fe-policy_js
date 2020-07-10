import React from "react";
import { ListAlt, MonetizationOn } from "@material-ui/icons";
import { PoliciesPage } from "./components/PoliciesPage";
import { ContributionsPage } from "./components/ContributionsPage";
import FamilyOrInsureePoliciesSummary from "./components/FamilyOrInsureePoliciesSummary";
import InsureeEligibilitySummary from "./components/InsureeEligibilitySummary";
import InsureeEligibilityEnquiry from "./components/InsureeEligibilityEnquiry";
import InsureePolicyEligibilitySummary from "./components/InsureePolicyEligibilitySummary";
import messages_en from "./translations/en.json";
import { FormattedMessage } from "@openimis/fe-core";
import { reducer } from "./reducer";
import {
  RIGHT_POLICY,
  RIGHT_CONTRIBUTION,
} from "./constants";

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
    { path: "policy/policies", component: PoliciesPage },
    { path: "policy/contributions", component: ContributionsPage },
  ],
  "insuree.MainMenu": [
    {
      text: <FormattedMessage module="policy" id="menu.policies" />,
      icon: <ListAlt />,
      route: "/policy/policies",
      filter: rights => rights.includes(RIGHT_POLICY)
    },
    {
      text: <FormattedMessage module="policy" id="menu.contributions" />,
      icon: <MonetizationOn />,
      route: "/policy/contributions",
      filter: rights => rights.includes(RIGHT_CONTRIBUTION)
    }
  ],
  "insuree.EnquiryDialog": [FamilyOrInsureePoliciesSummary, InsureeEligibilityEnquiry, InsureeEligibilitySummary],
  "insuree.FamilyOverview.panels": [FamilyOrInsureePoliciesSummary],
}

export const PolicyModule = (cfg) => {
  return { ...DEFAULT_CONFIG, ...cfg };
}
