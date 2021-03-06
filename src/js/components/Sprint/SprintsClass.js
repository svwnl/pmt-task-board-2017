import React from "react";

import SprintClass from "./SprintClass";

export default class SprintsClass extends React.Component {

    // sprints: JSON
    constructor(sprints) {

        // ES6 constructor replaces getInitialState() to declare a default set of values for the initial state.
        // When you think of state, you should think of an internal data-set which affects the rendering of components.
        // State should be considered private data.

        super();
        // this.state = {
        //     sprints: []
        // };
        this.sprints = [];
        this.active = null;

        this.setSprints(this._editSprints(sprints));
    }

    // Edit the received sprints json before setting
    _editSprints(sprints) {

        var day = 86400;
        var previousAcceptance = 0;
        var editedSprints = [];

        sprints.forEach(function (s) {

            // Use the name of the sprint as id,
            // because the name of the sprint is used as the identifier in the tasks and bugs
            s.id = s.sprint;

            // Extract a sprint number from the sprint name,
            // this is not an id but is used to show next to the sprint labels
            s.number = SprintClass.getSprintNumber(s.sprint);

            // Set sprint start, acceptance and production unix time (milliseconds)
            // Sprint starts a day after the previous acceptance date GMT+2:00 DST
            s.start = parseInt(previousAcceptance) + day * 1000;
            s.acceptance = parseInt(s.acceptance) * 1000;
            s.production = parseInt(s.production) * 1000;
            previousAcceptance = s.acceptance;

            //console.log('id ' + s.id + ' number ' + s.number + ' start ' + s.start + ' acceptance ' + s.acceptance + ' production ' + s.production);

            editedSprints.push(s);
        });

        return editedSprints;

    }

    setSprints(sprints) {
        this.sprints = sprints;
    }

    getSprints() {
        return this.sprints;
    }

    getSprint(id) {
        if (null === id && null != this.active) {
            id = this.active;
        }
        for (var i = this.sprints.length - 1; i >= 0; --i) {
            var sprint = this.sprints[i];
            if (id == sprint.id) {
                return sprint;
            }
        }

        return null;
    }

    getActiveSprintId() {

        if (null != this.active) {
            return this.active;
        }
        // Active not set, set it and return result
        return this.setActiveSprintId();
    }

    setActiveSprintId() {

        var sprints = this.sprints;
        // id = string
        var id = null;
        // Today
        var milliseconds = new Date().getTime();
        // 1 day in milliseconds
        var one_day = 1000 * 60 * 60 * 24;
        // Today's date minus the hours, minutes and milliseconds
        milliseconds = milliseconds - (milliseconds % one_day);
        // Compare today with sprint dates
        for (var i = sprints.length - 1; i >= 0; --i) {
            if (milliseconds < parseInt(sprints[i].start)) {
                // Sprint has not yet started.
                // Check the next sprint.
                continue;
            }
            if (milliseconds <= parseInt(sprints[i].production)) {
                // Sprint has started and is not past production release date.
                // Maybe, but search for a better option.
                id = sprints[i].id;
            }
            if (milliseconds <= parseInt(sprints[i].acceptance)) {
                // Sprint has started and is not past acceptance release date.
                // Stop, we have a match.
                id = sprints[i].id;
                break;
            }
        }

        this.active = id;

        return this.active;
    }

    render() {
        return (
            <div>sprints</div>
        )
    }
}
