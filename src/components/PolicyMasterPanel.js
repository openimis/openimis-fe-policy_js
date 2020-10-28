import React, { Fragment } from "react";
import { connect } from "react-redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { injectIntl } from 'react-intl';
import { Paper, Grid, Typography, Divider, IconButton } from "@material-ui/core";
import SuspendIcon from "@material-ui/icons/Pause";
import {
    formatMessage, withTooltip,
    FormattedMessage, FormPanel, Contributions, PublishedComponent, ProgressOrError
} from "@openimis/fe-core";

import { fetchPolicyValues } from "../actions";

const styles = theme => ({
    paper: theme.paper.paper,
    tableTitle: theme.table.title,
    item: theme.paper.item,
})

const POLICY_POLICY_CONTRIBUTION_KEY = "policy.Policy"
const POLICY_POLICY_PANELS_CONTRIBUTION_KEY = "policy.Policy.panels"

class PolicyMasterPanel extends FormPanel {

    _onProductChange = product => {
        this.setState(
            { product },
            e => !product ?
                this.updateAttributes({
                    startDate: null,
                    expiryDate: null,
                    value: null
                }) :
                this.props.fetchPolicyValues({ ... this.props.edited, product })
        )
    }

    _onEnrollDateChange = enrollDate => {
        this.setState(
            { enrollDate },
            e => !!this.props.edited.product ?
                this.props.fetchPolicyValues({ ... this.props.edited, enrollDate }) :
                this.updateAttribute('enrollDate', enrollDate)
        )
    }

    _filterProducts = products => {
        if (!products || !this.props.edited || !this.props.edited.family) return products;
        let loc = this.props.edited.family.location
        let familyRegion = null;
        let familyDistrict = null;
        while (!!loc) {
            familyRegion = familyDistrict
            familyDistrict = loc
            loc = loc.parent
        }
        return products.filter(p => !p.location || p.location.id === familyRegion.id || p.location.id === familyDistrict.id)
    }

    render() {
        const {
            intl, classes, edited, readOnly, fetchingPolicyValues, errorPolicyValues,
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
                            <Grid item xs={3} className={classes.item}>
                                <PublishedComponent pubRef="core.DatePicker"
                                    value={!!edited ? edited.enrollDate : null}
                                    module="policy"
                                    label="Policy.enrollDate"
                                    readOnly={readOnly}
                                    required={true}
                                    onChange={v => this._onEnrollDateChange(v)}
                                />
                            </Grid>
                            <Grid item xs={3} className={classes.item}>
                                <PublishedComponent pubRef="core.DatePicker"
                                    value={!!edited ? edited.effectiveDate : null}
                                    module="policy"
                                    label="Policy.effectiveDate"
                                    readOnly={true}
                                    required={false}
                                />
                            </Grid>
                            {!!fetchingPolicyValues && (
                                <Grid item xs={6} className={classes.item}>
                                    <ProgressOrError progress={fetchingPolicyValues} error={errorPolicyValues} />
                                </Grid>
                            )}
                            {!fetchingPolicyValues && ["startDate", "expiryDate"].map(date => (
                                <Grid key={`policy-${date}`} item xs={3} className={classes.item}>
                                    <PublishedComponent pubRef="core.DatePicker"
                                        value={!!edited ? edited[date] : null}
                                        module="policy"
                                        label={`Policy.${date}`}
                                        readOnly={true}
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
                                    onChange={this._onProductChange}
                                    filter={this._filterProducts}
                                    required={true}
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
                                    required={true}
                                />
                            </Grid>
                            <Grid item xs={3} className={classes.item}>
                                <PublishedComponent pubRef="policy.PolicyStatusPicker"
                                    value={!!edited && edited.status}
                                    module="policy"
                                    readOnly={true}
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

const mapStateToProps = state => ({
    fetchingPolicyValues: state.policy.fetchingPolicyValues,
    errorPolicyValues: state.policy.errorPolicyValues,
})


export default injectIntl(withTheme(withStyles(styles)(connect(mapStateToProps, { fetchPolicyValues })(PolicyMasterPanel))));