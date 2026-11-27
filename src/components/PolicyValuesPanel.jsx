import React, { Component } from "react";
import { connect } from "react-redux";
import { styled } from "@mui/material/styles";
import { Paper, Grid, Typography, Divider } from "@mui/material";
import {
  FormattedMessage,
  Contributions,
  AmountInput,
  ProgressOrError,
  GRID_RESPONSIVE_STANDARD,
  GRID_RESPONSIVE_FULL,
} from "@openimis/fe-core";

const StyledPaper = styled(Paper)(({ theme }) => ({
  ...(theme?.paper?.paper ?? {}),
}));

const StyledTableTitle = styled('div')(({ theme }) => ({
  ...(theme?.table?.title ?? {}),
}));

const StyledItem = styled('div')(({ theme }) => ({
  ...(theme?.paper?.item ?? {}),
}));

const StyledItemCenter = styled('div')(({ theme }) => ({
  ...(theme?.paper?.item ?? {}),
  textAlign: "center",
}));

const POLICY_POLICY_VALUES_CONTRIBUTION_KEY = "policy.PolicyValues";
const POLICY_POLICY_VALUES_PANELS_CONTRIBUTION_KEY =
  "policy.PolicyValues.panels";

class PolicyValuesPanel extends Component {
  render() {
    const {
      title = "Policy.values.title",
      contributionPanelReadOnly = true,
      edited,
      fetchingPolicyValues,
      errorPolicyValues,
    } = this.props;

    let readOnly = contributionPanelReadOnly;
    return (
      <Grid size={GRID_RESPONSIVE_FULL}>
        <StyledPaper>
          <Grid container component={StyledTableTitle} spacing={1}>
            <Grid component={StyledTableTitle}>
              <Typography>
                <FormattedMessage module="policy" id={title} />
              </Typography>
            </Grid>
          </Grid>
          <Divider />
          <Grid container component={StyledItem} spacing={2}>
            <Grid
              container
              spacing={1}
              sx={{
                alignItems: "center",
                justifyContent: "flex-start"
              }}>
              <Grid size={GRID_RESPONSIVE_STANDARD} component={StyledItem}>
                <ProgressOrError
                  progress={fetchingPolicyValues}
                  error={errorPolicyValues}
                />
                {!fetchingPolicyValues && (
                  <AmountInput
                    module="policy"
                    label="Policy.value"
                    value={edited.value}
                    readOnly={readOnly}
                  />
                )}
              </Grid>
              <Grid size={GRID_RESPONSIVE_STANDARD} component={StyledItem}>
                <AmountInput
                  module="policy"
                  label="Policy.sumPremiums"
                  value={edited.sumPremiums || 0}
                  displayZero={true}
                  readOnly={readOnly}
                />
              </Grid>
              <Grid size={GRID_RESPONSIVE_STANDARD} component={StyledItem}>
                <AmountInput
                  module="policy"
                  label="Policy.balance"
                  value={edited.balance || 0}
                  displayZero={true}
                  readOnly={readOnly}
                />
              </Grid>
            </Grid>
            <Grid container spacing={1} sx={{
              alignItems: "center"
            }}>
              <Grid size={GRID_RESPONSIVE_FULL}>
                <Divider style={{ margin: "10px 0" }} />
              </Grid>
              <Grid size={GRID_RESPONSIVE_STANDARD} />
              <Grid size={GRID_RESPONSIVE_STANDARD} component={StyledItemCenter}>
                <Typography variant="body1">General</Typography>
              </Grid>
              <Grid size={GRID_RESPONSIVE_STANDARD} component={StyledItemCenter}>
                <Typography variant="body1">In-Patient</Typography>
              </Grid>
              <Grid size={3} component={StyledItemCenter}>
                <Typography variant="body1">Out-Patient</Typography>
              </Grid>
              <Grid size={3} component={StyledItemCenter}>
                <Typography variant="body1">Deductible</Typography>
              </Grid>
              <Grid size={3} component={StyledItemCenter}>
                <AmountInput value={edited.sumClaimDedG} readOnly={readOnly} />
              </Grid>
              <Grid size={3} component={StyledItemCenter}>
                <AmountInput value={edited.sumClaimDedIp} readOnly={readOnly} />
              </Grid>
              <Grid size={3} component={StyledItemCenter}>
                <AmountInput value={edited.sumClaimDedOp} readOnly={readOnly} />
              </Grid>
              <Grid size={3} component={StyledItemCenter}>
                <Typography variant="body1">Remunerated Health Care</Typography>
              </Grid>
              <Grid size={3} component={StyledItemCenter}>
                <AmountInput value={edited.sumClaimRemG} readOnly={readOnly} />
              </Grid>
              <Grid size={3} component={StyledItemCenter}>
                <AmountInput
                  value={edited.sunmClaimRemIp}
                  readOnly={readOnly}
                />
              </Grid>
              <Grid size={3} component={StyledItemCenter}>
                <AmountInput value={edited.sumClaimRemOp} readOnly={readOnly} />
              </Grid>
            </Grid>
            <Contributions
              {...this.props}
              updateAttribute={this.updateAttribute}
              contributionKey={POLICY_POLICY_VALUES_CONTRIBUTION_KEY}
            />
          </Grid>
        </StyledPaper>
        <Contributions
          {...this.props}
          updateAttribute={this.updateAttribute}
          contributionKey={POLICY_POLICY_VALUES_PANELS_CONTRIBUTION_KEY}
        />
      </Grid>
    );
  }
}
const mapStateToProps = (state) => ({
  fetchingPolicyValues: state.policy.fetchingPolicyValues,
  fetchedPolicyValues: state.policy.fetchedPolicyValues,
  errorPolicyValues: state.policy.errorPolicyValues,
  policyValues: state.policy.policyValues,
});

export { StyledPaper };
export default connect(mapStateToProps)(PolicyValuesPanel);
