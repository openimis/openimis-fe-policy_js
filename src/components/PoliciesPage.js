import React, { Component } from "react";
import { ProxyPage } from "@openimis/fe-core";


class PoliciesPage extends Component {
    render() {
        return <ProxyPage url="/FindPolicy.aspx" />
    }
}

export { PoliciesPage };