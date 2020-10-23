import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { injectIntl } from 'react-intl';
import { withTheme, withStyles } from "@material-ui/core/styles";
import { historyPush, withModulesManager, withHistory, formatMessageWithValues } from "@openimis/fe-core";
import PolicyForm from "../components/PolicyForm";
import { policyLabel } from "../utils/utils";
import { createPolicy, updatePolicy } from "../actions";

const styles = theme => ({
    page: theme.page,
});

class PolicyPage extends Component {

    save = (policy) => {
        if (!policy.uuid) {
            this.props.createPolicy(
                this.props.modulesManager,
                policy,
                formatMessageWithValues(
                    this.props.intl,
                    "policy",
                    "CreatePolicy.mutationLabel",
                    { policy: policyLabel(this.props.modulesManager, policy) }
                )
            );
        } else {
            this.props.updatePolicy(
                this.props.modulesManager,
                policy,
                formatMessageWithValues(
                    this.props.intl,
                    "policy",
                    "UpdatePolicy.mutationLabel",
                    { policy: policyLabel(this.props.modulesManager, policy) }
                )
            );

        }
    }

    render() {
        const { classes, policy_uuid, family_uuid } = this.props;
        return (
            <div className={classes.page}>
                <PolicyForm
                    policy_uuid={policy_uuid !== '_NEW_' ? policy_uuid : null}
                    family_uuid={family_uuid}
                    back={e => historyPush(modulesManager, history, "policy.route.policies")}
                    save={this.save}
                />
            </div>
        )
    }
}


const mapStateToProps = (state, props) => ({
    rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
    policy_uuid: props.match.params.policy_uuid,
    family_uuid: props.match.params.family_uuid,
})


const mapDispatchToProps = dispatch => {
    return bindActionCreators({ createPolicy, updatePolicy }, dispatch);
};


export default injectIntl(withModulesManager(withHistory(connect(mapStateToProps, mapDispatchToProps)(withTheme(withStyles(styles)(PolicyPage))))));