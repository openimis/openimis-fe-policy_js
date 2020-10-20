import React, { Component, Fragment } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import { IconButton, Tooltip } from "@material-ui/core";
import {
    Search as SearchIcon, People as PeopleIcon, Tab as TabIcon, Delete as DeleteIcon
} from '@material-ui/icons';
import {
    withModulesManager, formatMessageWithValues, formatDateFromISO, formatMessage,
    withHistory, historyPush,
    Searcher, PublishedComponent, AmountInput,
} from "@openimis/fe-core";
import { fetchPolicySummaries } from "../actions";
import { policyBalance } from "../utils/utils";

import PolicyFilter from "./PolicyFilter";

const POLICY_SEARCHER_CONTRIBUTION_KEY = "policy.PolicySearcher";

class PolicySearcher extends Component {

    constructor(props) {
        super(props);
        this.rowsPerPageOptions = props.modulesManager.getConf("fe-policy", "policyFilter.rowsPerPageOptions", [10, 20, 50, 100]);
        this.defaultPageSize = props.modulesManager.getConf("fe-policy", "policyFilter.defaultPageSize", 10);
        this.locationLevels = this.props.modulesManager.getConf("fe-location", "location.Location.MaxLevels", 4);
    }

    fetch = (prms) => {
        this.props.fetchPolicySummaries(
            this.props.modulesManager,
            prms
        )
    }

    rowIdentifier = (r) => r.uuid

    filtersToQueryParams = (state) => {
        let prms = Object.keys(state.filters)
            .filter(f => !!state.filters[f]['filter'])
            .map(f => state.filters[f]['filter']);
        prms.push(`first: ${state.pageSize}`);
        if (!!state.afterCursor) {
            prms.push(`after: "${state.afterCursor}"`)
        }
        if (!!state.beforeCursor) {
            prms.push(`before: "${state.beforeCursor}"`)
        }
        if (!!state.orderBy) {
            prms.push(`orderBy: ["${state.orderBy}"]`);
        }
        return prms;
    }

    headers = (filters) => {
        var h = [
            "policy.policySummaries.enrollDate",
            "policy.policySummaries.name",
            "policy.policySummaries.effectiveDate",
            "policy.policySummaries.startDate",
            "policy.policySummaries.expiryDate",
            "policy.policySummaries.product",
            "policy.policySummaries.officer",
            "policy.policySummaries.stage",
            "policy.policySummaries.status",
            "policy.policySummaries.value",
            "policy.policySummaries.balance",
            "policy.policySummaries.validityFrom",
            "policy.policySummaries.validityTo",
            "policy.policySummaries.openFamily",
            "policy.policySummaries.openNewTab",
        ];
        return h;
    }

    sorts = (filters) => {
        var results = [
            ['enrollDate', false],
            [this.props.modulesManager.getRef("insuree.FamilyPicker.sort"), true],
            ['effectiveDate', false],
            ['startDate', false],
            ['expiryDate', false],
            [this.props.modulesManager.getRef("product.ProductPicker.sort"), true],
            [this.props.modulesManager.getRef("policy.PolicyOfficerPicker.sort"), true],
            ['stage', true],
            ['status', true],
            ['value', false],
            null,
            ['validityFrom', false],
            ['validityTo', false],
        ];
        return results;
    }

    itemFormatters = (filters) => {
        var formatters = [
            policy => formatDateFromISO(this.props.modulesManager, this.props.intl, policy.enrollDate),
            policy => <PublishedComponent pubRef="insuree.FamilyPicker" value={policy.family} readOnly={true} withLabel={false} />,
            policy => formatDateFromISO(this.props.modulesManager, this.props.intl, policy.effectiveDate),
            policy => formatDateFromISO(this.props.modulesManager, this.props.intl, policy.startDate),
            policy => formatDateFromISO(this.props.modulesManager, this.props.intl, policy.expiryDate),
            policy => <PublishedComponent pubRef="product.ProductPicker" value={policy.product} readOnly={true} withLabel={false} />,
            policy => <PublishedComponent pubRef="policy.PolicyOfficerPicker" value={policy.officer} readOnly={true} withLabel={false} />,
            policy => <PublishedComponent pubRef="policy.PolicyStagePicker" value={policy.stage} readOnly={true} withLabel={false} />,
            policy => <PublishedComponent pubRef="policy.PolicyStatusPicker" value={policy.status} readOnly={true} withLabel={false} />,
            policy => <AmountInput value={policy.value} readOnly={true} />,
            policy => <AmountInput value={policyBalance(policy)} readOnly={true} />,
            policy => formatDateFromISO(
                this.props.modulesManager,
                this.props.intl,
                policy.validityFrom),
            policy => formatDateFromISO(
                this.props.modulesManager,
                this.props.intl,
                policy.validityTo),
            policy => {
                if (!policy.family) return null
                return (
                    <Tooltip title={formatMessage(this.props.intl, "policy", "policySummaries.openFamilyButton.tooltip")}>
                        <IconButton onClick={e => !policy.clientMutationId && historyPush(this.props.modulesManager, this.props.history, "insuree.route.familyOverview", [policy.family.uuid])}><PeopleIcon /></IconButton >
                    </Tooltip>
                )
            },
            policy => (
                <Tooltip title={formatMessage(this.props.intl, "policy", "policySummaries.openNewTabButton.tooltip")}>
                    <IconButton onClick={e => !policy.clientMutationId && this.props.onDoubleClick(policy, true)}><TabIcon /></IconButton >
                </Tooltip>
            )
        ];
        return formatters;
    }

    rowDisabled = (selection, i) => !!i.validityTo
    rowLocked = (selection, i) => !!i.clientMutationId

    render() {
        const { intl,
            policies, policiesPageInfo, fetchingPolicies, fetchedPolicies, errorPolicies,
            filterPaneContributionsKey, cacheFiltersKey, onDoubleClick
        } = this.props;

        let count = policiesPageInfo.totalCount;

        return (
            <Fragment>
                <Searcher
                    module="policy"
                    cacheFiltersKey={cacheFiltersKey}
                    FilterPane={PolicyFilter}
                    filterPaneContributionsKey={filterPaneContributionsKey}
                    items={policies}
                    itemsPageInfo={policiesPageInfo}
                    fetchingItems={fetchingPolicies}
                    fetchedItems={fetchedPolicies}
                    errorItems={errorPolicies}
                    contributionKey={POLICY_SEARCHER_CONTRIBUTION_KEY}
                    tableTitle={formatMessageWithValues(intl, "policy", "policySummaries", { count })}
                    rowsPerPageOptions={this.rowsPerPageOptions}
                    defaultPageSize={this.defaultPageSize}
                    defaultOrderBy="-enrollDate"
                    fetch={this.fetch}
                    rowIdentifier={this.rowIdentifier}
                    filtersToQueryParams={this.filtersToQueryParams}
                    headers={this.headers}
                    itemFormatters={this.itemFormatters}
                    sorts={this.sorts}
                    rowDisabled={this.rowDisabled}
                    rowLocked={this.rowLocked}
                    onDoubleClick={(i) => !i.clientMutationId && onDoubleClick(i)}
                />
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
    policies: state.policy.policies,
    policiesPageInfo: state.policy.policiesPageInfo,
    fetchingPolicies: state.policy.fetchingPolicies,
    fetchedPolicies: state.policy.fetchedPolicies,
    errorPolicies: state.policy.errorPolicies,
});


const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        { fetchPolicySummaries },
        dispatch);
};

export default withModulesManager(withHistory(connect(mapStateToProps, mapDispatchToProps)(injectIntl(PolicySearcher))));