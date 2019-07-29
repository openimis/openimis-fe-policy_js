import React from "react";
import { ListAlt, MonetizationOn } from "@material-ui/icons";
import { PoliciesPage } from "./components/PoliciesPage";
import { ContributionsPage } from "./components/ContributionsPage";
import InsureeEnquiryDialog from "./components/InsureeEnquiryDialog";
import messages_en from "./translations/en.json";
import { FormattedMessage } from "@openimis/fe-core";
import { insureeEnquiry } from "./reducer";

const DEFAULT_CONFIG = {
  "translations": [{key: 'en', messages: messages_en}],
  "reducers" : [{key: 'policyInsuree', reducer: insureeEnquiry}],  
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
  "insuree.EnquiryDialog": [ InsureeEnquiryDialog ],
}

export const PolicyModule = (cfg) => {
  return{ ...DEFAULT_CONFIG, ...(cfg && cfg['fe-policy'] || {})}; 
}
