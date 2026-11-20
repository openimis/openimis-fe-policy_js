import React, { Component } from "react";
import { injectIntl } from "@openimis/fe-core";
import { styled } from "@mui/material/styles";
import { Paper } from "@mui/material";
import InsureeServiceEligibility from "./InsureeServiceEligibility";
import InsureeItemEligibility from "./InsureeItemEligibility";

const StyledPaper = styled(Paper)(({ theme }) => ({
  ...(theme?.paper?.paper ?? {}),
}));

class InsureeEligibilityEnquiry extends Component {
  render() {
    const { insuree } = this.props;
    if (!insuree) return null;
    return (
      <StyledPaper>
        <InsureeServiceEligibility insuree={insuree} />
        <InsureeItemEligibility insuree={insuree} />
      </StyledPaper>
    );
  }
}

export { StyledPaper };
export default injectIntl(InsureeEligibilityEnquiry);
