import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Paper, Grid, Typography } from "@material-ui/core";
import { FormattedMessage, ProgressOrError, PublishedComponent } from "@openimis/fe-core";
import { fetchItemEligibility } from "../actions";
import Eligibility from "./Eligibility";

const styles = theme => ({
    paper: {
        margin: theme.spacing(1)/2,
        marginRight: 0,
    },
    header: theme.table.title,
});


class InsureeItemEligibility extends Component {

    onItemSelected = i => {
        this.props.fetchItemEligibility(i.code);
    }

    render() {
        const { classes, fetchingItemEligibility, fetchedItemEligibility, insureeItemEligibility, errorItemEligibility } = this.props;

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
                            id="medical.ItemSimpleSearcher"
                            onItemSelected={this.onItemSelected}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        {fetchingItemEligibility && (
                            <ProgressOrError progress={fetchingItemEligibility} error={errorItemEligibility} />
                        )}
                        {fetchedItemEligibility && (
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
    insureeItemEligibility: state.policyInsuree.insureeItemEligibility,
    fetchingItemEligibility: state.policyInsuree.fetchingItemEligibility,
    fetchedItemEligibility: state.policyInsuree.fetchedItemEligibility,
    errorItemEligibility: state.policyInsuree.errorItemEligibility,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchItemEligibility }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(
    withTheme(withStyles(styles)(InsureeItemEligibility))
);