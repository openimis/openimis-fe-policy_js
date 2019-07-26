import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import { bindActionCreators } from "redux";
import { policies, eligibility } from "../actions/policy";
import { withTheme, withStyles } from "@material-ui/core/styles";
import InsureePoliciesSummary from "./InsureePoliciesSummary";
import InsureeEligibilitySummary from "./InsureeEligibilitySummary";
import { CircularProgress } from "@material-ui/core";
import { Error } from "@openimis/fe-core";

const styles = theme => ({});

class InsureeEnquiryDialog extends Component {
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!prevProps.insuree && !!this.props.insuree
            || !!prevProps.insuree && this.props.insuree && (
                prevProps.insuree.chfId == null
                || prevProps.insuree.chfId !== this.props.insuree.chfId
            )
        ) {
            this.props.policies(this.props.insuree.chfId);
            this.props.eligibility(this.props.insuree.chfId);
        }
    }
    render() {
        const { classes,
            insuree,
            fetchingPolicies, insureePolicies, errorPolicies, errorMessagePolicies, errorDetailPolicies,
            fetchingEligibility, insureeEligibility, errorEligibility, errorMessageEligibility, errorDetailEligibility
        } = this.props;
        return (
            <Fragment>
                {!!fetchingPolicies && (<CircularProgress className={classes.progress} />)}
                {!fetchingPolicies && !!errorPolicies && (<Error error={errorPolicies} />)}
                {!fetchingPolicies && !!insuree && !!insureePolicies && (
                    <InsureePoliciesSummary policies={insureePolicies} />
                )}
                {!!fetchingEligibility && (<CircularProgress className={classes.progress} />)}
                {!fetchingEligibility && !!errorEligibility && (<Error error={errorEligibility} />)}
                {!fetchingEligibility && !!insuree && !!insureeEligibility && (
                    <InsureeEligibilitySummary eligibility={insureeEligibility} />
                )}
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    insuree: state.insuree.insuree,
    fetchingPolicies: state.policyInsureeEnquiry.fetchingPolicies,
    insureePolicies: state.policyInsureeEnquiry.insureePolicies,
    errorPolicies: state.policyInsureeEnquiry.errorPolicies,
    fetchingEligibility: state.policyInsureeEnquiry.fetchingEligibility,
    insureeEligibility: state.policyInsureeEnquiry.insureeEligibility,
    errorEligibility: state.policyInsureeEnquiry.errorEligibility,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ policies, eligibility }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(withTheme(
        withStyles(styles)(InsureeEnquiryDialog)
    ))
);
