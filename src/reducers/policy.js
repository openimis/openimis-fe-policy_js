import { formatServerError, formatGraphQLError } from '@openimis/fe-core';

export const insureeEnquiry = (
    state = {
        fetchingPolicies: false,
        errorPolicies: null,
        policies: null,
        fetchingEligibility: false,
        errorEligibility: null,
        insureeEligibility: null,
    },
    action) => {
    switch (action.type) {
        case 'POLICY_INSUREE_POLICIES_REQ':
            return {
                ...state,
                fetchingPolicies: true,
                insureePolicies: null,
                errorPolicies: null,
            };
        case 'POLICY_INSUREE_POLICIES_RESP':
            return {
                ...state,
                fetchingPolicies: false,
                insureePolicies: action.payload.data.policiesByInsuree.items,
                errorPolicies: formatGraphQLError(action.payload)
            };
        case 'POLICY_INSUREE_POLICIES_ERR':
            return {
                ...state,
                fetchingPolicies: false,
                errorPolicies: formatServerError(action.payload),
            };
        case 'POLICY_INSUREE_ELIGIBILITY_REQ':
            return {
                ...state,
                fetchingEligibility: true,
                insureeEligibility: null,
                errorEligibility: null,
            };
        case 'POLICY_INSUREE_ELIGIBILITY_RESP':
            return {
                ...state,
                fetchingEligibility: false,
                insureeEligibility: action.payload.data.policyEligibilityByInsuree,
                errorEligibility: formatGraphQLError(action.payload),
            };
        case 'POLICY_INSUREE_ELIGIBILITY_ERR':
            return {
                ...state,
                fetchingEligibility: false,
                errorEligibility: formatServerError(action.payload),
            };
        default:
            return state;
    }
};
