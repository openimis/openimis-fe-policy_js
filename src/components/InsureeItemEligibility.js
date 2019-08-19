import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Paper, Grid, Typography } from "@material-ui/core";
import { FormattedMessage, ProgressOrError, PublishedComponent, withModulesManager } from "@openimis/fe-core";
import { fetchItemEligibility } from "../actions";
import Eligibility from "./Eligibility";

const styles = theme => ({
    paper: {
        margin: theme.spacing(1) / 2,
        marginRight: 0,
    },
    header: theme.table.title,
});


class InsureeItemEligibility extends Component {

    state = {
        reset: true
    }

    componentDidMount() {
        this.setState({
            reset: true
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!prevProps.insuree && !!this.props.insuree
            || !!prevProps.insuree && this.props.insuree && (
                prevProps.insuree.chfId == null
                || prevProps.insuree.chfId !== this.props.insuree.chfId
            )
        ) {
            this.setState({
                insureeItemEligibility: null,
                fetchedItemEligibility: false,
                selected: null
            })
        }
    }

    onItemSelected = i => {
        this.setState(
            { reset: !i },
            e => !!i && this.props.fetchItemEligibility(
                this.props.insuree.chfId,
                i.code)
        )
    }

    render() {
        const { classes, fetchingItemEligibility, fetchedItemEligibility, insureeItemEligibility, errorItemEligibility } = this.props;
        const { reset } = this.state;
        return (
            <Paper className={classes.paper}>
                <Grid container alignItems="center">
                    <Grid item xs={4}>
                        <Typography className={classes.header}>
                            <FormattedMessage module="policy" id="insureeEligibility.item" />
                        </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <PublishedComponent
                            id="medical.ItemPicker"
                            onChange={this.onItemSelected}
                            withLabel={false}
                            withPlaceholder={true}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        {fetchingItemEligibility && (
                            <ProgressOrError progress={fetchingItemEligibility} error={errorItemEligibility} />
                        )}
                        {!reset && fetchedItemEligibility && (
                            <Eligibility eligibility={{
                                "minDate": insureeItemEligibility.minItemDate,
                                "left": insureeItemEligibility.itemLeft,
                                "isOk": insureeItemEligibility.isItemOk
                            }} />
                        )}
                    </Grid>
                </Grid>
            </Paper>
        )
    }
}

const mapStateToProps = state => ({
    insureeItemEligibility: state.policy.insureeItemEligibility,
    fetchingItemEligibility: state.policy.fetchingInsureeItemEligibility,
    fetchedItemEligibility: state.policy.fetchedInsureeItemEligibility,
    errorItemEligibility: state.policy.errorInsureeItemEligibility,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchItemEligibility }, dispatch);
};

export default withModulesManager(connect(mapStateToProps, mapDispatchToProps)(
    withTheme(withStyles(styles)(InsureeItemEligibility))
));