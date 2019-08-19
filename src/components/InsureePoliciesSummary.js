import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { injectIntl, FormattedDate } from 'react-intl';
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Grid, Paper, IconButton } from "@material-ui/core";
import CachedIcon from "@material-ui/icons/Cached";
import { ProgressOrError, ResultTable } from "@openimis/fe-core";
import { fetchPolicies } from "../actions";



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

    render() {
        const { classes, insuree, fetchingPolicies, insureePolicies, errorPolicies } = this.props;
        return (
            <Fragment>
                <ProgressOrError progress={fetchingPolicies} error={errorPolicies} />
                {!fetchingPolicies && !!insuree && !!insureePolicies && (
                    <Grid container>
                        <Grid item xs={12}>
                            <Paper className={classes.paper}>
                                <ResultTable
                                    module="policy"
                                    header="insureePolicies.header"
                                    headers={[
                                        "insureePolicies.productCode",
                                        "insureePolicies.productName",
                                        "insureePolicies.expiryDate",
                                        "insureePolicies.status",
                                        "insureePolicies.hospitalDeduction",
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
                                        i => i.ceiling1 - (i.ded1 || 0),
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
        withStyles(styles)(InsureePoliciesSummary)
    ))
);
