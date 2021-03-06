import React from "react";
import SprintClass from "../Sprint/SprintClass";

export default class SprintTag extends React.Component {

    render() {

        var text = 'S' + this.props.sprintId;
        var textLeft = '';
        var textRight = ' ' + text;
        if ('right' == this.props.alignTag) {
            var textLeft = text + ' ';
            var textRight = '';
        }

        return (
            <span className={SprintClass.getColor(this.props.sprintId)}>{textLeft}<i
                className="fa fa-tag"></i>{textRight}</span>);
    }
}
