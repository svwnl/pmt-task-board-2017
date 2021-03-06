import React from "react";
import Card from "./Card";
import SprintTag from "../Sprint/SprintTag";
import SprintClass from "../Sprint/SprintClass";

export default class List extends React.Component {

    /**
     * @description determine if an array contains one or more items from another array.
     * @param {array} haystack the array to search.
     * @param {array} arr the array providing items to check for in the haystack.
     * @return {boolean} true|false if haystack contains at least one item from arr.
     */
    findOne (haystack, arr) {
        return arr.some(function (v) {
            return haystack.indexOf(v) >= 0;
        });
    };

    render() {

        var rows = [];
        var countTasks = 0;
        var countBugs = 0;
        var filterText = this.props.filterText ? this.props.filterText.toLowerCase() : ''; // case insensitive search

        // Sprint information in list header

        // If no sprint has been selected cards for all sprints will be displayed,
        // but show information about the active sprint in the header.
        var sprintId = '' == this.props.filterSprint ? this.props.activeSprintId : this.props.filterSprint;

        var sprint = null;
        var sprintNumber = '';
        var activeSprintAcceptance = '';
        if ('' != this.props.SprintsClass) {
            sprint = this.props.SprintsClass.getSprint(sprintId);
            // Number of the selected or else active sprint
            sprintNumber = sprint.number;
            activeSprintAcceptance = sprint.acceptance;
        }

        this.props.tasks.forEach(function (task) {

            // Filter tickets

            if('' != this.props.filterSprint && task.sprintId != '' && task.sprintId != 0 ){

                // If a sprint has been selected filter tickets on sprint,
                // except for tickets not in a sprint

                if(this.props.filterPreviousSprints){

                    // Filter out tickets in sprints after the selected sprint

                    if (task.acceptance > activeSprintAcceptance){
                        // Ticket in sprint after selected sprint
                        return ;
                    }
                }
                else {

                    // filter out tickets in all other sprints

                    if ( task.sprintId != this.props.filterSprint) {
                        // Ticket not in the selected sprint
                        return;
                    }
                }
            }

            if (task.category != this.props.category) {
                // Ticket not in the selected category
                return;
            }

            if ('' != this.props.filterEmployee && !this.findOne(this.props.filterEmployee, task.employee)) {
                // Ticket not for the selected team member
                return;
            }

            if ('' != this.props.filterTaskOwner && task.task_owner != this.props.filterTaskOwner) {
                // Ticket does not have selected task owner
                return;
            }

            if (false === this.props.filterBug && 'B' == task.type) {
                // Filter out bugs
                return;
            }

            if ('' != this.props.filterProduct && task.product != this.props.filterProduct) {
                // Ticket not in the selected product group
                return;
            }

            // Counting tickets in the right category and for the selected employee
            if ('B' == task.type) {
                // Bugs
                countBugs++;
            }
            else {
                // Tasks
                countTasks++;
            }

            if (filterText) {
                // Include B, P or T in the search:  T1234
                var taskName = task.type + task.name + ' ';
                // Include project in search. Allow for search on P# or p# to search on project
                var projectName = 'p' + task.project + ' ';
                if (taskName.toLowerCase().indexOf(filterText) === -1 && task.description.toLowerCase().indexOf(filterText) === -1 && projectName.indexOf(filterText) === -1) {
                    // Does not match the search text
                    return;
                }
            }

            // Add the card to the list
            rows.push(<Card task={task} key={task.name}/>);

        }.bind(this));


        var date = "";
        var title = "";
        if (null != sprint) {

            title = SprintClass.dateFormat(sprint.start) + " start | " + SprintClass.dateFormat(sprint.acceptance) + " acc | " + SprintClass.dateFormat(sprint.production) + " prod";

            // Show release date in the header of the production and acceptance list
            if(this.props.category == 'production' || this.props.category == 'acceptance'){
                date = this.props.category.indexOf('prod') === -1 ? sprint.acceptance : sprint.production;
                date = SprintClass.dateFormat(date) + ' ';
            }
        }

        return (
            <div className="list" id="listBacklog">
                <div className="list-header toggle-head">
                    <div className="list-header-name" title={title}>{this.props.list.title}
                        <div className="list-label">
                            {date}<SprintTag sprintId={sprintNumber} alignTag="right"/>
                        </div>
                    </div>
                    <div className="list-header-details">
                        <span
                            title="Bugs in list assigned to selected team member">{this.props.filterBug ? 'Bugs ' + countBugs : ''}</span> {this.props.filterBug ? '| ' : ''}
                        <span title="Tasks in list assigned to selected team member">Tasks {countTasks}</span>
                    </div>
                </div>
                <div className="list-cards toggle-body">{rows}</div>
            </div>);
    }
}
