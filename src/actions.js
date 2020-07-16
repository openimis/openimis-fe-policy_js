import { graphql } from "@openimis/fe-core";

const POLICY_BY_FAMILY_OR_INSUREE_PROJECTION = "items{policyUuid, productCode, productName, officerCode, officerName, enrollDate, effectiveDate, startDate, expiryDate, status, policyValue, ded, dedInPatient, dedOutPatient, ceiling, ceilingInPatient, ceilingOutPatient, balance}"

export function fetchInsureePolicies(chfid) {
  let payload = `
    {
      policiesByInsuree(chfId:"${chfid}")
      {
        ${POLICY_BY_FAMILY_OR_INSUREE_PROJECTION}
      }
    }
  `
  return graphql(payload, 'POLICY_INSUREE_POLICIES');
}

export function fetchFamilyPolicies(familyUuid) {
    let payload = `  
    {
      policiesByFamily(familyUuid:"${familyUuid}")
      {
        ${POLICY_BY_FAMILY_OR_INSUREE_PROJECTION}
      }
    }
  `
  return graphql(payload, 'POLICY_FAMILY_POLICIES');
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

export function fetchItemEligibility(chfid, code) {
  let payload = `
    {
      policyItemEligibilityByInsuree(chfId:"${chfid}", itemCode:"${code}")
      {
        minDateItem, itemLeft, isItemOk
      }
    }
  `
  return graphql(payload, 'POLICY_INSUREE_ITEM_ELIGIBILITY');
}

export function fetchServiceEligibility(chfid, code) {
  let payload = `
    {
      policyServiceEligibilityByInsuree(chfId:"${chfid}", serviceCode:"${code}")
      {
        minDateService,serviceLeft, isServiceOk
      }
    }
  `
  return graphql(payload, 'POLICY_INSUREE_SERVICE_ELIGIBILITY');
}