import React from "react";
import ListWrapper from "./Board/ListWrapper";

export default class Board extends React.Component {
    render() {

        // List wrappers (columns) can have on or more lists in them,
        // hence the extra step of pushing lists to ListWrapper.

        var columns = [
            [{"category": "production", "title": "production", "toggle": true}, {
                "category": "ready for prod",
                "title": "ready for prod",
                "toggle": true
            }],
            [{"category": "acceptance", "title": "acceptance", "toggle": true}, {
                "category": "ready for acc",
                "title": "ready for acc",
                "toggle": true
            }],
            [{"category": "tester approved", "title": "tester approved", "toggle": true}, {
                "category": "test",
                "title": "test",
                "toggle": true
            }],
            [{"category": "deploy to test", "title": "deploy to test", "toggle": true}, {
                "category": "development",
                "title": "development",
                "toggle": true
            }],
            [{"category": "backlog", "title": "backlog", "toggle": true}]
        ];

        var listWrappers = [];

        for (var i = columns.length - 1; i >= 0; --i) {

            listWrappers.push(<ListWrapper
                key={'ListWrapper' + i}
                activeSprintId={this.props.activeSprintId}
                filterBug={this.props.filterBug}
                filterEmployee={this.props.filterEmployee}
                filterPreviousSprints={this.props.filterPreviousSprints}
                filterProduct={this.props.filterProduct}
                filterSprint={this.props.filterSprint}
                filterTaskOwner={this.props.filterTaskOwner}
                filterText={this.props.filterText}
                lists={columns[i]}
                sprints={this.props.sprints}
                SprintsClass={this.props.SprintsClass}
                tasks={this.props.tasks}
            />)
        }

        return (
            <div className="u-fancy-scrollbar" id="board">{listWrappers}</div>
        );
    }
}
