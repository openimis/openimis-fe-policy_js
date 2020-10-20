import React, { Component } from "react";
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import { withTheme, withStyles } from "@material-ui/core/styles";
import { historyPush, withModulesManager, withHistory } from "@openimis/fe-core";
import PolicyForm from "../components/PolicyForm";

const styles = theme => ({
    page: theme.page,
});

class PolicyPage extends Component {
    render() {
        const { classes, policy_uuid, family_uuid } = this.props;
        return (
            <div className={classes.page}>
                <PolicyForm
                    policy_uuid={policy_uuid !== '_NEW_' ? policy_uuid :  null}
                    family_uuid={family_uuid}
                    back={e => historyPush(modulesManager, history, "policy.route.policies")}
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

export default injectIntl(withModulesManager(withHistory(connect(mapStateToProps)(withTheme(withStyles(styles)(PolicyPage))))));