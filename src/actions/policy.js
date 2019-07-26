import { RSAA } from "redux-api-middleware";
import { baseApiUrl, apiHeaders } from "@openimis/fe-core";

export function policies(chfid) {
  let payload = `
    {
      policiesByInsuree(chfId:"${chfid}")
      {
        items{productCode, productName, expiryDate, status, dedType, ded1, ded2, ceiling1, ceiling2}
      }
    }
  `
  return {
    [RSAA]: {
      endpoint: `${baseApiUrl}/graphql`,
      method: "POST",
      headers: apiHeaders(),
      body: JSON.stringify({ "query": payload }),
      types: [
        'POLICY_INSUREE_POLICIES_REQ',
        'POLICY_INSUREE_POLICIES_RESP',
        'POLICY_INSUREE_POLICIES_ERR'
      ],
    },
  };
}

export function eligibility(chfid, service_code, item_code) {
  let payload = `
    {
      policyEligibilityByInsuree(chfId:"${chfid}")
      {
        prodId,
        totalAdmissionsLeft, totalVisitsLeft, totalConsultationsLeft, totalSurgeriesLeft, totalDeliveriesLeft, totalAntenatalLeft,
        consultationAmountLeft, surgeryAmountLeft, deliveryAmountLeft, hospitalizationAmountLeft, antenatalAmountLeft,
        minDateService, minDateItem, serviceLeft, itemLeft, isItemOk, isServiceOk
      }
    }
  `
  return {
    [RSAA]: {
      endpoint: `${baseApiUrl}/graphql`,
      method: "POST",
      headers: apiHeaders(),
      body: JSON.stringify({ "query": payload }),
      types: [
        'POLICY_INSUREE_ELIGIBILITY_REQ',
        'POLICY_INSUREE_ELIGIBILITY_RESP',
        'POLICY_INSUREE_ELIGIBILITY_ERR'
      ],
    },
  };
}