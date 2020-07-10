import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { injectIntl } from 'react-intl';
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import { Table, formatMessage, formatDateFromISO, withModulesManager } from "@openimis/fe-core";
import { fetchFamilyPolicies, fetchInsureePolicies } from "../actions";



const styles = theme => ({
    paper: theme.paper.paper,
    paperHeader: theme.paper.header,
    paperHeaderAction: theme.paper.action,
    fab: theme.fab,
    button: {
        margin: theme.spacing(1),
    },
});


class FamilyOrInsureePoliciesSummary extends Component {

    componentDidMount() {
        if (!!this.props.insuree && !!this.props.insuree.chfId) {
            this.props.fetchInsureePolicies(this.props.insuree.chfId);
        } else if (!!this.props.family && !!this.props.family.uuid) {
            this.props.fetchFamilyPolicies(this.props.family.uuid);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!prevProps.insuree && !!this.props.insuree
            || !!prevProps.insuree && !!this.props.insuree && !!this.props.insuree.chfId && (
                prevProps.insuree.chfId == null
                || prevProps.insuree.chfId !== this.props.insuree.chfId
            )) {
            this.props.fetchInsureePolicies(this.props.insuree.chfId);
        } else if (!prevProps.family && !!this.props.family
            || !!prevProps.family && !!this.props.family  && !!this.props.family.uuid && (
                prevProps.family.uuid == null
                || prevProps.family.uuid !== this.props.family.uuid
            )) {
            this.props.fetchFamilyPolicies(this.props.family.uuid);
        }
    }

    render() {
        const { intl, classes, fetchingPolicies, policies, errorPolicies } = this.props;
        return (
            <Paper className={classes.paper}>
                <Table
                    module="policy"
                    header={formatMessage(intl, "policy", "policies.header")}
                    headers={[
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
                    ]}
                    itemFormatters={[
                        i => i.productCode,
                        i => i.productName,
                        i => formatDateFromISO(this.props.modulesManager, this.props.intl, i.expiryDate),
                        i => formatMessage(intl, "policy", `policies.status.${i.status}`),
                        i => i.ded,
                        i => i.dedInPatient,
                        i => i.dedOutPatient,
                        i => i.ceiling,
                        i => i.ceilingInPatient,
                        i => i.ceilingOutPatient,
                        i => i.balance,
                    ]}
                    items={policies}
                    fetching={fetchingPolicies}
                    error={errorPolicies}
                />
            </Paper>
        )
    }
}


const mapStateToProps = state => ({
    fetchingPolicies: state.policy.fetchingPolicies,
    fetchedPolicies: state.policy.fetchedPolicies,
    policies: state.policy.policies,
    errorPolicies: state.policy.errorPolicies,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchFamilyPolicies, fetchInsureePolicies }, dispatch);
};

export default withModulesManager(connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(withTheme(
        withStyles(styles)(FamilyOrInsureePoliciesSummary)
    )))
);
