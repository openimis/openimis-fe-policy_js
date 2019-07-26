import React, { Component } from "react";
import { injectIntl, FormattedDate } from 'react-intl';
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

class InsureePoliciesSummary extends Component {
    render() {
        const { classes, policies } = this.props;
        return (
            <Grid container>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <SmallTable
                            module="policy"
                            header="insureePolicies.header"
                            headers={[
                                "insureePolicies.productCode",
                                "insureePolicies.productName",
                                "insureePolicies.expiryDate",
                                "insureePolicies.status",
                                "insureePolicies.hostpitalDeduction",
                                "insureePolicies.nonHospitalDeduction",
                                "insureePolicies.hospitalCeiling",
                                "insureePolicies.nonHospitalCeiling"
                            ]}
                            itemFormatters={[
                                i => i.productCode,
                                i => i.productName,
                                i => <FormattedDate value={i.expiryDate} />,
                                i => i.status,
                                i => i.ded1,
                                i => i.ded2,
                                i => i.ceiling1,
                                i => i.ceiling2
                            ]}
                            items={policies} />
                    </Paper>
                </Grid>
            </Grid >
        )
    }
}

export default injectIntl(withTheme(
    withStyles(styles)(InsureePoliciesSummary)
));

