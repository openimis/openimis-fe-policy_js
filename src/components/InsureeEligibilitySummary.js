import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { injectIntl } from 'react-intl';
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Grid, Paper } from "@material-ui/core";
import { Table, FormattedMessage } from "@openimis/fe-core";
import { fetchEligibility } from "../actions";


const styles = theme => ({
    paper: {
        margin: 0,
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    }
});

const counts = insureeEligibility => (
    <Table
        module="policy"
        header={<FormattedMessage module="policy" id="insureeEligibility.remainNbr" />}
        headers={[
            "insureeEligibility.admissionsLeft",
            "insureeEligibility.visitsLeft",
            "insureeEligibility.consultationsLeft",
            "insureeEligibility.surgeriesLeft",
            "insureeEligibility.deliveriesLeft",
            "insureeEligibility.antenatalsLeft"
        ]}
        itemFormatters={[
            i => i.totalAdmissionsLeft,
            i => i.totalVisitsLeft,
            i => i.totalConsultationsLeft,
            i => i.totalSurgeriesLeft,
            i => i.totalDeliveriesLeft,
            i => i.totalAntenatalLeft
        ]}
        items={[insureeEligibility]}
    />
);

const amounts = insureeEligibility => (
    <Table
        module="policy"
        header={<FormattedMessage module="policy" id="insureeEligibility.remainAmounts" />}
        headers={[
            "insureeEligibility.hospitalizationAmountLeft",
            "insureeEligibility.consultationAmountLeft",
            "insureeEligibility.surgeryAmountLeft",
            "insureeEligibility.deliveryAmountLeft",
            "insureeEligibility.antenatalAmountLeft"
        ]}
        itemFormatters={[
            i => i.hospitalizationAmountLeft,
            i => i.consultationAmountLeft,
            i => i.surgeryAmountLeft,
            i => i.deliveryAmountLeft,
            i => i.antenatalAmountLeft
        ]}
        items={[insureeEligibility]}
    />
)

class InsureeEligibilitySummary extends Component {
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!prevProps.insuree && !!this.props.insuree
            || !!prevProps.insuree && this.props.insuree && (
                prevProps.insuree.chfId == null
                || prevProps.insuree.chfId !== this.props.insuree.chfId
            )
        ) {
            this.props.fetchEligibility(this.props.insuree.chfId);
        }
    }

    render() {
        const { classes, insuree, insureeEligibility } = this.props;
        if (!insuree || !insureeEligibility) return null;

        return (
            <Grid container>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        {counts(insureeEligibility)}
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        {amounts(insureeEligibility)}
                    </Paper>
                </Grid>
            </Grid>
        )
    }
}


const mapStateToProps = state => ({
    insuree: state.insuree.insuree,
    fetchingEligibility: state.policy.fetchingInsureeEligibility,
    fetchedEligibility: state.policy.fetchedInsureeEligibility,
    insureeEligibility: state.policy.insureeEligibility,
    errorEligibility: state.policy.errorInsureeEligibility,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchEligibility }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(withTheme(
        withStyles(styles)(InsureeEligibilitySummary)
    ))
);
