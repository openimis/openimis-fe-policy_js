import React, { Component } from "react";
import { ConstantBasedPicker } from "@openimis/fe-core";

import { PAYMENT_DAY } from "../constants";

class PolicyPaymentDayPicker extends Component {

    render() {
        return <ConstantBasedPicker
            module="policy"
            label="PaymentDay"
            constants={PAYMENT_DAY}
            {...this.props}
        />
    }
}

export default PolicyPaymentDayPicker;