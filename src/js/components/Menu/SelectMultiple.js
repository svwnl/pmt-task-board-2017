import React from "react";
import ReactDOM from "react-dom";


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
                filterEmployee: this.getMultipleSelectOptions(),
            }
        );
    }


    getMultipleSelectOptions() {

        var value = [];

        // Select multiple
        // Multiple select options can be selected, iterate over all options

        var select = ReactDOM.findDOMNode(this.refs.filterEmployeeInput);
        var options = select.options;
        for (var i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
                value.push(options[i].value);
            }
        }

        return value;
    }

    render() {
        return (<select value={this.props.filterEmployee}
                        ref="filterEmployeeInput"
                        onChange={this.handleChange.bind(this)}
                        className="form-control"
                        id="filterEmployeeInput"
                        multiple>
            <option value="" label="Select"></option>
            {this.props.employeeOptions}
        </select>);
    }
}