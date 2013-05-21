// Copyright: 2013 PMSI-AlignAlytics
// License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
// Source: /src/objects/axis/methods/_update.js
this._update = function (refactor) {

    // If the axis is a percentage type axis the bounds must be between -1 and 1.  Sometimes
    // binary rounding means it can fall outside that bound so tidy up here
    this._min = (this.showPercent && this._min < -1 ? this._min = -1 : this._min);
    this._max = (this.showPercent && this._max > 1 ? this._max = 1 : this._max);

    // Override or round the min or max
    this._min = (this.overrideMin != null ? this.overrideMin : this._min);
    this._max = (this.overrideMax != null ? this.overrideMax : this._max);

    // If this is an x axis
    if (this.position.length > 0 && this.position[0] == "x") {
        if (this.measure == null || this.measure == undefined) {
            var distinctCats = [];
            this.chart.data.forEach(function (d, i) {
                if (distinctCats.indexOf(d[this.categoryFields[0]]) == -1) {
                    distinctCats.push(d[this.categoryFields[0]]);    
                }
            }, this);
            this._scale = d3.scale.ordinal().rangePoints([this.chart.x, this.chart.x + this.chart.width]).domain(distinctCats.concat([""]));
        }
        else {
            this._scale = d3.scale.linear().range([this.chart.x, this.chart.x + this.chart.width]).domain([this._min, this._max]).nice();
        }
        // If it's visible, orient it at the top or bottom if it's first or second respectively
        if (!this.hidden) {
            switch (chart._axisIndex(this, "x")) {
                case 0: this._draw = d3.svg.axis().orient("bottom").scale(this._scale); break;
                case 1: this._draw = d3.svg.axis().orient("top").scale(this._scale); break;
                default: break;
            }
        }
    }
    // If it's a y axis 
    else if (this.position.length > 0 && this.position[0] == "y") {
        // Set the height both logical and physical of the axis
        if (this.measure == null || this.measure == undefined) {
            var distinctCats = [];
            this.chart.data.forEach(function (d, i) {
                if (distinctCats.indexOf(d[this.categoryFields[0]]) == -1) {
                    distinctCats.push(d[this.categoryFields[0]]);    
                }
            }, this);
            this._scale = d3.scale.ordinal().rangePoints([this.chart.y + this.chart.height, this.chart.y]).domain(distinctCats.concat([""]));
        }
        else {
            this._scale = d3.scale.linear().range([this.chart.y + this.chart.height, this.chart.y]).domain([this._min, this._max]).nice();
        }
        // if it's visible, orient it at the left or right if it's first or second respectively
        if (!this.hidden) {
            switch (chart._axisIndex(this, "y")) {
                case 0: this._draw = d3.svg.axis().orient("left").scale(this._scale); break;
                case 1: this._draw = d3.svg.axis().orient("right").scale(this._scale); break;
                default: break;
            }
        }
    }
    // If it's a z axis just set the logical range
    else if (this.position.length > 0 && this.position[0] == "z") {
        this._scale = d3.scale.linear().range([this.chart.height / 300, this.chart.height / 10]).domain([this._min, this._max]);
    }
    // If it's a c axis just set the logical range based on the number of colours. This will be used in the calculation to determin R, G and B values.
    // The distance between 2 colours will be different for each part of the color and depending on the color so it needs to be done case by case
    else if (this.position.length > 0 && this.position[0] == "c") {
        this._scale = d3.scale.linear().range([0, (this.colors == null || this.colors.length == 1 ? 1 : this.colors.length - 1)]).domain([this._min, this._max]);
    }
    // Check that the axis ends on a labelled tick
    if ((refactor == null || refactor == undefined || refactor == false) && this._scale != null && this._scale.ticks != null && this._scale.ticks(10).length > 0) {
        // Get the ticks determined based on a split of 10
        var ticks = this._scale.ticks(10);
        // Get the step between ticks
        var step = ticks[1] - ticks[0];
        // Get the remainder
        var remainder = ((this._max - this._min) % step).toFixed(0);
        // If the remainder is not zero
        if (remainder != 0) {
            // Set the bounds
            this._max = Math.ceil(this._max/step) * step
            this._min = Math.floor(this._min/step) * step
            // Recursively call the method to recalculate the scale.  This shouldn't enter this block again.
            this._update(true);
        }
    }
    // Populate the origin
    var origin = this._scale.copy()(0);
    if (this._origin != origin) {
        this._previousOrigin = (this._origin == null ? origin : this._origin);
        this._origin = origin;
    }
    // Return axis for chaining
    return this;
};

