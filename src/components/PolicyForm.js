import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import { withTheme, withStyles } from "@material-ui/core/styles";
import {
    historyPush, withModulesManager, withHistory,
    formatMessageWithValues,
    ProgressOrError, Form, Contributions,
} from "@openimis/fe-core";
import PolicyMasterPanel from "./PolicyMasterPanel";
import PolicyValuesPanel from "./PolicyValuesPanel";
import { fetchPolicyFull } from "../actions";
import { policyLabel } from "../utils/utils";
import { RIGHT_POLICY } from "../constants";

const styles = theme => ({
    page: theme.page,
});

const POLICY_HEAD_PANEL_CONTRIBUTION_KEY = "policy.Policy.headPanel";

class PolicyForm extends Component {

    state = {
        lockNew: false,
        reset: 0,
        policy: this._newPolicy(),
        newInsuree: true,
    }

    _newPolicy() {
        let policy = {};
        policy.jsonExt = {};
        return policy;
    }

    componentDidMount() {
        document.title = formatMessageWithValues(this.props.intl, "policy", "Policy.title", { label: "" })
        if (!!this.props.policy_uuid) {
            this.setState(
                (state, props) => ({ policy_uuid: props.policy_uuid }),
                e => this.props.fetchPolicyFull(
                    this.props.modulesManager,
                    this.props.policy_uuid
                )
            )
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if ((prevState.policy && prevState.policy.uuid)
            !== (this.state.policy && this.state.policy_uuid)) {
            document.title = formatMessageWithValues(
                this.props.intl, "policy", "Policy.title",
                { label: policyLabel(this.props.modulesManager, this.state.policy) }
            )
        }
        if (prevProps.fetchedPolicy !== this.props.fetchedPolicy && !!this.props.fetchedPolicy) {
            var policy = this.props.policy || {};
            policy.ext = !!policy.jsonExt ? JSON.parse(policy.jsonExt) : {};
            this.setState(
                { policy, policy_uuid: policy.uuid, lockNew: false, newPolicy: false });
        } else if (prevProps.policy_uuid && !this.props.policy_uuid) {
            document.title = formatMessageWithValues(
                this.props.intl, "policy", "Policy.title",
                { label: policyLabel(this.props.modulesManager, this.state.policy) })
            this.setState({ policy: this._newPolicy(), newPolicy: true, lockNew: false, policy_uuid: null });
        }
    }

    back = e => {
        const { modulesManager, history, family_uuid, policy_uuid } = this.props;
        if (family_uuid) {
            historyPush(modulesManager,
                history,
                "insuree.route.familyOverview",
                [family_uuid]
            );
        } else {
            historyPush(modulesManager,
                history,
                "policy.route.policies"
            );
        }
    }

    render() {
        const { classes, rights,
            policy_uuid,
            fetchingPolicy, fetchedPolicy, errorPolicy,
            readOnly = true,
        } = this.props;
        const { policy } = this.state;
        if (!rights.includes(RIGHT_POLICY)) return null;
        return (
            <Fragment>
                <ProgressOrError progress={fetchingPolicy} error={errorPolicy} />
                {((!!fetchedPolicy && !!policy && policy.uuid === policy_uuid) || !policy_uuid) &&
                    (
                        <Form
                            module="policy"
                            title="Policy.title"
                            titleParams={{
                                label: policyLabel(
                                    this.props.modulesManager, this.state.policy
                                )
                            }}
                            edited_id={policy_uuid}
                            edited={this.state.policy}
                            reset={this.state.reset}
                            back={this.back}
                            readOnly={readOnly || !!policy.validityTo}
                            headPanelContributionsKey={POLICY_HEAD_PANEL_CONTRIBUTION_KEY}
                            family_uuid={policy.family.uuid}
                            Panels={[PolicyMasterPanel]}
                        />
                    )}

            </Fragment>
        )
    }
}


const mapStateToProps = state => ({
    rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
    fetchingPolicy: state.policy.fetchingPolicy,
    errorPolicy: state.policy.errorPolicy,
    fetchedPolicy: state.policy.fetchedPolicy,
    policy: state.policy.policy,
})

export default injectIntl(withModulesManager(withHistory(connect(mapStateToProps, { fetchPolicyFull })(withTheme(withStyles(styles)(PolicyForm))))));