import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { styled } from "@mui/material/styles";
import { Box, Grid, Typography } from "@mui/material";
import { FormattedMessage, ProgressOrError, PublishedComponent, withModulesManager } from "@openimis/fe-core";
import {fetchServiceEligibility, serviceEligibilityClear} from "../actions";
import Eligibility from "./Eligibility";

const StyledItem = styled('div')(({ theme }) => ({
  margin: 10,
}));

const StyledHeader = styled(Typography)(({ theme }) => ({
  padding: 10,
  paddingBottom: 0,
  fontWeight: 500,
}));

const StyledSection = styled('div')(({ theme }) => ({
  margin: 10,
}));

class InsureeServiceEligibility extends Component {
  onServiceSelected = (service) => {
    const { insuree } = this.props;
    if (service) {
      this.props.fetchServiceEligibility(insuree.chfId, service.code);
    } else {
      this.props.serviceEligibilityClear();
    }
  };

  componentWillUnmount() {
    this.props.serviceEligibilityClear();
  }

  render() {
    const { className, isFetching, isFetched, eligibility, error } = this.props;
    return (
      <Box className={className}>
        <Box>
          <StyledHeader>
            <FormattedMessage module="policy" id="insureeEligibility.service" />
          </StyledHeader>
        </Box>
        <Grid container component={StyledSection} sx={{
          alignItems: "center"
        }}>
          <Grid size={6}>
            <Box sx={{
              mr: 3
            }}>
              <PublishedComponent
                pubRef="medical.ServicePicker"
                onChange={this.onServiceSelected}
                withLabel={false}
                withPlaceholder={true}
              />
            </Box>
          </Grid>
          <ProgressOrError size={16} progress={isFetching} error={error} />
          <Box sx={{
            flexGrow: 1
          }}>
            {isFetched && !error &&  (
              <Eligibility
                minDate={eligibility.minServiceDate}
                remaining={eligibility.serviceLeft}
                isOk={eligibility.isServiceOk}
              />
            )}
          </Box>
        </Grid>
      </Box>
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
  return bindActionCreators({ fetchServiceEligibility, serviceEligibilityClear }, dispatch);
};

export { StyledItem };
export { InsureeServiceEligibility };
export default withModulesManager(
  connect(mapStateToProps, mapDispatchToProps)(InsureeServiceEligibility)
);
