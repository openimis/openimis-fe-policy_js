import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Paper, Grid, Typography } from "@material-ui/core";
import { FormattedMessage, ProgressOrError, PublishedComponent, withModulesManager } from "@openimis/fe-core";
import { fetchServiceEligibility } from "../actions";
import Eligibility from "./Eligibility";

const styles = theme => ({
    item: {
        margin: theme.spacing(1) / 2,
    },
    header: {
        padding: 10,
        fontWeight: 500,
    }
});


class InsureeServiceEligibility extends Component {

    state = {
        reset: true
    }

    componentDidMount() {
        this.setState({ reset: true })
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
            <div className={classes.item}>
                <Grid container alignItems="center">
                    <Grid item xs={4}>
                        <Typography className={classes.header}>
                            <FormattedMessage module="policy" id="insureeEligibility.service" />
                        </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <PublishedComponent
                            pubRef="medical.ServicePicker"
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
            </div>
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