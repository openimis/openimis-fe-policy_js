import React, { Component } from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { withTheme, withStyles } from "@material-ui/core/styles";
import {
  historyPush,
  withModulesManager,
  withHistory,
} from "@openimis/fe-core";
import PolicySearcher from "../components/PolicySearcher";

const styles = (theme) => ({
  page: theme.page,
});

class PoliciesPage extends Component {
  onDoubleClick = (p, newTab = false) => {
    historyPush(
      this.props.modulesManager,
      this.props.history,
      "policy.route.policy",
      [p.uuid],
      newTab
    );
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.page}>
        <PolicySearcher
          cacheFiltersKey="policyPoliciesPageFiltersCache"
          onDoubleClick={this.onDoubleClick}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  rights:
    !!state.core && !!state.core.user && !!state.core.user.i_user
      ? state.core.user.i_user.rights
      : [],
});

export default injectIntl(
  withModulesManager(
    withHistory(
      connect(mapStateToProps)(withTheme(withStyles(styles)(PoliciesPage)))
    )
  )
);
