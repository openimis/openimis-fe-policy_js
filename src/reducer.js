import { formatServerError, formatGraphQLError } from '@openimis/fe-core';

export const insureeEnquiry = (
    state = {
        fetchingPolicies: false,
        fetchedPolicies: false,
        errorPolicies: null,
        policies: null,
        fetchingEligibility: false,
        fetchedEligibility: false,
        errorEligibility: null,
        insureeEligibility: null,
        fetchingItemEligibility: false,
        fetchedItemEligibility: false,
        errorItemEligibility: null,
        insureeItemEligibility: null,
        fetchingItemEligibility: false,
        fetchedServiceEligibility: false,
        errorItemEligibility: null,
        insureeItemEligibility: null,
        fetchingPolicyBalance: {},
        fetchedPolicyBalance: {},
        insureePolicyBalance: {},
        errorPolicyBalance: {},
        policyBalanceCount: 0,
    },
    action) => {
    switch (action.type) {
        case 'POLICY_INSUREE_POLICIES_REQ':
            return {
                ...state,
                fetchingPolicies: true,
                fetchedPolicies: false,
                insureePolicies: null,
                errorPolicies: null,
            };
        case 'POLICY_INSUREE_POLICIES_RESP':
            return {
                ...state,
                fetchingPolicies: false,
                fetchedPolicies: true,
                insureePolicies: action.payload.data.policiesByInsuree.items,
                errorPolicies: formatGraphQLError(action.payload)
            };
        case 'POLICY_INSUREE_POLICIES_ERR':
            return {
                ...state,
                fetchingPolicies: false,
                errorPolicies: formatServerError(action.payload),
            };
        case 'POLICY_BALANCE_REQ':
            var fetching = state.fetchingPolicyBalance;
            fetching[action.meta.familyId + "|" + action.meta.productCode] = true;
            var fetched = state.fetchedPolicyBalance;
            delete (fetched[action.meta.familyId + "|" + action.meta.productCode]);
            var balance = state.fetchedPolicyBalance;
            delete (balance[action.meta.familyId + "|" + action.meta.productCode]);
            var error = state.errorPolicyBalance;
            delete (error[action.meta.familyId + "|" + action.meta.productCode]);
            return {
                ...state,
                fetchingPolicyBalance: fetching,
                fetchedPolicyBalance: fetched,
                insureePolicyBalance: balance,
                errorPolicyBalance: error,
            };
        case 'POLICY_BALANCE_RESP':
            var fetching = state.fetchingPolicyBalance;
            delete (fetching[action.meta.familyId + "|" + action.meta.productCode]);
            var fetched = state.fetchedPolicyBalance;
            fetched[action.meta.familyId + "|" + action.meta.productCode] = true;
            var balance = state.fetchedPolicyBalance;
            balance[action.meta.familyId + "|" + action.meta.productCode] = action.payload.data.policyBalance.balance;
            var error = state.errorPolicyBalance;
            error[action.meta.familyId + "|" + action.meta.productCode] = formatGraphQLError(action.payload);
            return {
                ...state,
                fetchingPolicyBalance: fetching,
                fetchedPolicyBalance: fetched,
                insureePolicyBalance: balance,
                errorPolicyBalance: error,
                policyBalanceCount: state.policyBalanceCount + 1,
            };
        case 'POLICY_BALANCE_ERR':
            var fetching = state.fetchingPolicyBalance;
            delete (fetching[action.meta.familyId + "|" + action.meta.productCode]);
            var error = state.errorPolicyBalance;
            error[action.meta.familyId + "|" + action.meta.productCode] = formatServerError(action.payload);
            return {
                ...state,
                fetchingPolicyBalance: fetching,
                errorPolicyBalance: error,
                policyBalanceCount: state.policyBalanceCount + 1,
            };
        case 'POLICY_INSUREE_ELIGIBILITY_REQ':
            return {
                ...state,
                fetchingEligibility: true,
                fetchedEligibility: false,
                insureeEligibility: null,
                errorEligibility: null,
            };
        case 'POLICY_INSUREE_ELIGIBILITY_RESP':
            return {
                ...state,
                fetchingEligibility: false,
                fetchedEligibility: true,
                insureeEligibility: action.payload.data.policyEligibilityByInsuree,
                errorEligibility: formatGraphQLError(action.payload),
            };
        case 'POLICY_INSUREE_ELIGIBILITY_ERR':
            return {
                ...state,
                fetchingEligibility: false,
                errorEligibility: formatServerError(action.payload),
            };
        case 'POLICY_INSUREE_ITEM_ELIGIBILITY_REQ':
            return {
                ...state,
                fetchingItemEligibility: true,
                fetchedItemEligibility: false,
                insureeItemEligibility: null,
                errorItemEligibility: null,
            };
        case 'POLICY_INSUREE_ITEM_ELIGIBILITY_RESP':
            return {
                ...state,
                fetchingItemEligibility: false,
                fetchedItemEligibility: true,
                insureeItemEligibility: action.payload.data.policyItemEligibilityByInsuree,
                errorItemEligibility: formatGraphQLError(action.payload),
            };
        case 'POLICY_INSUREE_ITEM_ELIGIBILITY_ERR':
            return {
                ...state,
                fetchingItemEligibility: false,
                errorItemEligibility: formatServerError(action.payload),
            };
        case 'POLICY_INSUREE_SERVICE_ELIGIBILITY_REQ':
            return {
                ...state,
                fetchingServiceEligibility: true,
                fetchedServiceEligibility: false,
                insureeServiceEligibility: null,
                errorServiceEligibility: null,
            };
        case 'POLICY_INSUREE_SERVICE_ELIGIBILITY_RESP':
            return {
                ...state,
                fetchingServiceEligibility: false,
                fetchedServiceEligibility: true,
                insureeServiceEligibility: action.payload.data.policyServiceEligibilityByInsuree,
                errorServiceEligibility: formatGraphQLError(action.payload),
            };
        case 'POLICY_INSUREE_SERVICE_ELIGIBILITY_ERR':
            return {
                ...state,
                fetchingServiceEligibility: false,
                errorServiceEligibility: formatServerError(action.payload),
            };
        default:
            return state;
    }
};
