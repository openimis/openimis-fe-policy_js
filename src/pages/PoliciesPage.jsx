import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { styled } from "@mui/material/styles";
import {
  historyPush,
  withModulesManager,
  withHistory,
  clearCurrentPaginationPage,
  injectIntl,
} from "@openimis/fe-core";
import PolicySearcher from "../components/PolicySearcher";

const StyledPage = styled('div')(({ theme }) => ({
  ...(theme?.page ?? {}),
}));

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

  componentDidMount = () => {
    const moduleName = "policy";
    const { module } = this.props;
    if (module !== moduleName) this.props.clearCurrentPaginationPage();
  };

  render() {
    return (
      <StyledPage>
        <PolicySearcher
          cacheFiltersKey="policyPoliciesPageFiltersCache"
          onDoubleClick={this.onDoubleClick}
        />
      </StyledPage>
    );
  }
}

const mapStateToProps = (state) => ({
  rights:
    !!state.core && !!state.core.user && !!state.core.user.i_user
      ? state.core.user.i_user.rights
      : [],
  module: state.core?.savedPagination?.module,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({ clearCurrentPaginationPage }, dispatch);

export { StyledPage };
export { PoliciesPage };
export default injectIntl(
  withModulesManager(
    withHistory(
      connect(mapStateToProps, mapDispatchToProps)(PoliciesPage)
    )
  )
);
