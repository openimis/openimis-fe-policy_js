# openIMIS Frontend Policy reference module
This repository holds the files of the openIMIS Frontend Policy reference module.
It is dedicated to be deployed as a module of [openimis-fe_js](https://github.com/openimis/openimis-fe_js).

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

## Main Menu Contributions
None

## Other Contributions
* `core.Router`: registering `policy/policies` and `policy/contributions` routes in openIMIS client-side router
* `insuree.MainMenu`:

   **Policies** (`menu.policies` translation key), pointing to `/FindPolicy.aspx` legacy openIMIS (via proxy page)
   
   **Contributions** (`menu.contributions` translation key), pointing to `//FindPremium.aspx` legacy openIMIS (via proxy page)
* `insuree.EnquiryDialog`: `[InsureePoliciesSummary, InsureeEligibilityEnquiry, InsureeEligibilitySummary]`, adding the (family) policies details, ability to query eligibility on an item and service and remaining counts and amounts to enquiry dialog (of insuree module)

## Available Contribution Points
None

## Published Components
* `policy.InsureePoliciesSummary`, insuree (family) policies summary (by default contributed to insuree enquiry dialog)
* `policy.InsureeEligibilitySummary`, querying insuree eligibility to an item and service (by default contributed to insuree enquiry dialog)
* `policy.InsureeEligibilityEnquiry`, remaining counts and amounts of insuree (by default contributed to insuree enquiry dialog)
* `policy.InsureePolicyEligibilitySummary`, summary (expiry date and balance) of the last still valid insuree policy

## Dispatched Redux Actions
* `POLICY_INSUREE_POLICIES_{REQ|RESP|ERR}`, loading insuree policies summary (GraphQL: `policiesByInsuree`)
* `POLICY_INSUREE_ITEM_ELIGIBILITY_{REQ|RESP|ERR}`, query insuree eligibility for an item (GraphQL: `policyItemEligibilityByInsuree`)
* `POLICY_INSUREE_SERVICE_ELIGIBILITY_{REQ|RESP|ERR}`, query insuree eligibility for a service (GraphQL: 
`policyServiceEligibilityByInsuree`)
* `POLICY_INSUREE_ELIGIBILITY_{REQ|RESP|ERR}`, insuree eligibility summary (GraphQL: `policyEligibilityByInsuree`)

## Other Modules Listened Redux Actions
None

## Other Modules Redux State Bindings
* `state.core.user`, to access user info (rights,...)
* `state.insuree`, loading insuree policies (,eligibility,...)

## Configurations Options
None