import React from "react";
import { ListAlt, MonetizationOn } from "@material-ui/icons";
import { PoliciesPage } from "./components/PoliciesPage";
import { ContributionsPage } from "./components/ContributionsPage";
import InsureePoliciesSummary from "./components/InsureePoliciesSummary";
import InsureeEligibilitySummary from "./components/InsureeEligibilitySummary";
import InsureeEligibilityEnquiry from "./components/InsureeEligibilityEnquiry";
import messages_en from "./translations/en.json";
import { FormattedMessage } from "@openimis/fe-core";
import { reducer } from "./reducer";

const DEFAULT_CONFIG = {
  "translations": [{key: 'en', messages: messages_en}],
  "reducers" : [{key: 'policy', reducer}],  
  "refs": [
    {key: "policy.InsureePoliciesSummary", ref: InsureePoliciesSummary },
    {key: "policy.InsureeEligibilitySummary", ref: InsureeEligibilitySummary },
    {key: "policy.InsureeEligibilityEnquiry", ref: InsureeEligibilityEnquiry },
  ],    
  "core.Router": [
    { path: "policy/policies", component: PoliciesPage },
    { path: "policy/contributions", component: ContributionsPage },
  ],
  "insuree.MainMenu": [
    {
      text: <FormattedMessage module="policy" id="menu.policies"/>,
      icon: <ListAlt />,
      route: "/policy/policies"
    },
    {
      text: <FormattedMessage module="policy" id="menu.contributions"/>,
      icon: <MonetizationOn />,
      route: "/policy/contributions"
    }    
  ],
  "insuree.EnquiryDialog": [ InsureePoliciesSummary, InsureeEligibilityEnquiry, InsureeEligibilitySummary ],
}

export const PolicyModule = (cfg) => {
  return{ ...DEFAULT_CONFIG, ...cfg }; 
}
