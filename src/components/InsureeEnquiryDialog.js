import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { injectIntl } from 'react-intl';
import { fetchInsureePolicies, fetchEligibility } from "../actions";
import FamilyOrInsureePoliciesSummary from "./FamilyOrInsureePoliciesSummary";
import InsureeEligibilitySummary from "./InsureeEligibilitySummary";
import { ProgressOrError } from "@openimis/fe-core";
import { Grid } from "@material-ui/core";
import InsureeServiceEligibility from "./InsureeServiceEligibility";
import InsureeItemEligibility from "./InsureeItemEligibility";

class InsureeEnquiryDialog extends Component {

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!prevProps.insuree && !!this.props.insuree
            || !!prevProps.insuree && this.props.insuree && (
                prevProps.insuree.chfId == null
                || prevProps.insuree.chfId !== this.props.insuree.chfId
            )
        ) {
            this.props.fetchInsureePolicies(this.props.insuree.chfId);
            this.props.fetchEligibility(this.props.insuree.chfId);
        }
    }
    render() {
        const { insuree,
            fetchingPolicies, policies, errorPolicies,
            fetchingEligibility, insureeEligibility, errorEligibility,
        } = this.props;
        return (
            <Fragment>
                <ProgressOrError progress={fetchingPolicies} error={errorPolicies} />
                {!fetchingPolicies && !!insuree && !!policies && (
                    <FamilyOrInsureePoliciesSummary policies={policies} />
                )}
                {!!insuree && (<Grid container>
                    <Grid item xs={6}><InsureeServiceEligibility /></Grid>
                    <Grid item xs={6}><InsureeItemEligibility /></Grid>
                </Grid>
                )}
                <ProgressOrError progress={fetchingEligibility} error={errorEligibility} />
                {!fetchingEligibility && !!insuree && !!insureeEligibility && (
                    <InsureeEligibilitySummary eligibility={insureeEligibility} />
                )}
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    insuree: state.insuree.insuree,
    fetchingPolicies: state.policy.fetchingPolicies,
    fetchedPolicies: state.policy.fetchedPolicies,
    policies: state.policy.policies,
    errorPolicies: state.policy.errorPolicies,
    fetchingEligibility: state.policy.fetchingInsureeEligibility,
    fetchedEligibility: state.policy.fetchedInsureeEligibility,
    insureeEligibility: state.policy.insureeInsureeEligibility,
    errorEligibility: state.policy.errorInsureeEligibility,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchInsureePolicies, fetchEligibility }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl((InsureeEnquiryDialog)));
