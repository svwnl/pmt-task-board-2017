import React from "react";

export default class SelectOption extends React.Component {

    // Form select option

    render() {
        return (<option value={this.props.value}>{this.props.text}</option>);
    }
}
