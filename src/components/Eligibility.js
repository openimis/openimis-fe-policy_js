import React, { Component } from "react";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { FormattedDate } from 'react-intl';
import { FieldLabel, SmallTable } from "@openimis/fe-core";
import ThumbUp from "@material-ui/icons/ThumbUp";
import ThumbDown from "@material-ui/icons/ThumbDown";

const styles = theme => ({
});

class Eligibility extends Component {
    render() {
        const { eligibility } = this.props;
        return (            
            <SmallTable 
                items={[eligibility]}
                itemFormatters={[
                    i => <FieldLabel module="policy" id="insureeEligibility.minDate" />,
                    i => !!i.minDate ? <FormattedDate value={i.minDate} />: null,
                    i => <FieldLabel module="policy" id="insureeEligibility.left" />,
                    i => i.left,
                    i => i.isOk ? <ThumbUp/> : <ThumbDown/>
                ]}
            />
        )
    }
}

export default withTheme(withStyles(styles)(Eligibility));