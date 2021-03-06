import React from "react";
import Filter from "./Menu/Filter";
import SprintTable from "./Menu/SprintTable";


export default class Menu extends React.Component {

    render() {

        var d = new Date(this.props.refreshed);
        var minutes = d.getMinutes();
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        var lastUpdate = d.getHours() + ":" + minutes;

        return (
            <div className="board-menu">

                <div id="board-menu-header"><span>Last update: {lastUpdate}</span><a
                    className="btn btn-link" onClick={this.props.tick.bind(this)} title="Refresh tasks"><i
                    className="fa fa-refresh"></i></a>
                    &nbsp; <a id="board-menu-close" href="#" className="btn btn-link" title="Close menu"><i
                        className="fa fa-times">&nbsp;</i></a>
                </div>

                <div className="board-menu-content">
                    <div className="form pad">
                        <Filter
                            activeSprintId={this.props.activeSprintId}
                            employees={this.props.employees}
                            handleUserInput={this.props.handleUserInput}
                            products={this.props.products}
                            filterBug={this.props.filterBug}
                            filterEmployee={this.props.filterEmployee}
                            filterPreviousSprints={this.props.filterPreviousSprints}
                            filterProduct={this.props.filterProduct}
                            filterSprint={this.props.filterSprint}
                            filterTaskOwner={this.props.filterTaskOwner}
                            filterText={this.props.filterText}
                            sprints={this.props.sprints}
                            taskOwners={this.props.taskOwners}
                        />
                    </div>
                </div>
                <div className="SprintTableContainer">
                    <SprintTable
                        activeSprintId={this.props.activeSprintId}
                        filterPreviousSprints={this.props.filterPreviousSprints}
                        filterSprint={this.props.filterSprint}
                        handleUserClick={this.props.handleUserClick}
                        sprints={this.props.sprints}
                        SprintsClass={this.props.SprintsClass}
                    />
                </div>
                <div className="version">v.: {this.props.version}</div>
            </div>
        );
    }
}
