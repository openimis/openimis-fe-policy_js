import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { injectIntl, FormattedDate } from 'react-intl';
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Grid, Paper } from "@material-ui/core";
import { ProgressOrError, Table, formatMessage } from "@openimis/fe-core";
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

    componentDidMount() {
        if (!!this.props.insuree) {
            this.props.fetchPolicies(this.props.insuree.chfId, this.props.insuree.family.id);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if ((!prevProps.insuree && !!this.props.insuree
            || !!prevProps.insuree && !!this.props.insuree && (
                prevProps.insuree.chfId == null
                || prevProps.insuree.chfId !== this.props.insuree.chfId
            )
        ) && (!!this.props.insuree.family && !!this.props.insuree.family.id)
        ) {
            this.props.fetchPolicies(this.props.insuree.chfId, this.props.insuree.family.id);
        }
    }

    render() {
        const { intl, classes, insuree, fetchingPolicies, insureePolicies, errorPolicies } = this.props;
        return (
            <Fragment>
                <ProgressOrError progress={fetchingPolicies} error={errorPolicies} />
                {!fetchingPolicies && !!insuree && !!insureePolicies && (
                    <Grid container>
                        <Grid item xs={12}>
                            <Paper className={classes.paper}>
                                <Table
                                    module="policy"
                                    header={formatMessage(intl, "policy","insureePolicies.header")}
                                    headers={[
                                        "insureePolicies.productCode",
                                        "insureePolicies.productName",
                                        "insureePolicies.expiryDate",
                                        "insureePolicies.status",
                                        "insureePolicies.deduction",
                                        "insureePolicies.hospitalDeduction",
                                        "insureePolicies.nonHospitalDeduction",
                                        "insureePolicies.ceiling",
                                        "insureePolicies.hospitalCeiling",
                                        "insureePolicies.nonHospitalCeiling",
                                        "insureePolicies.balance"
                                    ]}
                                    itemFormatters={[
                                        i => i.productCode,
                                        i => i.productName,
                                        i => <FormattedDate value={i.expiryDate} />,
                                        i => i.status,
                                        i => i.ded,
                                        i => i.dedInPatient,
                                        i => i.dedOutPatient,
                                        i => i.ceiling,
                                        i => i.ceilingInPatient,
                                        i => i.ceilingOutPatient,
                                        i => (i.ceiling || 0) - (i.ded || 0),
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
