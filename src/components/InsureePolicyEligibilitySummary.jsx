import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { styled } from "@mui/material/styles";
import { Grid } from "@mui/material";
import {
    withModulesManager,
    ProgressOrError, PublishedComponent, FormattedMessage, AmountInput, TextInput, injectIntl
} from "@openimis/fe-core";
import { fetchFamilyOrInsureePolicies } from "../actions";

const StyledItem = styled('div')(({ theme }) => ({
  ...theme?.paper?.item,
}));

class InsureePolicyEligibilitySummary extends Component {

    state = {
        policies: []
    }

    constructor(props) {
        super(props);
        this.activePolicyStatus = JSON.parse(props.modulesManager.getConf("fe-policy", "activePolicyStatus", '["2", "A"]'));
    }

    componentDidMount() {
        if (this.props.insuree) {
            this.props.fetchFamilyOrInsureePolicies(
                this.props.modulesManager,
                [
                  `chfId:"${this.props.insuree.chfId}"`,
                  this.props?.targetDate ? `targetDate:"${this.props.targetDate}"` : ''
                ]
            )
        } else {
            this.setState({ policies: [] })
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!!prevProps.insuree && !this.props.insuree) {
            this.setState({ policies: [] })
            return;
        }
        if ((!prevProps.insuree && !!this.props.insuree) ||
            !!prevProps.insuree && !!this.props.insuree &&
            (
                prevProps.insuree.chfId == null
                || prevProps.insuree.chfId !== this.props.insuree.chfId
            )
        ) {
            this.setState(
                { policies: [] },
                e => {
                    this.props.fetchFamilyOrInsureePolicies(
                        this.props.modulesManager,
                      [
                        `chfId:"${this.props.insuree.chfId}"`,
                        this.props?.targetDate ? `targetDate:"${this.props.targetDate}"` : ''
                      ]
                    )
                }
            )
            return;
        }
        if (this.props?.insuree && prevProps.targetDate !== this.props.targetDate) {
          this.setState(
            { policies: [] },
            e => {
              this.props.fetchFamilyOrInsureePolicies(
                this.props.modulesManager,
                [
                  `chfId:"${this.props.insuree.chfId}"`,
                  this.props?.targetDate ? `targetDate:"${this.props.targetDate}"` : ''
                ]
              )
            }
          )
          return;
        }
        if (!prevProps.fetchedPolicies && this.props.fetchedPolicies) {
            this.setState((state, props) => ({ policies: props.policies }))
        }
    }

    render() {
        const { fetchingPolicies, fetchedPolicies, errorPolicies } = this.props;
        const { policies } = this.state;
        var activePolicies = !!policies && policies.filter(p => this.activePolicyStatus.some(s => s == p.status));
        return (
            <Fragment>
                <ProgressOrError progress={fetchingPolicies} error={errorPolicies} />
                {!!fetchedPolicies && !activePolicies.length &&
                    <Grid component={StyledItem}>
                        <FormattedMessage module="policy" id="policies.noActivePolicy" />
                    </Grid>
                }
                {!!fetchedPolicies && !!activePolicies.length && (
                    <Grid>
                        <Grid container>
                            {activePolicies.map((activePolicy, i) => (
                                <Fragment key={`activePolicy-${i}`}>
                                    <Grid size={2} component={StyledItem}>
                                        <TextInput
                                            value={activePolicy.productCode}
                                            module="policy"
                                            label="policy.policies.productCode"
                                            readOnly={true}
                                        />
                                    </Grid>
                                    <Grid size={4} component={StyledItem}>
                                        <TextInput
                                            value={activePolicy.productName}
                                            module="policy"
                                            label="policy.policies.productName"
                                            readOnly={true}
                                        />
                                    </Grid>
                                    <Grid size={3} component={StyledItem}>
                                        <PublishedComponent pubRef="core.DatePicker"
                                            value={activePolicy.expiryDate}
                                            module="policy"
                                            label="policies.expiryDate"
                                            readOnly={true}
                                        />
                                    </Grid>
                                    <Grid size={3} component={StyledItem}>
                                        <AmountInput
                                            value={(activePolicy.ceiling || 0)}
                                            module="policy"
                                            label="policies.balance"
                                            readOnly={true}
                                            displayZero={true}
                                        />
                                    </Grid>
                                </Fragment>
                            ))}
                        </Grid>
                    </Grid>
                )}
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    fetchingPolicies: state.policy.fetchingPolicies,
    fetchedPolicies: state.policy.fetchedPolicies,
    policies: state.policy.policies,
    errorPolicies: state.policy.errorPolicies,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchFamilyOrInsureePolicies }, dispatch);
};

export { StyledItem };
export { InsureePolicyEligibilitySummary };
export default withModulesManager(connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(InsureePolicyEligibilitySummary)
));
