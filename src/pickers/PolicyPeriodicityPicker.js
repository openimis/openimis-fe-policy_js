import React, { Component } from "react";
import { ConstantBasedPicker } from "@openimis/fe-core";

import { PERIODICITY_VALUES } from "../constants";

class PolicyPeriodicityPicker extends Component {

    render() {
        return <ConstantBasedPicker
            module="policy"
            label="Periodicity"
            constants={PERIODICITY_VALUES}
            {...this.props}
        />
    }
}

export default PolicyPeriodicityPicker;