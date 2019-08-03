import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { injectIntl, FormattedDate } from 'react-intl';
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Grid, Paper, IconButton } from "@material-ui/core";
import CachedIcon from "@material-ui/icons/Cached";
import { ProgressOrError, SmallTable } from "@openimis/fe-core";
import { fetchPolicies, fetchPolicyBalance } from "../actions";



const styles = theme => ({
    paper: {
        margin: 0,
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    button: {
        margin: theme.spacing(1),
    },
});


class InsureePoliciesSummary extends Component {

    componentDidUpdate(prevProps, prevState, snapshot) {
        if ((!prevProps.insuree && !!this.props.insuree
            || !!prevProps.insuree && this.props.insuree && (
                prevProps.insuree.chfId == null
                || prevProps.insuree.chfId !== this.props.insuree.chfId
            )
        ) && (!!this.props.insuree.family && !!this.props.insuree.family.id)
        ) {
            this.props.fetchPolicies(this.props.insuree.chfId, this.props.insuree.family.id);
        }
    }


    balance = (familyId, productCode) => (
        <Fragment>
            <ProgressOrError
                progress={!!this.props.fetchingPolicyBalance &&
                    this.props.fetchingPolicyBalance[familyId + "|" + productCode]}
                error={!!this.props.errorPolicyBalance &&
                    this.props.errorPolicyBalance[familyId + "|" + productCode]}
            />
            {(!this.props.fetchingPolicyBalance ||
                !this.props.fetchingPolicyBalance[familyId + "|" + productCode]) &&
                (!this.props.fetchedPolicyBalance || !this.props.fetchedPolicyBalance[familyId + "|" + productCode]) &&
                (
                    <IconButton className={this.props.classes.button}
                        onClick={e => this.props.fetchPolicyBalance(familyId, productCode)}>
                        <CachedIcon />
                    </IconButton>
                )}
            {!!this.props.fetchedPolicyBalance &&
                !!this.props.fetchedPolicyBalance[familyId + "|" + productCode] &&
                this.props.insureePolicyBalance[familyId + "|" + productCode]}
        </Fragment>
    )

    render() {
        const { classes, insuree, fetchingPolicies, insureePolicies, errorPolicies } = this.props;
        return (
            <Fragment>
                <ProgressOrError progress={fetchingPolicies} error={errorPolicies} />
                {!fetchingPolicies && !!insuree && !!insureePolicies && (
                    <Grid container>
                        <Grid item xs={12}>
                            <Paper className={classes.paper}>
                                <SmallTable
                                    module="policy"
                                    header="insureePolicies.header"
                                    headers={[
                                        "insureePolicies.productCode",
                                        "insureePolicies.productName",
                                        "insureePolicies.expiryDate",
                                        "insureePolicies.status",
                                        "insureePolicies.hostpitalDeduction",
                                        "insureePolicies.nonHospitalDeduction",
                                        "insureePolicies.hospitalCeiling",
                                        "insureePolicies.nonHospitalCeiling",
                                        "insureePolicies.balance"
                                    ]}
                                    itemFormatters={[
                                        i => i.productCode,
                                        i => i.productName,
                                        i => <FormattedDate value={i.expiryDate} />,
                                        i => i.status,
                                        i => i.ded1,
                                        i => i.ded2,
                                        i => i.ceiling1,
                                        i => i.ceiling2,
                                        i => this.balance(insuree.family.id, i.productCode)
                                    ]}
                                    items={insureePolicies} />
                            </Paper>
                        </Grid>
                    </Grid >
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
    fetchingPolicyBalance: state.policyInsuree.fetchingPolicyBalance,
    fetchedPolicyBalance: state.policyInsuree.fetchedPolicyBalance,
    insureePolicyBalance: state.policyInsuree.insureePolicyBalance,
    errorPolicyBalance: state.policyInsuree.errorPolicyBalance,
    policyBalanceCount: state.policyInsuree.policyBalanceCount,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchPolicies, fetchPolicyBalance }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(withTheme(
        withStyles(styles)(InsureePoliciesSummary)
    ))
);
