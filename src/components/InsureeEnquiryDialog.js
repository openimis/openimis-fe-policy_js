import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { injectIntl } from 'react-intl';
import { fetchPolicies, fetchEligibility } from "../actions";
import { withTheme, withStyles } from "@material-ui/core/styles";
import InsureePoliciesSummary from "./InsureePoliciesSummary";
import InsureeEligibilitySummary from "./InsureeEligibilitySummary";
import { ProgressOrError } from "@openimis/fe-core";
import { Grid } from "@material-ui/core";
import InsureeServiceEligibility from "./InsureeServiceEligibility";
import InsureeItemEligibility from "./InsureeItemEligibility";

const styles = theme => ({});

class InsureeEnquiryDialog extends Component {

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!prevProps.insuree && !!this.props.insuree
            || !!prevProps.insuree && this.props.insuree && (
                prevProps.insuree.chfId == null
                || prevProps.insuree.chfId !== this.props.insuree.chfId
            )
        ) {
            this.props.fetchPolicies(this.props.insuree.chfId);
            this.props.fetchEligibility(this.props.insuree.chfId);
        }
    }
    render() {
        const { classes,
            insuree,
            fetchingPolicies, insureePolicies, errorPolicies,
            fetchingEligibility, insureeEligibility, errorEligibility,
        } = this.props;
        return (
            <Fragment>
                <ProgressOrError progress={fetchingPolicies} error={errorPolicies} />
                {!fetchingPolicies && !!insuree && !!insureePolicies && (
                    <InsureePoliciesSummary policies={insureePolicies} />
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
    fetchingPolicies: state.policyInsuree.fetchingPolicies,
    fetchedPolicies: state.policyInsuree.fetchedPolicies,
    insureePolicies: state.policyInsuree.insureePolicies,
    errorPolicies: state.policyInsuree.errorPolicies,
    fetchingEligibility: state.policyInsuree.fetchingEligibility,
    fetchedEligibility: state.policyInsuree.fetchedEligibility,
    insureeEligibility: state.policyInsuree.insureeEligibility,
    errorEligibility: state.policyInsuree.errorEligibility,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchPolicies, fetchEligibility }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(withTheme(
        withStyles(styles)(InsureeEnquiryDialog)
    ))
);
