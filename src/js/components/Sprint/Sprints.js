var Sprints = {
    active: null,
    sprints: [],
    getSprint: function (id) {
        if (null === id && null != this.active) {
            id = this.active;
        }
        for (var i = this.sprints.length - 1; i >= 0; --i) {
            var sprint = this.sprints[i];
            if (id == sprint.metaData.id) {
                return sprint;
            }
        }

        return null;
    }
};

/**
 * Module exports.
 * @public
 */
module.exports = Sprints;
