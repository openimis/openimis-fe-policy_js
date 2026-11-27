import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { styled } from "@mui/material/styles";
import { Grid, Paper } from "@mui/material";
import { Table, FormattedMessage, injectIntl } from "@openimis/fe-core";
import { fetchEligibility } from "../actions";

const StyledPaper = styled(Paper)(({ theme }) => ({
  margin: 0,
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

const counts = insureeEligibility => (
    <Table
        module="policy"
        header={<FormattedMessage module="policy" id="insureeEligibility.remainNbr" />}
        headers={[
            "insureeEligibility.admissionsLeft",
            "insureeEligibility.visitsLeft",
            "insureeEligibility.consultationsLeft",
            "insureeEligibility.surgeriesLeft",
            "insureeEligibility.deliveriesLeft",
            "insureeEligibility.antenatalsLeft"
        ]}
        itemFormatters={[
            i => i.totalAdmissionsLeft ?? "N/A",
            i => i.totalVisitsLeft ?? "N/A",
            i => i.totalConsultationsLeft ?? "N/A",
            i => i.totalSurgeriesLeft ?? "N/A",
            i => i.totalDeliveriesLeft ?? "N/A",
            i => i.totalAntenatalLeft ?? "N/A"
        ]}
        items={[insureeEligibility]}
    />
);

const amounts = insureeEligibility => (
    <Table
        module="policy"
        header={<FormattedMessage module="policy" id="insureeEligibility.remainAmounts" />}
        headers={[
            "insureeEligibility.hospitalizationAmountLeft",
            "insureeEligibility.consultationAmountLeft",
            "insureeEligibility.surgeryAmountLeft",
            "insureeEligibility.deliveryAmountLeft",
            "insureeEligibility.antenatalAmountLeft"
        ]}
        itemFormatters={[
            i => i.hospitalizationAmountLeft ?? "N/A",
            i => i.consultationAmountLeft ?? "N/A",
            i => i.surgeryAmountLeft ?? "N/A",
            i => i.deliveryAmountLeft ?? "N/A",
            i => i.antenatalAmountLeft ?? "N/A"
        ]}
        items={[insureeEligibility]}
    />
)

class InsureeEligibilitySummary extends Component {
    constructor(props){
        super(props);
        this.isEligiblitySummaryEnabled =  this.props.modulesManager.getConf("fe-policy", "isEligiblitySummaryEnabled", true);
    }

    componentDidMount(){
        const chfId = this.props?.insureeEnquiry?.chfId || this.props?.insuree?.chfId;
        if (chfId) {
            this.props.fetchEligibility(chfId);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps?.insuree?.chfId !== this.props?.insuree?.chfId){
            this.props.fetchEligibility(this.props.insuree.chfId);
        }
    }

    render() {
        const { insuree, insureeEnquiry, insureeEligibility } = this.props;
        const currentInsuree = insureeEnquiry || insuree;
        if (!currentInsuree || !insureeEligibility || !this.isEligiblitySummaryEnabled) return null;

        return (
            <Grid container>
                <Grid size={12}>
                    <StyledPaper>
                        {counts(insureeEligibility)}
                    </StyledPaper>
                </Grid>
                <Grid size={12}>
                    <StyledPaper>
                        {amounts(insureeEligibility)}
                    </StyledPaper>
                </Grid>
            </Grid>
        )
    }
}

const mapStateToProps = state => ({
    insuree: state.insuree.insuree,
    insureeEnquiry: state?.insuree?.insureeEnquiry,
    fetchingEligibility: state.policy.fetchingInsureeEligibility,
    fetchedEligibility: state.policy.fetchedInsureeEligibility,
    insureeEligibility: state.policy.insureeEligibility,
    errorEligibility: state.policy.errorInsureeEligibility,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchEligibility }, dispatch);
};

export { StyledPaper };
export { InsureeEligibilitySummary };
export default connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(InsureeEligibilitySummary)
);
