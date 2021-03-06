import React from "react";

import SprintTableRow from "./SprintTableRow";

export default class SprintTable extends React.Component {

    constructor() {

        // ES6 constructor replaces getInitialState() to declare a default set of values for the initial state.
        // When you think of state, you should think of an internal data-set which affects the rendering of components.
        // State should be considered private data.

        super();
        this.state = {
            offset: 0, // Offset from default
        };
    }

    next(offset) {

        // Navigate through the sprint calendar by setting the offset from the current sprint
        var newOffset = 0;
        var offset = parseInt(offset);
        if (offset < 0 || offset > 0) {
            // Add or subtract from the offset
            newOffset = this.state.offset + offset;
        }
        this.setState({offset: newOffset});
    }

    render() {

        /* Add table rows */
        var rows = [];
        var count = 0;
        var max = 7;
        var history = 3;
        var start = 0;

        var length = this.props.sprints.length;
        var offset = this.state.offset * max;
        for (var i = 0; i < length; i++) {
            var sprint = this.props.sprints[i];
            if (sprint.id == this.props.activeSprintId) {
                start = i - history + offset;
                if (start < 0) {
                    start = 0;
                }
            }
        }

        // Get the acceptance date of the active sprint
        let activeSprintAcceptance = '';
        let activeSprint = null;
        if ('' != this.props.SprintsClass) {
            activeSprint = this.props.SprintsClass.getSprint(this.props.activeSprintId);
            activeSprintAcceptance = activeSprint.acceptance;
        }


        for (var i = 0; i < length; i++) {
            var sprint = this.props.sprints[i];
            if (i >= start && count < max) {
                count++;
                rows.push(<SprintTableRow key={sprint.id}
                                          filterPreviousSprints={this.props.filterPreviousSprints}
                                          activeSprintId={this.props.activeSprintId}
                                          filterSprint={this.props.filterSprint}
                                          handleUserClick={this.props.handleUserClick}
                                          sprint={sprint}
                                          activeSprintAcceptance={activeSprintAcceptance} />);
            }
        }

        return (
            <div>
                <div className="row">
                    <div className="col-xs-4"><a className="btn btn-block btn-link" title="Previous"
                                                 onClick={this.next.bind(this, -1)}><i
                        className="fa fa-chevron-left">&nbsp;</i></a></div>
                    <div className="col-xs-4"><a className="btn btn-block btn-link" title="Current sprint"
                                                 onClick={this.next.bind(this, 0)}><i class="fa fa-flag"></i></a></div>
                    <div className="col-xs-4"><a className="btn btn-block btn-link" title="Next"
                                                 onClick={this.next.bind(this, 1)}><i
                        className="fa fa-chevron-right">&nbsp;</i></a></div>
                </div>
                <table className="table table-condensed release-table" id="release-table">
                    <thead>
                    <tr>
                        <th title="Sprint number">Sprint</th>
                        <th title="Sprint start date">Start</th>
                        <th title="Acceptance release date">Acc</th>
                        <th title="Production release date">Prod</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows}
                    </tbody>
                </table>
            </div>
        )
    }
}
