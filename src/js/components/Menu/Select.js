import React from "react";


export default class Select extends React.Component {

    // Form select option

    handleChange() {

        // Pass input values to parent (Layout)
        // If you comment out this line an input field will not change its value.
        // This is because in React, an input cannot change independently of the value
        // that was assigned to it. In our case this is this.state.filterText.

        this.props.handleUserInput(
            {
                // Has to be an array because selecting more than one team member is an option
                filterEmployee: [this.refs.filterEmployeeInput.value],
            }
        );
    }


    render() {

        //var propsFilterEmployee = this.props.filterEmployee[0] ? this.props.filterEmployee[0]  : '';

        return (<select value={this.props.filterEmployee[0]} ref="filterEmployeeInput"
                        onChange={this.handleChange.bind(this)} className="form-control" id="filterEmployeeInput">
            <option value="" label="Select"></option>
            {this.props.employeeOptions}
        </select>);
    }
}