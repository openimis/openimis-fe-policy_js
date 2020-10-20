import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { injectIntl } from 'react-intl';
import { fetchPolicyOfficers } from "../actions";
import { formatMessage, AutoSuggestion, ProgressOrError, withModulesManager, decodeId } from "@openimis/fe-core";

const styles = theme => ({
    label: {
        color: theme.palette.primary.main
    }
});

class PolicyOfficerPicker extends Component {

    constructor(props) {
        super(props);
        this.selectThreshold = props.modulesManager.getConf("fe-policy", "PolicyOfficer.selectThreshold", 10);
    }

    componentDidMount() {
        if (!this.props.fetchedPolicyOfficers) {
            // prevent loading multiple times the cache when component is
            // several times on tha page
            setTimeout(
                () => {
                    !this.props.fetchingPolicyOfficers && this.props.fetchPolicyOfficers(this.props.modulesManager)
                },
                Math.floor(Math.random() * 300)
            );
        }
    }

    formatSuggestion = a => !a ? "" : `${a.code} ${a.lastName} ${a.otherName || ""}`;

    onSuggestionSelected = v => this.props.onChange(v, this.formatSuggestion(v));

    render() {
        const {
            intl, value, reset, policyOfficers,
            fetchingPolicyOfficers, fetchedPolicyOfficers, errorPolicyOfficers,
            withLabel = true, label, readOnly = false, required = false,
            withNull = false, nullLabel = null,
        } = this.props;
        let v = policyOfficers ? policyOfficers.filter(o => !!value && o.id === value.id) : [];
        v = v.length ? v[0] : null;
        return (
            <Fragment>
                <ProgressOrError progress={fetchingPolicyOfficers} error={errorPolicyOfficers} />
                {fetchedPolicyOfficers && (
                    <AutoSuggestion
                        module="policy"
                        items={policyOfficers}
                        label={!!withLabel && (label || formatMessage(intl, "policy", "PolicyOfficerPicker.label"))}
                        getSuggestions={this.policyOfficers}
                        getSuggestionValue={this.formatSuggestion}
                        onSuggestionSelected={this.onSuggestionSelected}
                        value={v}
                        reset={reset}
                        readOnly={readOnly}
                        required={required}
                        selectThreshold={this.selectThreshold}
                        withNull={withNull}
                        nullLabel={nullLabel || formatMessage(intl, "policy", "policy.PolicyOfficerPicker.null")}
                    />
                )}
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    policyOfficers: state.policy.policyOfficers,
    fetchingPolicyOfficers: state.policy.fetchingPolicyOfficers,
    fetchedPolicyOfficers: state.policy.fetchedPolicyOfficers,
    errorPolicyOfficers: state.policy.errorPolicyOfficers,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchPolicyOfficers }, dispatch);
};

export default withModulesManager(
    connect(mapStateToProps, mapDispatchToProps)(injectIntl(withTheme(withStyles(styles)(PolicyOfficerPicker))))
);
