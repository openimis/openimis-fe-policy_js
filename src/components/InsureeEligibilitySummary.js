import React, { Component } from "react";
import { injectIntl } from 'react-intl';
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Grid, Paper } from "@material-ui/core";
import { SmallTable } from "@openimis/fe-core";


const styles = theme => ({
    paper: {
        margin: 0,
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    }
});

class InsureeEligibilitySummary extends Component {    
    render() {
        const { classes, eligibility } = this.props;
        return (
            <Grid container>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <SmallTable
                            module="policy"
                            header="insureeEligibility.remainNbr"
                            headers={[
                                "insureeEligibility.admissionsLeft",
                                "insureeEligibility.visitsLeft",
                                "insureeEligibility.consultationsLeft",
                                "insureeEligibility.surgeriesLeft",
                                "insureeEligibility.deliveriesLeft",
                                "insureeEligibility.antenatalsLeft"
                            ]}
                            itemFormatters={[
                                i => i.totalAdmissionsLeft,
                                i => i.totalVisitsLeft,
                                i => i.totalConsultationsLeft,
                                i => i.totalSurgeriesLeft,
                                i => i.totalDeliveriesLeft,
                                i => i.totalAntenatalLeft
                            ]}
                            items={[eligibility]}
                        />
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <SmallTable
                            module="policy"
                            header="insureeEligibility.remainAmounts"
                            headers={[
                                "insureeEligibility.hospitalizationAmountLeft",
                                "insureeEligibility.consultationAmountLeft",
                                "insureeEligibility.surgeryAmountLeft",
                                "insureeEligibility.deliveryAmountLeft",
                                "insureeEligibility.antenatalAmountLeft"
                            ]}
                            itemFormatters={[
                                i => i.hospitalizationAmountLeft,
                                i => i.consultationAmountLeft,
                                i => i.surgeryAmountLeft,
                                i => i.deliveryAmountLeft,
                                i => i.antenatalAmountLeft
                            ]}
                            items={[eligibility]}
                        />
                    </Paper>
                </Grid>                
            </Grid>
        )
    }
}

export default injectIntl(withTheme(
    withStyles(styles)(InsureeEligibilitySummary)
));
