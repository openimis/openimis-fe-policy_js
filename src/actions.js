import { graphql, formatPageQueryWithCount } from "@openimis/fe-core";

const POLICY_BY_FAMILY_OR_INSUREE_PROJECTION = [
  "policyUuid",
  "productCode", "productName",
  "officerCode", "officerName",
  "enrollDate", "effectiveDate", "startDate", "expiryDate",
  "status",
  "policyValue", "balance",
  "ded", "dedInPatient", "dedOutPatient",
  "ceiling", "ceilingInPatient", "ceilingOutPatient"
]

export function fetchFamilyOrInsureePolicies(mm, filters) {  
  let qry = "policiesByFamily";
  let RDX = 'POLICY_FAMILY_POLICIES';
  if (filters.filter(f => f.startsWith("chfId")).length !== 0) {
    qry = "policiesByInsuree";
    RDX = 'POLICY_INSUREE_POLICIES'
  }
  let payload = formatPageQueryWithCount(qry,
    filters,
    POLICY_BY_FAMILY_OR_INSUREE_PROJECTION
  );
  return graphql(payload, RDX);
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