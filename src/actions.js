import { graphql, formatQuery, formatPageQuery, formatPageQueryWithCount } from "@openimis/fe-core";
import { decodeId } from "@openimis/fe-core";

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

export function fetchPolicyOfficers(mm) {
  const payload = formatPageQuery("policyOfficers",
    null,
    mm.getRef("policy.PolicyOfficerPicker.projection")
  );
  return graphql(payload, 'POLICY_POLICY_OFFICERS');
}

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

export function selectPolicy(policy) {
  return dispatch => {
    dispatch({ type: 'POLICY_POLICY', payload: policy })
  }
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

export function fetchPolicySummaries(mm, filters) {
  let projections = ["uuid",
    `product{${mm.getRef("product.ProductPicker.projection")}}`,
    `officer{${mm.getRef("policy.PolicyOfficerPicker.projection")}}`,
    `family{${mm.getRef("insuree.FamilyPicker.projection")}}`,
    "enrollDate", "effectiveDate", "startDate", "expiryDate",
    "stage", "status",
    "value", "sumPremiums",
    "validityFrom", "validityTo"]
  const payload = formatPageQueryWithCount("policies",
    filters,
    projections
  );
  return graphql(payload, 'POLICY_POLICIES');
}

export function fetchPolicyFull(mm, policy_uuid) {
  let projections = ["uuid",
    `product{${mm.getRef("product.ProductPicker.projection")}}`,
    `officer{${mm.getRef("policy.PolicyOfficerPicker.projection")}}`,
    `family{${mm.getRef("insuree.FamilyPicker.projection")}}`,
    "enrollDate", "effectiveDate", "startDate", "expiryDate",
    "stage", "status",
    "value", "sumPremiums",
    "claimDedRems{edges { node {dedG dedIp dedOp remG remIp remOp} } }",
    "validityFrom", "validityTo"]
  const payload = formatPageQuery("policies",
    [`uuid: "${policy_uuid}"`],
    projections
  );
  return graphql(payload, 'POLICY_POLICY');
}

export function applyProduct(policy) {
  let params = [
    `stage: "N"`,
    `enrollDate: "${policy.enrollDate}T00:00:00"`, 
    `productId: ${decodeId(policy.product.id)}`,
    `familyId: ${decodeId(policy.family.id)}`
  ]
  let projections = ["startDate", "expiryDate", "value"]
  const payload = formatQuery("policyValues",
    params,
    projections
  );
  return graphql(payload, 'POLICY_APPLY_PRODUCT');
}