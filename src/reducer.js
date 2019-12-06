import { formatServerError, formatGraphQLError } from '@openimis/fe-core';

export const reducer = (
    state = {
        fetchingInsureePolicies: false,
        fetchedInsureePolicies: false,
        errorInsureePolicies: null,
        insureePolicies: null,
        fetchingInsureeEligibility: false,
        fetchedInsureeEligibility: false,
        errorInsureeEligibility: null,
        insureeEligibility: null,
        fetchingItemEligibility: false,
        fetchedInsureeItemEligibility: false,
        errorInsureeItemEligibility: null,
        insureeItemEligibility: null,
        fetchingInsureeItemEligibility: false,
        fetchedInsureeServiceEligibility: false,
        errorInsureeServiceEligibility: null,
        insureeInsureeServiceEligibility: null,
    },
    action) => {
    switch (action.type) {
        case 'POLICY_INSUREE_POLICIES_REQ':
            return {
                ...state,
                fetchingInsureePolicies: true,
                fetchedInsureePolicies: false,
                insureePolicies: null,
                errorInsureePolicies: null,
            };
        case 'POLICY_INSUREE_POLICIES_RESP':
            return {
                ...state,
                fetchingInsureePolicies: false,
                fetchedInsureePolicies: true,
                insureePolicies: action.payload.data.policiesByInsuree.items,
                errorInsureePolicies: formatGraphQLError(action.payload)
            };
        case 'POLICY_INSUREE_POLICIES_ERR':
            return {
                ...state,
                fetchingInsureePolicies: false,
                errorInsureePolicies: formatServerError(action.payload),
            };
        case 'POLICY_INSUREE_ELIGIBILITY_REQ':
            return {
                ...state,
                fetchingInsureeEligibility: true,
                fetchedInsureeEligibility: false,
                insureeEligibility: null,
                errorInsureeEligibility: null,
            };
        case 'POLICY_INSUREE_ELIGIBILITY_RESP':
            return {
                ...state,
                fetchingInsureeEligibility: false,
                fetchedInsureeEligibility: true,
                insureeEligibility: action.payload.data.policyEligibilityByInsuree,
                errorInsureeEligibility: formatGraphQLError(action.payload),
            };
        case 'POLICY_INSUREE_ELIGIBILITY_ERR':
            return {
                ...state,
                fetchingInsureeEligibility: false,
                errorInsureeEligibility: formatServerError(action.payload),
            };
        case 'POLICY_INSUREE_ITEM_ELIGIBILITY_REQ':
            return {
                ...state,
                fetchingInsureeItemEligibility: true,
                fetchedInsureeItemEligibility: false,
                insureeItemEligibility: null,
                errorInsureeItemEligibility: null,
            };
        case 'POLICY_INSUREE_ITEM_ELIGIBILITY_RESP':
            return {
                ...state,
                fetchingInsureeItemEligibility: false,
                fetchedInsureeItemEligibility: true,
                insureeItemEligibility: action.payload.data.policyItemEligibilityByInsuree,
                errorInsureeItemEligibility: formatGraphQLError(action.payload),
            };
        case 'POLICY_INSUREE_ITEM_ELIGIBILITY_ERR':
            return {
                ...state,
                fetchingInsureeItemEligibility: false,
                errorInsureeItemEligibility: formatServerError(action.payload),
            };
        case 'POLICY_INSUREE_SERVICE_ELIGIBILITY_REQ':
            return {
                ...state,
                fetchingInsureeServiceEligibility: true,
                fetchedInsureeServiceEligibility: false,
                insureeServiceEligibility: null,
                errorInsureeServiceEligibility: null,
            };
        case 'POLICY_INSUREE_SERVICE_ELIGIBILITY_RESP':
            return {
                ...state,
                fetchingInsureeServiceEligibility: false,
                fetchedInsureeServiceEligibility: true,
                insureeServiceEligibility: action.payload.data.policyServiceEligibilityByInsuree,
                errorInsureeServiceEligibility: formatGraphQLError(action.payload),
            };
        case 'POLICY_INSUREE_SERVICE_ELIGIBILITY_ERR':
            return {
                ...state,
                fetchingInsureeServiceEligibility: false,
                errorInsureeServiceEligibility: formatServerError(action.payload),
            };
        default:
            return state;
    }
};
