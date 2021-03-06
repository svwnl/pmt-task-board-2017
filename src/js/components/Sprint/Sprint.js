var Sprint = function (metaData) {

    this.metaData = metaData;
    this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    this.colors = ['green', 'pink', 'blue', 'orange', 'purple', 'teal', 'red'];

    this.getStartDate = function () {
        return this.dateFormat(parseInt(this.metaData.start));
    };

    this.getAcceptanceDate = function () {
        return this.dateFormat(parseInt(this.metaData.acceptance));
    };

    this.getProductionDate = function () {
        return this.dateFormat(parseInt(this.metaData.production));
    };

    this.dateFormat = function (milliseconds) {
        var d = new Date(milliseconds);
        return d.getDate() + ' ' + this.months[d.getMonth()];
    };

    /* Sprint color */
    this.getTagColor = function () {
        // Error, no id set
        if (null === this.metaData.id) {
            return 'black';
        }
        return this.colors[this.metaData.id % 5];
    };

};

/**
 * Module exports.
 * @public
 */
module.exports = Sprint;
