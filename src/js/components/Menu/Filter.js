import React from "react";
import SelectOption from "./SelectOption";
import Select from "./Select";
import SelectMultiple from "./SelectMultiple";


export default class Filter extends React.Component {

    constructor() {

        // Declare a default set of values for the initial state.
        super();
        this.state = {
            selectMultipleTeamMembers: false,
        }
    }

    handleChange() {

        // Pass input values to parent (Layout)
        // If you comment out this line an input field will not change its value.
        // This is because in React, an input cannot change independently of the value
        // that was assigned to it. In our case this is this.state.filterText.

        this.props.handleUserInput(
            {
                filterBug: this.refs.filterBugInput.checked,
                filterPreviousSprints: this.refs.filterPreviousSprintsInput.checked,
                filterProduct: this.refs.filterProductInput.value,
                filterTaskOwner: this.refs.filterTaskOwnerInput.value,
                filterText: this.refs.filterTextInput.value
            }
        );
    }

    toggleMultipleSelect() {

        // Select multiple team member or just one.
        var selectMultipleTeamMembers = this.state.selectMultipleTeamMembers ? false : true;
        this.setState({selectMultipleTeamMembers: selectMultipleTeamMembers});

        if (!selectMultipleTeamMembers) {
            // Going from selecting multiple team members to one
            this.props.handleUserInput(
                {
                    // Update the state to hold one
                    filterEmployee: [this.props.filterEmployee[0]],
                }
            );
        }
    }

    render() {

        var employeeOptions = [];
        this.props.employees.forEach(
            function (employee) {

                // Make the employee select options
                employeeOptions.push(<SelectOption value={employee.label} text={employee.label} key={employee.label}/>);
            }
        );

        var productOptions = [];
        this.props.products.forEach(
            function (product) {
                // Make the product select options
                productOptions.push(<SelectOption value={product} text={product} key={product}/>);
            }
        );

        var taskOwnerOptions = [];
        this.props.taskOwners.forEach(
            function (taskOwner) {
                // Make the task owner select options
                taskOwnerOptions.push(<SelectOption value={taskOwner} text={taskOwner} key={taskOwner}/>);
            }
        );

        var selectTeamMembers = '';
        var toggleSelectTeamMembersClassName = "";
        if (this.state.selectMultipleTeamMembers) {
            // Multi select
            toggleSelectTeamMembersClassName = "fa fa-user";
            selectTeamMembers = <SelectMultiple filterEmployee={this.props.filterEmployee}
                                                handleUserInput={this.props.handleUserInput}
                                                employeeOptions={employeeOptions}/>;
        } else {
            // Select
            toggleSelectTeamMembersClassName = "fa fa-user-plus";
            selectTeamMembers = <Select filterEmployee={this.props.filterEmployee}
                                        handleUserInput={this.props.handleUserInput}
                                        employeeOptions={employeeOptions}/>;
        }

        return (
            <form id="filterForm">
                <div className="row">
                    <div className="col-xs-6">
                        <div className="form-group">
                            <label htmlFor="filterTextInput">Search</label>
                            <input
                                type="text"
                                placeholder="..."
                                value={this.props.filterText}
                                ref="filterTextInput"
                                onChange={this.handleChange.bind(this)}
                                className="form-control"
                                id="filterTextInput"
                            />
                        </div>
                    </div>
                    <div className="col-xs-6">
                        <div className="form-group">
                            <label htmlFor="filterProduct">Product</label>
                            <select
                                value={this.props.filterProduct}
                                ref="filterProductInput"
                                onChange={this.handleChange.bind(this)}
                                className="form-control"
                                id="filterProductInput">
                                <option value="" label="Select"></option>
                                {productOptions}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="filterTaskOwner">Task owner</label>
                    <select
                        value={this.props.taskOwner}
                        ref="filterTaskOwnerInput"
                        onChange={this.handleChange.bind(this)}
                        className="form-control"
                        id="filterTaskOwnerInput">
                        <option value="" label="Select"></option>
                        {taskOwnerOptions}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="Filters_employee">Team member <a title="Previous"
                                                                     onClick={this.toggleMultipleSelect.bind(this)}><i
                        className={toggleSelectTeamMembersClassName}>&nbsp;</i></a></label>
                    {selectTeamMembers}
                </div>
                <div class="row">
                    <div className="col-xs-6">
                        <div className="checkbox">
                            <label title="Show bugs">
                                <input type="checkbox"
                                       checked={this.props.filterBug}
                                       ref="filterBugInput"
                                       onChange={this.handleChange.bind(this)}/> {' '}
                                Bugs
                            </label>
                        </div>
                    </div>
                    <div className="col-xs-6" style={{paddingLeft: +'0'}}>
                        <div className="checkbox">
                            <label title="Include open tickets from previous sprints in selected sprint">
                                <input type="checkbox"
                                       checked={this.props.filterPreviousSprints}
                                       ref="filterPreviousSprintsInput"
                                       onChange={this.handleChange.bind(this)}/> {' '}
                                Previous&nbsp;sprints
                            </label>
                        </div>
                    </div>
                </div>

            </form>
        );
    }
}
