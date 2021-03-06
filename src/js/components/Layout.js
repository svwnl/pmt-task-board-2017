import React from "react";
import Board from "./Board";
import Menu from "./Menu";
import SprintClass from "./Sprint/SprintClass";
import SprintsClass from "./Sprint/SprintsClass";

export default class Layout extends React.Component {


    constructor() {

        // ES6 constructor replaces getInitialState() to declare a default set of values for the initial state.
        // When you think of state, you should think of an internal data-set which affects the rendering of components.
        // State should be considered private data.

        super();
        this.state = {
            activeSprintId: '', // The sprint that is now active
            filterBug: true,
            filterEmployee: [],
            filterPreviousSprints: true, // If true show previous sprints
            filterProduct: '',
            filterSprint: '',
            filterTaskOwner: '',
            filterText: '',
            refreshed: Date.now(),
            employees: [],  // Derived from tasks[]
            products: [],   // Derived from tasks[]
            sprints: [],
            SprintsClass: '', // a js class
            tasks: [],
            taskOwners: []  // Derived from tasks[]
        };
    }

    componentDidMount() {

        // componentDidMount is called by react when the component
        // has been rendered on the page. We can set the interval here:

        this.timer = setInterval(this.tick.bind(this), 900000); // 15 minutes

        if (this.state.sprints.length < 1) {

            // Request sprints information list once.

            this.serverRequestSprints();
        }

    }

    componentWillUnmount() {

        // This method is called immediately before the component is removed
        // from the page and destroyed. We can clear the interval here:

        clearInterval(this.timer);
    }

    tick() {

        // This function is called every 15 minutes. It updates the
        // refreshed counter. Calling setState causes the component to be re-rendered

        this.setState({
            refreshed: Date.now()
        }, function () {
            // Refresh tickets
            this.requestTickets();
        });


    }

    serverRequestSprints() {

        // Request a list of sprints with id and start and release dates.
        // mode: 0 = tasks, 1 = bugs, 2 = all, 3 = sprints
        var params = '?mode=3';
        console.log('Request a list of sprints');

        $.ajax({
            url: this.props.url + params, // url: this.props.url + params, // url: 'models/sprints.js', ////
            dataType: 'json',
            cache: false,
            success: function (sprints) {

                // Format the received json and set the prints
                var SprintsCls = new SprintsClass(sprints);

                // Find the currently active sprint
                var activeSprintId = SprintsCls.getActiveSprintId();

                // Selected sprint. Defaults to the active sprint.
                var filterSprint = '' == this.state.filterSprint ? activeSprintId : this.state.filterSprint;

                // Get formatted sprints as json
                var jsonSprints = SprintsCls.getSprints();

                this.setState({
                    sprints: jsonSprints,
                    filterSprint: filterSprint,
                    activeSprintId: activeSprintId,
                    SprintsClass: SprintsCls
                }, function () {
                    // Request tickets for newly selected sprint.
                    this.requestTickets();
                });


            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    }

    requestTickets() {

        // Decide based on state which tasks to request
        // Bugs are now always requested,
        // but based on this.state.filterBug we could decide not to include bugs

        if ('' != this.state.filterSprint && this.state.filterPreviousSprints) {

            // Get open and closed tasks in selected sprint and open tasks in previous sprints
            this.serverRequestTickets(this.state.filterSprint, 1);

        }
        else if ('' != this.state.filterSprint) {

            // Get open and closed tasks in selected sprint
            this.serverRequestTickets(this.state.filterSprint);

        }
        else {

            // Get all open tasks in all sprints
            this.serverRequestTickets();

        }
    }

    serverRequestTickets(sprint = '', previous = false) {

        // Server request tasks and / or bug for a sprint 
        // mode: 0 = tasks, 1 = bugs, 2 = all, 3 = sprints
        // If sprint is not set only open tickets for all sprints are returned
        // If sprint is set open and closed tickets for that sprint are returned

        var params = '?mode=2';
        if (sprint !== '') {
            // Single sprint, open and closed tasks
            params += '&sprint=' + sprint;
            if (previous) {
                // Include open tasks in previous sprints
                params += '&previous=1';
            }
        }

        console.log('Request tickets sprint(s) ' + this.props.url + params);

        $.ajax({
            url: this.props.url + params, // url: this.props.url + params, // url: 'models/data_' + sprint + '.js', //
            dataType: 'json',
            cache: false,
            success: function (tasks) {

                tasks = this.editTasks(tasks);

                var employees = this.setEmployees(tasks);    // Get team members in tasks
                var products = this.setProducts(tasks);      // Get products in tasks
                var taskOwners = this.setTaskOwners(tasks);  // Get task owners in tasks

                this.setState({
                    tasks: tasks,            // Tickets
                    employees: employees,    // Get team members in tickets
                    products: products,      // Get products in tickets
                    taskOwners: taskOwners   // Get task owners in tickets
                });

            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    }

    editTasks(tasks) {

        // Clean up some of the data and add useful parameters
        console.log('Edit tasks');

        tasks.forEach(function (d) {

            var sprintNumber = '';
            if ('' != d.sprint) {
                // 2016_S5 > 5
                sprintNumber = SprintClass.getSprintNumber(d.sprint);
            }

            // Legacy: remove prefix yyyy_S# from the description
            d.description = d.description.replace(/\d*_S\d+/i, "").trim();

            // Set the sprintId... TODO same value twice, rename d.sprint or sprintId
            d.sprintId = d.sprint; // 2016_S5

            // The number extracted from the sprint id/name
            d.sprintNumber = sprintNumber;

            // Set the acceptance date.
            // Tasks need to be filtered on this property
            d.acceptance = this.getSprintAcceptanceDate(d.sprint);

            // Add status description
            d.statusDetail = Layout.getPmtStatusDetails(d.status);

        }, this);

        return tasks.sort(this.sortSprint);

    }

    getSprintAcceptanceDate(sprintId) {

        // Return the sprint acceptance date

        var sprints = this.state.sprints;
        for (var i = 0; i < sprints.length; i++) {
            if (sprintId == sprints[i]['sprint']) {
                return sprints[i]['acceptance'];
            }
        }
        return false;
    }



    static getPmtStatusDetails(status) {

        // Return the status code description
        // as defined in database table pmt_status_details

        var pmtStatusDetails = {
            1: "Review operation management",   // backlog
            2: "In process Programmer",         // development
            3: "Ready for Code review QA",      // development
            4: "On hold",                       // backlog
            5: "Ready for Testing",             // test
            6: "In process Tester",             // test
            7: "Ready for Production",          // ready for prod
            8: "Change not OK",                 // development
            9: "Check live Production",         // production
            10: "Closed",                       // production
            11: "Reopened",                     // backlog
            12: "New",                          // backlog
            13: "Ready for Acceptance",         // ready for acc
            15: "Acceptance",                   // acceptance
            16: "Customer approved for Prod",   // ready for prod
            17: "CR OK deploy to test",         // deploy to test
            18: "Tester approved"               // tester approved
        };

        return pmtStatusDetails[status] === undefined ? status : pmtStatusDetails[status];

    }

    setEmployees(tasks) {

        // Extract a list of all people working on tasks from the tasks array
        console.log('List team members in tasks.');

        var employees = this.state.employees;
        var employeesFlat = [];
        employees.forEach(function(e){employeesFlat.push(e.label)});

        tasks.forEach(
            function (task) {
                // task.employee: comma separated employee names
                task.employee.forEach(function (e) {
                    // e: employee name
                    // @TODO Probably a dumb way to do this this way,
                    // to flatten the array to be able to do .indexOf(e) === -1
                    if (employeesFlat.indexOf(e) === -1) {
                        employeesFlat.push(e);
                        employees.push({label: e, value: e});
                    }
                });
            }
        );

        return employees.sort(this.sortEmployees);
    }

    setProducts(tasks) {

        // Extract a list of product groups from the tasks
        console.log('List products in tasks.');

        var products = this.state.products;
        tasks.forEach(
            function (task) {
                var product = task.product;
                if ('' != product && products.indexOf(product) === -1) {
                    products.push(product);
                }

            }
        );

        return products.sort();
    }

    setTaskOwners(tasks) {

        // Extract a list of task owners from the tasks
        console.log('List task owners in tasks.');

        var taskOwners = this.state.taskOwners;
        tasks.forEach(
            function (task) {
                var taskOwner = task.task_owner;
                if ('' != taskOwner && taskOwners.indexOf(taskOwner) === -1) {
                    console.log(taskOwner);
                    taskOwners.push(taskOwner);
                }

            }
        );

        return taskOwners.sort();
    }


    validFilterSprintValue(filterSprint) {

        if ('' === filterSprint) {
            // Sprint deselected
            return true;
        }

        if (null !== this.state.SprintsClass.getSprint(filterSprint)) {
            // Sprint id found
            return true;
        }

        return false;
    }

    handleUserClick(filterSprint) {

        if (filterSprint == this.state.filterSprint) {
            // Double clicked sprint, deselect
            filterSprint = '';
        }

        // Validate sprint selection
        if (this.validFilterSprintValue(filterSprint)) {

            // Check if sprint selection has changed
            if (this.state.filterSprint != filterSprint) {

                // Set new sprint
                this.setState({
                        filterSprint: filterSprint
                    }, function () {
                        // Request tickets for newly selected sprint.
                        this.requestTickets();
                    }
                );

            }
        }
    }

    handleUserInput(input) {

        // Expecting an input object like {'filterBug' : true, 'filterEmployee' : ...} with one or more of these keys
        // 'filterBug', 'filterEmployee', 'filterPreviousSprints', 'filterProduct', 'filterTaskOwner', 'filterText'

        // Validated user input
        var newState = {};

        // Set true to request new tickets
        var requestTickets = false;

        if('filterBug' in input) {
            if (true !== input.filterBug) {
                // Checkbox
                input.filterBug = false
            }
            newState['filterBug'] = input.filterBug;
        }

        if('filterEmployee' in input) {
            //@TODO add check to see if employee is valid
            console.log('filterEmployee');
            // if ('' != filterEmployee && this.state.employees.indexOf(filterEmployee) === -1) {
            newState['filterEmployee'] = input.filterEmployee;
        }

        if('filterPreviousSprints' in input){
            if (true !== input.filterPreviousSprints) {
                // Checkbox
                input.filterPreviousSprints = false
            }

            if(this.state.filterPreviousSprints != input.filterPreviousSprints){
                // Sprint selection changed, request new tickets
                requestTickets = true;
                newState['filterPreviousSprints'] = input.filterPreviousSprints;
            }
        }

        if('filterProduct' in input) {
            if ('' == input.filterProduct || this.state.products.indexOf(input.filterProduct) > -1) {
                // Product deselected or selected product found in products list
                newState['filterProduct'] = input.filterProduct;
            }
        }

        if('filterTaskOwner' in input) {
            if ('' == input.filterTaskOwner || this.state.taskOwners.indexOf(input.filterTaskOwner) > -1) {
                // Task owner deselected or selected task owner found in task owner list
                newState['filterTaskOwner'] = input.filterTaskOwner;
            }
        }

        if('filterText' in input) {
            // Search
            newState['filterText'] = input.filterText;
        }

        this.setState(newState, function () {
            if (requestTickets) {
                // Sprint selection changed, request new tickets
                this.requestTickets();
            }
        });

    }

    sortEmployees(a, b){
        if (a.label === b.label) {
            return 0;
        }
        else {
            return (a.label < b.label) ? -1 : 1;
        }
    }


    sortSprint(a, b) {

        // Sort sprint on acceptance date

        if (a.acceptance === b.acceptance) {
            return 0;
        }
        else if ('' == a.acceptance) {
            // Not in a sprint. Sort to top of list
            return -1;
        }
        else if ('' == b.acceptance) {
            // Not in a sprint. Sort to top of list
            return 1;
        }
        else {
            // Sort sprint asc
            return (a.acceptance < b.acceptance) ? -1 : 1;
        }
    }

    render() {

        // Although we return entire <div> elements, react will smartly update
        // only the changed parts.

        return (<div id="content">
            <div className="board-wrapper is-show-menu">
                <div className="board-main-content">
                    <div className="board-canvas">
                        <div className="u-fancy-scrollbar" id="board">
                            <Board
                                activeSprintId={this.state.activeSprintId}
                                filterBug={this.state.filterBug}
                                filterEmployee={this.state.filterEmployee}
                                filterPreviousSprints={this.state.filterPreviousSprints}
                                filterProduct={this.state.filterProduct}
                                filterSprint={this.state.filterSprint}
                                filterTaskOwner={this.state.filterTaskOwner}
                                filterText={this.state.filterText}
                                sprints={this.state.sprints}
                                SprintsClass={this.state.SprintsClass}
                                tasks={this.state.tasks}
                            />
                        </div>
                    </div>
                </div>
                <a id="board-menu-open" href="#" className="btn btn-danger" title="Open menu"><i
                    className="fa fa-bars"></i></a>
                <Menu
                    activeSprintId={this.state.activeSprintId}
                    employees={this.state.employees}
                    filterBug={this.state.filterBug}
                    filterEmployee={this.state.filterEmployee}
                    filterPreviousSprints={this.state.filterPreviousSprints}
                    filterProduct={this.state.filterProduct}
                    filterSprint={this.state.filterSprint}
                    filterTaskOwner={this.state.filterTaskOwner}
                    filterText={this.state.filterText}
                    handleUserClick={this.handleUserClick.bind(this)}
                    handleUserInput={this.handleUserInput.bind(this)}
                    products={this.state.products}
                    refreshed={this.state.refreshed}
                    sprints={this.state.sprints}
                    SprintsClass={this.state.SprintsClass}
                    taskOwners={this.state.taskOwners}
                    tick={this.tick.bind(this)}
                    version={this.props.version}
                />
            </div>
        </div>);
    }
}
