import React from "react";

import SprintTag from "../Sprint/SprintTag";
import SprintClass from "../Sprint/SprintClass";

export default class SprintTableRow extends React.Component {

    handleClick(sprintId) {
        this.props.handleUserClick(sprintId);
    }

    flagActiveSprint() {
        if (this.props.activeSprintId == this.props.sprint.id) {
            return <span className="release-flag" title="Current sprint"><i className="fa fa-flag"></i></span>;
        }
    }


    static glue(text, append, delimiter = ' ') {
        if ('' != text) {
            return text + delimiter + append;
        }
        return append;
    }

    highlightTableRow() {

        // Highlight row based on the sprint

        var className = '';

        if (this.props.activeSprintId == this.props.sprint.id) {
            // Active sprint
            className = SprintTableRow.glue(className, 'active');
        }

        if (this.props.filterSprint == this.props.sprint.id) {
            // Selected sprint
            className = SprintTableRow.glue(className, 'selected');
        }

        if ('' != this.props.filterSprint) {

            if (this.props.filterPreviousSprints) {

                // Highlight previous sprints of the selected or else active sprint
                // Include the selected or else the active sprint

                if (this.props.sprint.acceptance <= this.props.activeSprintAcceptance) {
                    // Selected, active sprint or previous sprint
                    className = SprintTableRow.glue(className, 'highlight');
                }
            }
        } else {

            // No sprint selected, highlight all
            className = SprintTableRow.glue(className, 'highlight');
        }

        return className;
    }

    render() {

        return (
            <tr className={this.highlightTableRow()} onClick={this.handleClick.bind(this, this.props.sprint.id)}>
                <td className="sprint-label text-left">
                    <SprintTag sprintId={this.props.sprint.number} key={this.props.sprint.id}
                               alignTag="left"/>{this.flagActiveSprint()}
                </td>
                <td className="release-date">
                    <span>{SprintClass.dateFormat(this.props.sprint.start)}</span></td>
                <td className="release-date"><span>{SprintClass.dateFormat(this.props.sprint.acceptance)}</span></td>
                <td className="release-date"><span>{SprintClass.dateFormat(this.props.sprint.production)}</span></td>
            </tr>)

    }
}
