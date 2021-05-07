import React, { Component } from "react";
import { ConstantBasedPicker } from "@openimis/fe-core";

import { POLICY_STAGE } from "../constants";

class PolicyStagePicker extends Component {

    render() {
        return <ConstantBasedPicker
            module="policy"
            label="PolicyStage"
            constants={POLICY_STAGE}
            {...this.props}
        />
    }
}

export default PolicyStagePicker;