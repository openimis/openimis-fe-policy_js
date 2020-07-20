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
import { fetchFamilyOrInsureePolicies, selectPolicy } from "../actions";

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
        if (this.props.family || this.props.insuree) {
            this.query()
        }
    }

    insureeChanged = (prevProps) =>
        (!prevProps.insuree && !!this.props.insuree)
        || (!!prevProps.insuree && !this.props.insuree)
        || !!prevProps.insuree && !!this.props.insuree && !!this.props.insuree.chfId && (
            prevProps.insuree.chfId == null
            || prevProps.insuree.chfId !== this.props.insuree.chfId
        )
    familyChanged = (prevProps) => !prevProps.family && !!this.props.family
        || !!prevProps.family && !!this.props.family && !!this.props.family.uuid && (
            prevProps.family.uuid == null
            || prevProps.family.uuid !== this.props.family.uuid
        )

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.insureeChanged(prevProps) || this.familyChanged(prevProps)) {
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

    onChangeSelection = (i) => {
        this.props.selectPolicy(i[0] || null)
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

    header = () => {
        const { intl, pageInfo } = this.props;
        if (!!this.props.insuree && !!this.props.insuree.chfId) {
            return formatMessageWithValues(
                intl, "policy", "policiesOfInsuree.header",
                { count: pageInfo.totalCount, chfId: this.props.insuree.chfId }
            )
        } else {
            return formatMessageWithValues(
                intl, "policy", "policies.header",
                { count: pageInfo.totalCount }
            )
        }
    }

    itemIdentifier = (i) => i.policyUuid

    render() {
        const { classes, fetchingPolicies, policies, pageInfo, errorPolicies } = this.props;
        return (
            <Paper className={classes.paper}>
                <Table
                    module="policy"
                    header={this.header()}
                    headers={this.headers}
                    itemFormatters={this.itemFormatters}
                    itemIdentifier={this.itemIdentifier}
                    items={policies}
                    fetching={fetchingPolicies}
                    error={errorPolicies}
                    withSelection={"single"}
                    onChangeSelection={this.onChangeSelection}
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
    family: state.insuree.family,
    insuree: state.insuree.insuree,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetch: fetchFamilyOrInsureePolicies, selectPolicy }, dispatch);
};

export default withModulesManager(connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(withTheme(
        withStyles(styles)(FamilyOrInsureePoliciesSummary)
    )))
);
