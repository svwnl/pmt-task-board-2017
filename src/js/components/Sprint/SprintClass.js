import React from "react";

import Sprints from "./Sprint";

export default class SprintClass extends React.Component {

    constructor() {

        // ES6 constructor replaces getInitialState() to declare a default set of values for the initial state.
        // When you think of state, you should think of an internal data-set which affects the rendering of components.
        // State should be considered private data.

        super();
        this.state = {
            sprints: []
        };

        this.active = null;
    }

    static dateFormat(milliseconds) {
        // var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
        var d = new Date(milliseconds);
        return d.getDate() + ' ' + months[d.getMonth()];
    }
    
    static getColor(number) {
        'use strict';
        var colors = ['blue', 'green', 'pink', 'purple', 'red', 'teal', 'orange'];
        return 'sprint-label label-' + colors[number % 7];
    }

    static getSprintNumber(text) {

        // Get the sprint number from a text containing sprint name like _S(number)
        // For example '2016_S5 foo...' will return 5

        var no = '';
        // Search for sprint number _S#

        var matches = text.match(/_S(\d+)/);
        if (null !== matches) {
            no = matches[1];
        }

        if (no !== '') {
            no = parseInt(no);
        }

        return no;
    }

    render() {
        return (
            <div>sprints</div>
        )
    }
}
