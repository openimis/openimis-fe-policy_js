import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Box, Grid, Typography } from "@material-ui/core";
import { FormattedMessage, ProgressOrError, PublishedComponent, withModulesManager } from "@openimis/fe-core";
import { fetchServiceEligibility } from "../actions";
import Eligibility from "./Eligibility";

const styles = (theme) => ({
  item: {
    margin: 10,
  },
  header: {
    padding: 10,
    paddingBottom: 0,
    fontWeight: 500,
  },
  section: {
    margin: 10,
  },
});

class InsureeServiceEligibility extends Component {
  onServiceSelected = (service) => {
    const { insuree } = this.props;
    if (service) {
      this.props.fetchServiceEligibility(insuree.chfId, service.code);
    }
  };

  render() {
    const { classes, className, isFetching, isFetched, eligibility, error } = this.props;
    return (
      <div className={className}>
        <Box>
          <Typography className={classes.header}>
            <FormattedMessage module="policy" id="insureeEligibility.service" />
          </Typography>
        </Box>
        <Grid container className={classes.section} alignItems="center">
          <Grid item xs={6}>
            <Box mr={3}>
              <PublishedComponent
                pubRef="medical.ServicePicker"
                onChange={this.onServiceSelected}
                withLabel={false}
                withPlaceholder={true}
              />
            </Box>
          </Grid>
          <ProgressOrError size={16} progress={isFetching} error={error} />
          <Box flexGrow={1}>
            {isFetched && (
              <Eligibility
                minDate={eligibility.minServiceDate}
                remaining={eligibility.serviceLeft}
                isOk={eligibility.isServiceOk}
              />
            )}
          </Box>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  eligibility: state.policy.insureeServiceEligibility,
  isFetching: state.policy.fetchingInsureeServiceEligibility,
  isFetched: state.policy.fetchedInsureeServiceEligibility,
  error: state.policy.errorInsureeServiceEligibility,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ fetchServiceEligibility }, dispatch);
};

export default withModulesManager(
  connect(mapStateToProps, mapDispatchToProps)(withTheme(withStyles(styles)(InsureeServiceEligibility)))
);
