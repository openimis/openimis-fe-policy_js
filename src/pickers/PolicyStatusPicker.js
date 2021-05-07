import React, { Component } from "react";
import { ConstantBasedPicker } from "@openimis/fe-core";

import { POLICY_STATUS } from "../constants";

class PolicyStatusPicker extends Component {

    render() {
        return <ConstantBasedPicker
            module="policy"
            label="PolicyStatus"
            constants={POLICY_STATUS}
            {...this.props}
        />
    }
}

export default PolicyStatusPicker;