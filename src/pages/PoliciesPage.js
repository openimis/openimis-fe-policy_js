import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import { withTheme, withStyles } from "@material-ui/core/styles";
import { historyPush, withModulesManager, withHistory, decodeId } from "@openimis/fe-core";
import PrintIcon from "@material-ui/icons/ListAlt";
import PolicySearcher from "../components/PolicySearcher";
import { print } from "../actions";

const styles = theme => ({
    page: theme.page,
});

class PoliciesPage extends Component {

    onDoubleClick = (p, newTab = false) => {
        historyPush(this.props.modulesManager, this.props.history, "policy.route.policy", [p.uuid], newTab)
    }

    printSelected = (selection) => {
        this.props.print(selection.map((i) => decodeId(i.family.headInsuree.id)));
    };

    canPrintSelected = (selection) =>
        !!selection && selection.length;

    render() {
        const { classes } = this.props;
        var actions = [];
        actions.push({
            label: "policySummaries.printSelected",
            action: this.printSelected,
            enabled: this.canPrintSelected,
            icon: <PrintIcon />,
        });
        return (
            <div className={classes.page}>
                <PolicySearcher
                    cacheFiltersKey="policyPoliciesPageFiltersCache"
                    onDoubleClick={this.onDoubleClick}
                    actions={actions}
                />
            </div >
        )
    }
}

const mapStateToProps = state => ({
    rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
})

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(
        {
            print
        },
        dispatch,
    );
};

export default injectIntl(withModulesManager(withHistory(connect(mapStateToProps, mapDispatchToProps)(withTheme(withStyles(styles)(PoliciesPage))))));