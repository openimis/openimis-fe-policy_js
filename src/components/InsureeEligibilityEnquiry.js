import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Grid, Paper } from "@material-ui/core";
import InsureeServiceEligibility from "./InsureeServiceEligibility";
import InsureeItemEligibility from "./InsureeItemEligibility";

const styles = (theme) => ({
  paper: {
    ...theme.paper.paper,
    marginInline: 0,
  },
});

class InsureeEligibilityEnquiry extends Component {
  render() {
    const { classes, insuree } = this.props;
    if (!insuree) return null;
    return (
      <Paper className={classes.paper}>
        <InsureeServiceEligibility insuree={insuree} />
        <InsureeItemEligibility insuree={insuree} />
      </Paper>
    );
  }
}

export default withTheme(withStyles(styles)(injectIntl(InsureeEligibilityEnquiry)));
