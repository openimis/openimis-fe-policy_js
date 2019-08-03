import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import InsureeServiceEligibility from "./InsureeServiceEligibility";
import InsureeItemEligibility from "./InsureeItemEligibility";

const styles = theme => ({});

class InsureeEligibilityEnquiry extends Component {

    render() {
        const { theme, insuree
        } = this.props;
        return (
            <Fragment>
                {!!insuree && (
                    <Grid container>
                        <Grid item xs={6}><InsureeServiceEligibility insuree={insuree}/></Grid>
                        <Grid item xs={6}><InsureeItemEligibility insuree={insuree}/></Grid>
                    </Grid>
                )}

            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    insuree: state.insuree.insuree,
});

export default connect(mapStateToProps)
    (injectIntl(withTheme(
        withStyles(styles)(InsureeEligibilityEnquiry)
    )));
