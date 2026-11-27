import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { styled } from "@mui/material/styles";
import { Box, Grid, Typography } from "@mui/material";
import { FormattedMessage, ProgressOrError, PublishedComponent, withModulesManager } from "@openimis/fe-core";
import {fetchItemEligibility, itemEligibilityClear} from "../actions";
import Eligibility from "./Eligibility";

const StyledItem = styled('div')(({ theme }) => ({
  padding: 10,
}));

const StyledHeader = styled(Typography)(({ theme }) => ({
  padding: 10,
  paddingBottom: 0,
  fontWeight: 500,
}));

const StyledSection = styled('div')(({ theme }) => ({
  padding: 10,
}));

class InsureeItemEligibility extends Component {
  onItemSelected = (item) => {
    const { insuree } = this.props;
    if (item) {
      this.props.fetchItemEligibility(insuree.chfId, item.code);
    } else {
      this.props.itemEligibilityClear();
    }
  };

  componentWillUnmount() {
    this.props.itemEligibilityClear();
  }

  render() {
    const { isFetching, isFetched, eligibility, error, className } = this.props;
    return (
      <div className={className}>
        <Box>
          <StyledHeader>
            <FormattedMessage module="policy" id="insureeEligibility.item" />
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
                pubRef="medical.ItemPicker"
                onChange={this.onItemSelected}
                withLabel={false}
                withPlaceholder={true}
              />
            </Box>
          </Grid>
          <ProgressOrError size={16} progress={isFetching} error={error} />
          <Box sx={{
            flexGrow: 1
          }}>
            {isFetched && !error && (
              <Eligibility
                minDate={eligibility.minServiceDate}
                remaining={eligibility.itemLeft}
                isOk={eligibility.isItemOk}
              />
            )}
          </Box>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  eligibility: state.policy.insureeItemEligibility,
  isFetching: state.policy.fetchingInsureeItemEligibility,
  isFetched: state.policy.fetchedInsureeItemEligibility,
  error: state.policy.errorInsureeItemEligibility,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ fetchItemEligibility, itemEligibilityClear }, dispatch);
};

export { StyledItem };
export { InsureeItemEligibility };
export default withModulesManager(
  connect(mapStateToProps, mapDispatchToProps)(InsureeItemEligibility)
);
