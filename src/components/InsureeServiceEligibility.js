import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Paper, Grid, Typography } from "@material-ui/core";
import { FormattedMessage, ProgressOrError, PublishedComponent, withModulesManager } from "@openimis/fe-core";
import { fetchServiceEligibility } from "../actions";
import Eligibility from "./Eligibility";

const styles = theme => ({
    paper: {
        margin: theme.spacing(1) / 2,
        marginLeft: 0,
    },
    header: theme.table.title,
});


class InsureeServiceEligibility extends Component {

    state = {
        reset: true
    }

    componentDidMount() {
        this.setState({reset: true})
    }


    onServiceSelected = i => {
        this.setState(
            { reset: !i },
            e => !!i && this.props.fetchServiceEligibility(
                this.props.insuree.chfId,
                i.code)
        )
    }

    render() {
        const { classes, fetchingServiceEligibility, fetchedServiceEligibility, insureeServiceEligibility, errorServiceEligibility } = this.props;
        const { reset } = this.state;
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
                            id="medical.ServicePicker"
                            onChange={this.onServiceSelected}
                            withLabel={false}
                            withPlaceholder={true}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        {fetchingServiceEligibility && (
                            <ProgressOrError progress={fetchingServiceEligibility} error={errorServiceEligibility} />
                        )}
                        {!reset && fetchedServiceEligibility && (
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
    insureeServiceEligibility: state.policy.insureeServiceEligibility,
    fetchingServiceEligibility: state.policy.fetchingInsureeServiceEligibility,
    fetchedServiceEligibility: state.policy.fetchedInsureeServiceEligibility,
    errorServiceEligibility: state.policy.errorInsureeServiceEligibility,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchServiceEligibility }, dispatch);
};

export default withModulesManager(connect(mapStateToProps, mapDispatchToProps)(
    withTheme(withStyles(styles)(InsureeServiceEligibility))
));