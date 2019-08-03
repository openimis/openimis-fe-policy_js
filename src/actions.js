import { graphql } from "@openimis/fe-core";

export function fetchPolicies(chfid) {
  // let payload = `
  //   {
  //     policiesByInsuree(chfId:"${chfid}", familyId:${familyid})
  //     {
  //       items{policyId, policyValue, premiumsAmount, balance, productCode, productName, expiryDate, status, dedType, ded1, ded2, ceiling1, ceiling2}
  //     }
  //   }
  // `
  let payload = `
    {
      policiesByInsuree(chfId:"${chfid}")
      {
        items{productCode, productName, expiryDate, status, dedType, ded1, ded2, ceiling1, ceiling2}
      }
    }
  `
  return graphql(payload, 'POLICY_INSUREE_POLICIES');
}

export function fetchPolicyBalance(familyId, productCode) {
  let payload = `
    {
      policyBalance(familyId:${familyId}, productCode:"${productCode}")
      {
        familyId, productCode, policyValue, premiumsAmount, balance
      }
    }
  `
  return graphql(payload, 'POLICY_BALANCE', { familyId: familyId, productCode: productCode });
}

export function fetchEligibility(chfid) {
  let payload = `
    {
      policyEligibilityByInsuree(chfId:"${chfid}")
      {
        prodId,
        totalAdmissionsLeft, totalVisitsLeft, totalConsultationsLeft, totalSurgeriesLeft, totalDeliveriesLeft, totalAntenatalLeft,
        consultationAmountLeft, surgeryAmountLeft, deliveryAmountLeft, hospitalizationAmountLeft, antenatalAmountLeft
      }
    }
  `
  return graphql(payload, 'POLICY_INSUREE_ELIGIBILITY');
}

export function fetchItemEligibility(chfid, itemCode) {
  let payload = `
    {
      policyItemEligibilityByInsuree(chfId:"${chfid}", itemCode:"${itemCode}")
      {
        minDateItem, itemLeft, isItemOk
      }
    }
  `
  return graphql(payload, 'POLICY_INSUREE_ITEM_ELIGIBILITY');
}

export function fetchServiceEligibility(chfid, serviceCode) {
  let payload = `
    {
      policyServiceEligibilityByInsuree(chfId:"${chfid}", serviceCode:"${serviceCode}")
      {
        minDateService,serviceLeft, isServiceOk
      }
    }
  `
  return graphql(payload, 'POLICY_INSUREE_SERVICE_ELIGIBILITY');
}