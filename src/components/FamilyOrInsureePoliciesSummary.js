import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { injectIntl } from 'react-intl';
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import {
    Table, PagedDataHandler,
    formatMessage, formatMessageWithValues,
    formatDateFromISO, withModulesManager
} from "@openimis/fe-core";
import { fetchFamilyOrInsureePolicies } from "../actions";

const styles = theme => ({
    paper: theme.paper.paper,
    paperHeader: theme.paper.header,
    paperHeaderAction: theme.paper.action,
    fab: theme.fab,
    button: {
        margin: theme.spacing(1),
    },
});

class FamilyOrInsureePoliciesSummary extends PagedDataHandler {

    constructor(props) {
        super(props);
        this.rowsPerPageOptions = props.modulesManager.getConf("fe-policy", "familyOrInsureePoliciesSummary.rowsPerPageOptions", [5, 10, 20]);
        this.defaultPageSize = props.modulesManager.getConf("fe-policy", "familyOrInsureePoliciesSummary.defaultPageSize", 5);
    }

    componentDidMount() {
        this.onChangeRowsPerPage(this.defaultPageSize);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!prevProps.insuree && !!this.props.insuree
            || !!prevProps.insuree && !!this.props.insuree && !!this.props.insuree.chfId && (
                prevProps.insuree.chfId == null
                || prevProps.insuree.chfId !== this.props.insuree.chfId
            )) {
            this.query()
        } else if (!prevProps.family && !!this.props.family
            || !!prevProps.family && !!this.props.family && !!this.props.family.uuid && (
                prevProps.family.uuid == null
                || prevProps.family.uuid !== this.props.family.uuid
            )) {
            this.query();
        }
    }

    queryPrms() {
        if (!!this.props.insuree && !!this.props.insuree.chfId) {
            return [`chfId:"${this.props.insuree.chfId}"`];
        } else if (!!this.props.family && !!this.props.family.uuid) {
            return [`familyUuid:"${this.props.family.uuid}"`];
        }
    }

    headers = [
        "policies.productCode",
        "policies.productName",
        "policies.expiryDate",
        "policies.status",
        "policies.deduction",
        "policies.hospitalDeduction",
        "policies.nonHospitalDeduction",
        "policies.ceiling",
        "policies.hospitalCeiling",
        "policies.nonHospitalCeiling",
        "policies.balance"
    ]

    itemFormatters = [
        i => i.productCode,
        i => i.productName,
        i => formatDateFromISO(this.props.modulesManager, this.props.intl, i.expiryDate),
        i => formatMessage(this.props.intl, "policy", `policies.status.${i.status}`),
        i => i.ded,
        i => i.dedInPatient,
        i => i.dedOutPatient,
        i => i.ceiling,
        i => i.ceilingInPatient,
        i => i.ceilingOutPatient,
        i => i.balance,
    ]

    render() {
        const { intl, classes, fetchingPolicies, policies, pageInfo, errorPolicies } = this.props;
        return (
            <Paper className={classes.paper}>
                <Table
                    module="policy"
                    header={formatMessageWithValues(intl, "policy", "policies.header", { count: pageInfo.totalCount })}
                    headers={this.headers}
                    itemFormatters={this.itemFormatters}
                    items={policies}
                    fetching={fetchingPolicies}
                    error={errorPolicies}
                    withPagination={true}
                    rowsPerPageOptions={this.rowsPerPageOptions}
                    defaultPageSize={this.defaultPageSize}
                    page={this.state.page}
                    pageSize={this.state.pageSize}
                    count={pageInfo.totalCount}
                    onChangePage={this.onChangePage}
                    onChangeRowsPerPage={this.onChangeRowsPerPage}
                />
            </Paper>
        )
    }
}


const mapStateToProps = state => ({
    fetchingPolicies: state.policy.fetchingPolicies,
    fetchedPolicies: state.policy.fetchedPolicies,
    policies: state.policy.policies,
    pageInfo: state.policy.policiesPageInfo,
    errorPolicies: state.policy.errorPolicies,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetch: fetchFamilyOrInsureePolicies }, dispatch);
};

export default withModulesManager(connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(withTheme(
        withStyles(styles)(FamilyOrInsureePoliciesSummary)
    )))
);
