import React from "react";
import SprintTag from "../Sprint/SprintTag";

export default class Card extends React.Component {
    getUrl() {
        if ('B' == this.props.task.type) {
            // Bug
            return "http://pmt.pti.nl/index.php/report/view/" + this.props.task.name;
        } else {
            // Task
            return "http://pmt.pti.nl/index.php/task/view/" + this.props.task.name;
        }
    }

    getTag() {
        if ('' != this.props.task.sprintNumber) {
            return <SprintTag sprintId={this.props.task.sprintNumber} alignTag="right"/>
        }
        return '';
    }

    getTaskOwner() {
        if ('' != this.props.task.task_owner) {
            return <div className="row">
                <div className="col-xs-12">Task owner: {this.props.task.task_owner}</div>
            </div>
        }
        return '';
    }

    getProduct() {
        if ('' != this.props.task.product) {
            return <div className="row">
                <div className="col-xs-12">Product: {this.props.task.product}</div>
            </div>
        }
        return '';
    }

    getTarget() {
        return this.props.task.type + this.props.task.name;
    }

    getStatus() {
        if (4 == this.props.task.status) {
            // On hold
            return <span className="list-card-status" title="On hold"> <i className="fa fa-lock"></i></span>
        }
        return '';
    }

    render() {
        return (
            <div className="list-card">
                <div className="list-card-header">
                    <div className="list-card-header-name"><a href={this.getUrl()}
                                                              target={this.getTarget()}><span
                        className="type">{this.props.task.type}</span>{this.props.task.name}</a>{this.getStatus()}
                        <div className="list-card-label">
                            {this.getTag()}
                        </div>
                    </div>
                </div>
                <div className="list-card-details">
                    <div className="list-card-details-title toggle-head"
                         title="Details">{this.props.task.description}</div>
                    <div className="list-card-details-content toggle-body" style={{display: 'none'}}>
                        <div className="row">
                            <div className="col-xs-12">Team: {this.props.task.employee.join(', ')}</div>
                        </div>
                        {this.getTaskOwner()}
                        <div className="row">
                            <div className="col-xs-12">Project: P{this.props.task.project}</div>
                        </div>
                        {this.getProduct()}
                        <div className="row">
                            <div className="col-xs-12">Status: {this.props.task.statusDetail}</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
