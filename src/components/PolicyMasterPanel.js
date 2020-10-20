import React, { Component } from "react";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { injectIntl } from 'react-intl';
import { Paper, Grid, Typography, Divider, IconButton } from "@material-ui/core";
import SuspendIcon from "@material-ui/icons/Pause";
import {
    formatMessage, withTooltip,
    FormattedMessage, Contributions, PublishedComponent
} from "@openimis/fe-core";

const styles = theme => ({
    paper: theme.paper.paper,
    tableTitle: theme.table.title,
    item: theme.paper.item,
})

const POLICY_POLICY_CONTRIBUTION_KEY = "policy.Policy"
const POLICY_POLICY_PANELS_CONTRIBUTION_KEY = "policy.Policy.panels"

class PolicyMasterPanel extends Component {

    render() {
        const {
            intl, classes, edited, readOnly = true,
            title = "Policy.details.title"
        } = this.props;
        let actions = [{
            button: <IconButton onClick={e => alert("Not implemented yet")}><SuspendIcon /></IconButton>,
            tooltip: formatMessage(intl, "policy", "action.suspend.tooltip"),
        }];
        return (
            <Grid container>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Grid container className={classes.tableTitle}>
                            <Grid item xs={3} className={classes.tableTitle}>
                                <Typography>
                                    <FormattedMessage module="policy" id={title} />
                                </Typography>
                            </Grid>
                            <Grid item xs={9}>
                                <Grid container justify="flex-end">
                                    {!!actions && (actions.map((a, idx) => {
                                        return (
                                            <Grid item key={`form-action-${idx}`} className={classes.paperHeaderAction}>
                                                {withTooltip(a.button, a.tooltip)}
                                            </Grid>
                                        )
                                    }))}
                                </Grid>
                            </Grid>                            
                        </Grid>
                        <Divider />
                        <Grid container className={classes.item}>
                            {["enrollDate", "effectiveDate", "startDate", "expiryDate"].map(date => (
                                <Grid item xs={3} key={`policy-${date}`} className={classes.item}>
                                    <PublishedComponent pubRef="core.DatePicker"
                                        value={!!edited ? edited[date] : null}
                                        module="policy"
                                        label={`Policy.${date}`}
                                        readOnly={readOnly}
                                        required={true}
                                        onChange={v => this.updateAttribute(date, v)}
                                    />
                                </Grid>
                            ))}
                            <Grid item xs={3} className={classes.item}>
                                <PublishedComponent pubRef="product.ProductPicker"
                                    value={!!edited && edited.product}
                                    module="policy"
                                    readOnly={readOnly}
                                    withNull={true}
                                    nullLabel={formatMessage(intl, "product", "Product.none")}
                                    onChange={v => this.updateAttribute('product', v)}
                                />
                            </Grid>
                            <Grid item xs={3} className={classes.item}>
                                <PublishedComponent pubRef="policy.PolicyOfficerPicker"
                                    value={!!edited && edited.officer}
                                    module="policy"
                                    readOnly={readOnly}
                                    withNull={true}
                                    nullLabel={formatMessage(intl, "policy", "PolicyOfficer.none")}
                                    onChange={v => this.updateAttribute('officer', v)}
                                />
                            </Grid>
                            <Grid item xs={3} className={classes.item}>
                                <PublishedComponent pubRef="policy.PolicyStatusPicker"
                                    value={!!edited && edited.status}
                                    module="policy"
                                    readOnly={readOnly}
                                    withNull={true}
                                    nullLabel="PolicyStatus.none"
                                    onChange={v => this.updateAttribute('status', v)}
                                />
                            </Grid>
                            <Contributions {...this.props} updateAttribute={this.updateAttribute} contributionKey={POLICY_POLICY_CONTRIBUTION_KEY} />
                        </Grid>
                    </Paper>
                    <Contributions {...this.props} updateAttribute={this.updateAttribute} contributionKey={POLICY_POLICY_PANELS_CONTRIBUTION_KEY} />
                </Grid>
            </Grid>
        )
    }
}

export default injectIntl(withTheme(withStyles(styles)(PolicyMasterPanel)));