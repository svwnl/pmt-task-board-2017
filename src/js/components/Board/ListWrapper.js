import React from "react";
import List from "./List";

export default class ListWrapper extends React.Component {

    // List wrappers (columns) can have on or more lists,
    // add the required lists to each wrapper.

    render() {

        var lists = [];

        for (var i = this.props.lists.length - 1; i >= 0; --i) {

            lists.push(<List
                key={i}
                activeSprintId ={this.props.activeSprintId}
                category={this.props.lists[i].category}
                filterBug={this.props.filterBug}
                filterEmployee={this.props.filterEmployee}
                filterPreviousSprints={this.props.filterPreviousSprints}
                filterProduct={this.props.filterProduct}
                filterSprint={this.props.filterSprint}
                filterTaskOwner={this.props.filterTaskOwner}
                filterText={this.props.filterText}
                list={this.props.lists[i]}
                sprints={this.props.sprints}
                SprintsClass={this.props.SprintsClass}
                tasks={this.props.tasks}
            />);
        }

        return (<div className="list-wrapper">{lists}</div>);
    }
}
