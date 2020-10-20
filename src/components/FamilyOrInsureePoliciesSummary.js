import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { injectIntl } from 'react-intl';
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Divider, Grid, Paper, Typography, FormControlLabel, Checkbox, IconButton } from "@material-ui/core";
import {
    Add as AddIcon,
    Autorenew as RenewIcon,
    Delete as DeleteIcon,
} from '@material-ui/icons';
import {
    Table, PagedDataHandler,
    formatMessage, formatMessageWithValues,
    formatDateFromISO, withModulesManager,
    formatSorter, sort, withTooltip,
    historyPush, withHistory
} from "@openimis/fe-core";
import { fetchFamilyOrInsureePolicies, selectPolicy } from "../actions";
import { RIGHT_POLICY_ADD } from "../constants";

const styles = theme => ({
    paper: theme.paper.paper,
    paperHeader: theme.paper.header,
    paperHeaderAction: theme.paper.action,
    tableTitle: theme.table.title,
    fab: theme.fab,
    button: {
        margin: theme.spacing(1),
    },
    item: {
        padding: theme.spacing(1)
    },
});

class FamilyOrInsureePoliciesSummary extends PagedDataHandler {

    constructor(props) {
        super(props);
        this.rowsPerPageOptions = props.modulesManager.getConf("fe-policy", "familyOrInsureePoliciesSummary.rowsPerPageOptions", [5, 10, 20]);
        this.defaultPageSize = props.modulesManager.getConf("fe-policy", "familyOrInsureePoliciesSummary.defaultPageSize", 5);
        this.showBalance = props.modulesManager.getConf("fe-policy", "familyOrInsureePoliciesSummary.showBalance", false);
    }

    componentDidMount() {
        this.setState(
            {
                onlyActiveOrLastExpired: true,
                orderBy: "expiryDate"
            },
            e => this.query())
    }

    addNewPolicy = () => alert("Will be implemented along Policy module migration!")
    deletePolicy = () => alert("Will be implemented along Policy module migration!")
    renewPolicy = () => alert("Will be implemented along Policy module migration!")

    onDoubleClick = (i, newTab = false) => {
        historyPush(this.props.modulesManager, this.props.history, "policy.route.policy", [i.policyUuid, this.props.family.uuid])
    }


    insureeChanged = (prevProps) =>
        (!prevProps.insuree && !!this.props.insuree)
        || (!!prevProps.insuree && !this.props.insuree)
        || (!!prevProps.insuree && !!this.props.insuree && !!this.props.insuree.chfId &&
            (
                prevProps.insuree.chfId == null
                || prevProps.insuree.chfId !== this.props.insuree.chfId
            )
        )
    familyChanged = (prevProps) => (!prevProps.family && !!this.props.family)
        || (!!prevProps.family && !this.props.family)
        || (!!prevProps.family && !!this.props.family && !!this.props.family.uuid &&
            (
                prevProps.family.uuid == null
                || prevProps.family.uuid !== this.props.family.uuid
            )
        )

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.insureeChanged(prevProps) || this.familyChanged(prevProps)) {
            this.query();
        }
    }

    queryPrms() {
        let prms = [
            `orderBy: "${this.state.orderBy}"`,
            `activeOrLastExpiredOnly: ${!!this.state.onlyActiveOrLastExpired}`
        ];
        if (!!this.props.insuree && !!this.props.insuree.chfId) {
            prms.push(`chfId:"${this.props.insuree.chfId}"`)
            return prms;
        } else if (!!this.props.family && !!this.props.family.uuid) {
            prms.push(`familyUuid:"${this.props.family.uuid}"`);
            return prms;
        }
    }

    onChangeSelection = (i) => {
        this.props.selectPolicy(i[0] || null)
    }

    toggleCheckbox = (key) => {
        this.setState(
            (state, props) => ({
                [key]: !state[key]
            }),
            e => this.query())
    }

    headers = () => {
        let h = [
            "policies.productCode",
            "policies.productName",
            "policies.expiryDate",
            "policies.status",
            "policies.deduction",
            "policies.hospitalDeduction",
            "policies.nonHospitalDeduction",
            "policies.ceiling",
            "policies.hospitalCeiling",
            "policies.nonHospitalCeiling"
        ];
        if (this.showBalance) {
            h.push("policies.balance");
        }
        h.push("", "")
        return h
    }

    sorter = (attr, asc = true) => [
        () => this.setState((state, props) => ({ orderBy: sort(state.orderBy, attr, asc) }), e => this.query()),
        () => formatSorter(this.state.orderBy, attr, asc)
    ]

    headerActions = () => {
        let a = [
            this.sorter("productCode"),
            this.sorter("productName"),
            this.sorter("expiryDate"),
            this.sorter("status"),
            this.sorter("deduction"),
            this.sorter("hospitalDeduction"),
            this.sorter("nonHospitalDeduction"),
            this.sorter("ceiling"),
            this.sorter("hospitalCeiling"),
            this.sorter("nonHospitalCeiling"),
        ]
        if (this.showBalance) {
            a.push(this.sorter("balance"));
        }
        return a;
    };

    itemFormatters = () => {
        let f = [
            i => i.productCode,
            i => i.productName,
            i => formatDateFromISO(this.props.modulesManager, this.props.intl, i.expiryDate),
            i => formatMessage(this.props.intl, "policy", `policies.status.${i.status}`),
            i => i.ded,
            i => i.dedInPatient,
            i => i.dedOutPatient,
            i => i.ceiling,
            i => i.ceilingInPatient,
            i => i.ceilingOutPatient,
        ]
        if (this.showBalance) {
            f.push(i => i.balance)
        }
        f.push(i => withTooltip(<IconButton onClick={this.deletePolicy}><DeleteIcon /></IconButton>, formatMessage(this.props.intl, "policy", "familyDeletePolicy.tooltip")))
        f.push(i => withTooltip(<IconButton onClick={this.renewPolicy}><RenewIcon /></IconButton>, formatMessage(this.props.intl, "policy", "familyRenewPolicy.tooltip")))

        return f;
    }

    header = () => {
        const { intl, pageInfo } = this.props;
        if (!!this.props.insuree && !!this.props.insuree.chfId) {
            return formatMessageWithValues(
                intl, "policy", "policiesOfInsuree.header",
                { count: pageInfo.totalCount, chfId: this.props.insuree.chfId }
            )
        } else {
            return formatMessageWithValues(
                intl, "policy", "policies.header",
                { count: pageInfo.totalCount }
            )
        }
    }

    itemIdentifier = (i) => i.policyUuid

    render() {
        const { intl, classes, rights, fetchingPolicies, fetchedPolicies, policies, pageInfo, errorPolicies, family, insuree, reset, readOnly } = this.props;
        if ((!family || !family.uuid) && (!insuree || !insuree.uuid)) {
            return null;
        }

        let actions = !!readOnly || !rights.includes(RIGHT_POLICY_ADD) ? [] : [
            {
                button: <IconButton onClick={this.addNewPolicy}><AddIcon /></IconButton>,
                tooltip: formatMessage(intl, "policy", "familyAddPolicy.tooltip")
            }
        ];

        return (
            <Paper className={classes.paper}>
                <Grid container alignItems="center" direction="row" className={classes.paperHeader}>
                    <Grid item xs={8}>
                        <Typography className={classes.tableTitle}>
                            {this.header()}
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Grid container direction="row" justify="flex-end">
                            <Grid item className={classes.paperHeaderAction}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            color="primary"
                                            checked={!!this.state.onlyActiveOrLastExpired}
                                            onChange={e => this.toggleCheckbox("onlyActiveOrLastExpired")}
                                        />
                                    }
                                    label={formatMessage(intl, "policy", "policies.onlyActiveOrLastExpired")}
                                />
                            </Grid>
                            {actions.map((a, idx) => {
                                return (
                                    <Grid item key={`form-action-${idx}`} className={classes.paperHeaderAction}>
                                        {withTooltip(a.button, a.tooltip)}
                                    </Grid>
                                )
                            })}
                        </Grid>
                    </Grid>
                </Grid>
                <Divider />
                <Table
                    module="policy"
                    headers={this.headers()}
                    headerActions={this.headerActions()}
                    itemFormatters={this.itemFormatters()}
                    itemIdentifier={this.itemIdentifier}
                    items={policies}
                    fetching={fetchingPolicies}
                    error={errorPolicies}
                    withSelection={"single"}
                    onChangeSelection={this.onChangeSelection}
                    onDoubleClick={this.onDoubleClick}
                    withPagination={true}
                    rowsPerPageOptions={this.rowsPerPageOptions}
                    defaultPageSize={this.defaultPageSize}
                    page={this.state.page}
                    pageSize={this.state.pageSize}
                    count={pageInfo.totalCount}
                    onChangePage={this.onChangePage}
                    onChangeRowsPerPage={this.onChangeRowsPerPage}
                />
            </Paper>
        )
    }
}


const mapStateToProps = state => ({
    rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
    fetchingPolicies: state.policy.fetchingPolicies,
    fetchedPolicies: state.policy.fetchedPolicies,
    policies: state.policy.policies,
    pageInfo: state.policy.policiesPageInfo,
    errorPolicies: state.policy.errorPolicies,
    family: state.insuree.family || {},
    insuree: state.insuree.insuree,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetch: fetchFamilyOrInsureePolicies, selectPolicy }, dispatch);
};

export default withHistory(withModulesManager(connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(withTheme(
        withStyles(styles)(FamilyOrInsureePoliciesSummary)
    ))))
);
