import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { injectIntl } from 'react-intl';
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import { ProgressOrError, PublishedComponent, FormattedMessage, AmountInput, TextInput } from "@openimis/fe-core";
import { fetchPolicies } from "../actions";

import { ACTIVE_POLICY_STATUS } from "../constants";

const styles = theme => ({
    item: theme.paper.item,
});

class InsureePolicyEligibilitySummary extends Component {

    state = {
        insureePolicies: []
    }

    componentDidMount() {
        if (this.props.insuree) {
            this.props.fetchPolicies(this.props.insuree.chfId);
        } else {
            this.setState({ insureePolicies: [] })
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!!prevProps.insuree && !this.props.insuree) {
            this.setState({ insureePolicies: [] })
            return;
        }
        if ((!prevProps.insuree && !!this.props.insuree) ||
            !!prevProps.insuree && !!this.props.insuree &&
            (
                prevProps.insuree.chfId == null
                || prevProps.insuree.chfId !== this.props.insuree.chfId
            )
        ) {
            this.setState(
                { insureePolicies: [] },
                e => {
                    this.props.fetchPolicies(this.props.insuree.chfId)
                }
            )
            return;
        }
        if (!prevProps.fetchedPolicies && this.props.fetchedPolicies) {
            this.setState({ insureePolicies: this.props.insureePolicies })
        }
    }

    render() {
        const { classes, fetchingPolicies, fetchedPolicies, errorPolicies } = this.props;
        const { insureePolicies } = this.state;
        var activePolicy = !!insureePolicies && insureePolicies.filter(p => p.status === ACTIVE_POLICY_STATUS).pop();
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
                            <Grid item xs={2} className={classes.item}>
                                <TextInput
                                    value={activePolicy.productCode}
                                    module="policy"
                                    label="policy.insureePolicies.productCode"
                                    readOnly={true}
                                />
                            </Grid>
                            <Grid item xs={4} className={classes.item}>
                                <TextInput
                                    value={activePolicy.productName}
                                    module="policy"
                                    label="policy.insureePolicies.productName"
                                    readOnly={true}
                                />
                            </Grid>
                            <Grid item xs={3} className={classes.item}>
                                <PublishedComponent id="core.DatePicker"
                                    value={activePolicy.expiryDate}
                                    module="policy"
                                    label="insureePolicies.expiryDate"
                                    readOnly={true}
                                />
                            </Grid>
                            <Grid item xs={3} className={classes.item}>
                                <AmountInput
                                    value={0}
                                    module="claim"
                                    label="balance"
                                    readOnly={true}
                                    displayZero={true}
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
