import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { injectIntl, FormattedDate } from 'react-intl';
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Grid, Paper } from "@material-ui/core";
import { ProgressOrError, SmallTable } from "@openimis/fe-core";
import { fetchPolicies } from "../actions";


const styles = theme => ({
    paper: {
        margin: 0,
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    }
});

class InsureePoliciesSummary extends Component {

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!prevProps.insuree && !!this.props.insuree
            || !!prevProps.insuree && this.props.insuree && (
                prevProps.insuree.chfId == null
                || prevProps.insuree.chfId !== this.props.insuree.chfId
            )
        ) {
            this.props.fetchPolicies(this.props.insuree.chfId);
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
                                        "insureePolicies.nonHospitalCeiling"
                                    ]}
                                    itemFormatters={[
                                        i => i.productCode,
                                        i => i.productName,
                                        i => <FormattedDate value={i.expiryDate} />,
                                        i => i.status,
                                        i => i.ded1,
                                        i => i.ded2,
                                        i => i.ceiling1,
                                        i => i.ceiling2
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
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchPolicies }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(withTheme(
        withStyles(styles)(InsureePoliciesSummary)
    ))
);
