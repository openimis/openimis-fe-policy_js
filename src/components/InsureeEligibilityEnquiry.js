import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Grid, Paper } from "@material-ui/core";
import InsureeServiceEligibility from "./InsureeServiceEligibility";
import InsureeItemEligibility from "./InsureeItemEligibility";

const styles = theme => ({
    paper: theme.paper.paper,
});

class InsureeEligibilityEnquiry extends Component {

    render() {
        const { classes, insuree } = this.props;
        return (
            <Paper className={classes.paper}>
                {!!insuree && (
                    <Grid container>
                        <Grid item xs={6}><InsureeServiceEligibility insuree={insuree} /></Grid>
                        <Grid item xs={6}><InsureeItemEligibility insuree={insuree} /></Grid>
                    </Grid>
                )}

            </Paper>
        )
    }
}

const mapStateToProps = state => ({
    insuree: state.insuree.insuree,
});

export default withTheme(withStyles(styles)(connect(mapStateToProps)(injectIntl((InsureeEligibilityEnquiry)))));
