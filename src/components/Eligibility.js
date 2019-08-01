import React, { Component } from "react";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { FormattedDate } from 'react-intl';
import { withModulesManager, FieldLabel, SmallTable } from "@openimis/fe-core";
import ThumbUp from "@material-ui/icons/ThumbUp";
import ThumbDown from "@material-ui/icons/ThumbDown";

const styles = theme => ({
});

class Eligibility extends Component {
    render() {
        const { modulesManager, eligibility } = this.props;
        let itemFormatters = [];
        if (!modulesManager.skipControl("policy", "insureeEligibility.minDate")) {
            itemFormatters.push(
                i => <FieldLabel module="policy" id="insureeEligibility.minDate" />,
                i => !!i.minDate ? <FormattedDate value={i.minDate} /> : null
            );
        }
        if (!modulesManager.skipControl("policy", "insureeEligibility.left")) {
            itemFormatters.push(
                i => <FieldLabel module="policy" id="insureeEligibility.left" />,
                i => i.left
            );
        }
        if (!modulesManager.skipControl("policy", "insureeEligibility.isOk")) {
            itemFormatters.push(i => i.isOk ? <ThumbUp /> : <ThumbDown />);
        }

        return (
            <SmallTable
                items={[eligibility]}
                itemFormatters={itemFormatters}
            />
        )
    }
}

export default withModulesManager(withTheme(withStyles(styles)(Eligibility)));