import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Paper, Grid, Typography } from "@material-ui/core";
import { FormattedMessage, ProgressOrError, PublishedComponent } from "@openimis/fe-core";
import { fetchServiceEligibility } from "../actions";
import Eligibility from "./Eligibility";

const styles = theme => ({
    paper: {
        margin: theme.spacing(1)/2,
        marginLeft : 0,
    },
    header: theme.table.title,
});


class InsureeServiceEligibility extends Component {

    onServiceSelected = i => {
        this.props.fetchServiceEligibility(i.code);
    }

    render() {
        const { classes, fetchingServiceEligibility, fetchedServiceEligibility, insureeServiceEligibility, errorServiceEligibility } = this.props;

        return (
            <Paper className={classes.paper}>
                <Grid container alignItems="center">
                    <Grid item xs={4}>
                        <Typography className={classes.header}>
                            <FormattedMessage module="policy" id="insureeEligibility.service" />
                        </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <PublishedComponent
                            id="medical.ServiceSimpleSearcher"
                            onServiceSelected={this.onServiceSelected}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        {fetchingServiceEligibility && (
                            <ProgressOrError progress={fetchingServiceEligibility} error={errorServiceEligibility} />
                        )}
                        {fetchedServiceEligibility && (
                            <Eligibility eligibility={{
                                "minDate": insureeServiceEligibility.minServiceDate,
                                "left": insureeServiceEligibility.serviceLeft,
                                "isOk": insureeServiceEligibility.isServiceOk
                            }} />
                        )}
                    </Grid>
                </Grid>
            </Paper>
        )
    }
}

const mapStateToProps = state => ({
    insureeServiceEligibility: state.policyInsuree.insureeServiceEligibility,
    fetchingServiceEligibility: state.policyInsuree.fetchingServiceEligibility,
    fetchedServiceEligibility: state.policyInsuree.fetchedServiceEligibility,
    errorServiceEligibility: state.policyInsuree.errorServiceEligibility,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchServiceEligibility }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(
    withTheme(withStyles(styles)(InsureeServiceEligibility))
);