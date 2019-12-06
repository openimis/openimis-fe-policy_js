import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { injectIntl } from 'react-intl';
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import { ProgressOrError, PublishedComponent, FormattedMessage, AmountInput } from "@openimis/fe-core";
import { fetchPolicies } from "../actions";

import { ACTIVE_POLICY_STATUS } from "../constants";

const styles = theme => ({
    item: theme.paper.item,
});

class InsureePolicyEligibilitySummary extends Component {

    componentDidMount() {
        if (this.props.insuree) {
            this.props.fetchPolicies(this.props.insuree.chfId);
        }
    }

    render() {
        const { classes, fetchingPolicies, fetchedPolicies, errorPolicies } = this.props;
        var activePolicy = !!this.props.insureePolicies && this.props.insureePolicies.filter(p => p.status === ACTIVE_POLICY_STATUS).pop();
        return (
            <Fragment>
                <ProgressOrError progress={fetchingPolicies} error={errorPolicies} />
                {!!fetchedPolicies && !activePolicy &&
                    <Grid item className={classes.item}>
                        <FormattedMessage module="policy" id="insureePolicies.noActivePolicy" />
                    </Grid>
                }
                {!!fetchedPolicies && !!activePolicy && (
                    <Grid item>
                        <Grid container>
                            <Grid item xs={6} className={classes.item}>
                                <PublishedComponent id="core.DatePicker"
                                    value={activePolicy.expiryDate}
                                    module="policy"
                                    label="insureePolicies.expiryDate"
                                    readOnly={true}
                                />
                            </Grid>
                            <Grid item xs={6} className={classes.item}>
                                <AmountInput
                                    value={(activePolicy.ceiling || 0) - (activePolicy.ded || 0)}
                                    module="claim"
                                    label="balance"
                                    readOnly={true}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                )}
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    insuree: state.claim.claim.insuree,
    fetchingPolicies: state.policy.fetchingInsureePolicies,
    fetchedPolicies: state.policy.fetchedInsureePolicies,
    insureePolicies: state.policy.insureePolicies,
    errorPolicies: state.policy.errorInsureePolicies,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchPolicies }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(withTheme(
        withStyles(styles)(InsureePolicyEligibilitySummary)
    ))
);
