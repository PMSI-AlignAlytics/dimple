// Copyright: 2013 PMSI-AlignAlytics
// License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
// Source: /src/objects/begin.js

// Create the stub object
var dimple = {
    version: "1.0.0",
    plot: {},
    aggregateMethod: {}
};

// Wrap all application code in a self-executing function
(function () {
    "use strict";

    // Copyright: 2013 PMSI-AlignAlytics
    // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
    // Source: /src/objects/axis/begin.js
    // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.axis
    dimple.axis = function (chart, position, categoryFields, measure, timeField, logField) {

        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.axis#wiki-chart
        this.chart = chart;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.axis#wiki-position
        this.position = position;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.axis#wiki-categoryFields
        this.categoryFields = (timeField === null || timeField === undefined ? categoryFields : [].concat(timeField));
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.axis#wiki-measure
        this.measure = measure;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.axis#wiki-timeField
        this.timeField = timeField;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.axis#wiki-floatingBarWidth
        this.floatingBarWidth = 5;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.axis#wiki-hidden
        this.hidden = false;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.axis#wiki-showPercent
        this.showPercent = false;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.axis#wiki-colors
        this.colors = null;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.axis#wiki-overrideMin
        this.overrideMin = null;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.axis#wiki-overrideMax
        this.overrideMax = null;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.axis#wiki-shapes
        this.shapes = null;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.axis#wiki-showGridlines
        this.showGridlines = null;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.axis#wiki-gridlineShapes
        this.gridlineShapes = null;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.axis#wiki-titleShape
        this.titleShape = null;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.axis#wiki-dateParseFormat
        this.dateParseFormat = null;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.axis#wiki-tickFormat
        this.tickFormat = null;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.axis#wiki-timePeriod
        this.timePeriod = null;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.axis#wiki-timeInterval
        this.timeInterval = 1;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.axis#wiki-logField
        this.logField = logField;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.axis#wiki-logFormat
        this.logFormat = null;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.axis#wiki-logBase
        this.logBase = 10;

        // The scale determined by the update method
        this._scale = null;
        // The minimum and maximum axis values
        this._min = 0;
        this._max = 0;
        // Chart origin before and after an update.  This helps
        // with transitions
        this._previousOrigin = null;
        this._origin = null;
        // The order definition array
        this._orderRules = [];
        // The group order definition array
        this._groupOrderRules = [];


        // Copyright: 2013 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/axis/methods/_draw.js
        this._draw = null;


        // Copyright: 2013 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/axis/methods/_getFormat.js
        this._getFormat = function () {
            var returnFormat,
                max,
                min,
                len,
                chunks,
                suffix,
                scale,
                format,
                dp;
            if (this.tickFormat !== null && this.tickFormat !== undefined) {
                if (this._hasTimeField()) {
                    returnFormat = d3.time.format(this.tickFormat);
                } else {
                    returnFormat = d3.format(this.tickFormat);
                }
            } else if (this.showPercent) {
                returnFormat = d3.format("%");
            } else if (this.logField) {
                scale  = this._scale;
                format = this.logFormat || ",d";
                chunks = 4;

                returnFormat = function(d) {
                    return scale.tickFormat(chunks, d3.format(format))(d);
                };

            } else if (this.measure !== null) {
                max = Math.floor(Math.abs(this._max), 0).toString();
                min = Math.floor(Math.abs(this._min), 0).toString();
                len = Math.max(min.length, max.length);
                if (len > 3) {
                    chunks = Math.min(Math.floor((len - 1) / 3), 4);
                    suffix = "kmBT".substring(chunks - 1, chunks);
                    dp = (len - chunks * 3 <= 1 ? 1 : 0);
                    returnFormat = function (n) {
                        return (n === 0 ? 0 : d3.format(",." + dp + "f")(n / Math.pow(1000, chunks)) + suffix);
                    };
                } else {
                    dp = (len <= 1 ? 1 : 0);
                    returnFormat = d3.format(",." + dp + "f");
                }
            } else {
                returnFormat = function (n) { return n; };
            }
            return returnFormat;
        };


        // Copyright: 2013 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/axis/methods/_getTimePeriod.js
        this._getTimePeriod = function () {
            // A javascript date object
            var outPeriod = this.timePeriod,
                maxPeriods = 30,
                diff = this._max - this._min;
            if (this._hasTimeField && (this.timePeriod === null || this.timePeriod === undefined)) {
                // Calculate using millisecond values for speed.  Using the date range requires creating an array
                // which in the case of seconds kills the browser.  All constants are straight sums of milliseconds
                // except months taken as (86400000 * 365.25) / 12 = 2629800000
                if (diff / 1000 <= maxPeriods) {
                    outPeriod = d3.time.seconds;
                } else if (diff / 60000 <= maxPeriods) {
                    outPeriod = d3.time.minutes;
                } else if (diff / 3600000 <= maxPeriods) {
                    outPeriod = d3.time.hours;
                } else if (diff / 86400000 <= maxPeriods) {
                    outPeriod = d3.time.days;
                } else if (diff / 604800000 <= maxPeriods) {
                    outPeriod = d3.time.weeks;
                } else if (diff / 2629800000 <= maxPeriods) {
                    outPeriod = d3.time.months;
                } else {
                    outPeriod = d3.time.years;
                }
            }
            // Return the date
            return outPeriod;
        };


        // Copyright: 2013 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/axis/methods/_hasCategories.js
        this._hasCategories = function () {
            return (this.categoryFields !== null && this.categoryFields !== undefined && this.categoryFields.length > 0);
        };


        // Copyright: 2013 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/axis/methods/_hasLogField.js
        this._hasLogField = function () {
            return (this.logField !== null && this.logField !== undefined);
        };
        // Copyright: 2013 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/axis/methods/_hasMeasure.js
        this._hasMeasure = function () {
            return (this.measure !== null && this.measure !== undefined);
        };


        // Copyright: 2013 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/axis/methods/_hasTimeField.js
        this._hasTimeField = function () {
            return (this.timeField !== null && this.timeField !== undefined);
        };


        // Copyright: 2013 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/axis/methods/_parseDate.js
        this._parseDate = function (inDate) {
            // A javascript date object
            var outDate;
            if (this.dateParseFormat === null || this.dateParseFormat === undefined) {
                // If nothing has been explicity defined you are in the hands of the browser gods
                // may they smile upon you...
                outDate = Date.parse(inDate);
            } else {
                outDate = d3.time.format(this.dateParseFormat).parse(inDate);
            }
            // Return the date
            return outDate;
        };


        // Copyright: 2013 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/axis/methods/_update.js
        this._update = function (refactor) {

            var distinctCats = [],
                ticks,
                step,
                remainder,
                origin,
                getOrderedCategories = function (self, axPos, oppPos) {
                    var category = self.categoryFields[0],
                        sortBy = category,
                        desc = false,
                        isDate = true,
                        i,
                        definitions = [];
                    // Check whether this field is a date
                    for (i = 0; i < self.chart.data.length; i += 1) {
                        if (isNaN(self._parseDate(self.chart.data[i][category]))) {
                            isDate = false;
                            break;
                        }
                    }
                    if (!isDate) {
                        // Find the first series which connects this axis to another
                        self.chart.series.forEach(function (s) {
                            if (s[axPos] === self && s[oppPos]._hasMeasure()) {
                                sortBy = s[oppPos].measure;
                                desc = true;
                            }
                        }, this);
                    }
                    definitions = self._orderRules.concat({ ordering : sortBy, desc : desc });
                    return dimple._getOrderedList(self.chart.data, category, definitions);
                };

            // If the axis is a percentage type axis the bounds must be between -1 and 1.  Sometimes
            // binary rounding means it can fall outside that bound so tidy up here
            this._min = (this.showPercent && this._min < -1 ? -1 : this._min);
            this._max = (this.showPercent && this._max > 1 ? 1 : this._max);

            // Override or round the min or max
            this._min = (this.overrideMin !== null ? this.overrideMin : this._min);
            this._max = (this.overrideMax !== null ? this.overrideMax : this._max);

            // If this is an x axis
            if (this.position === "x") {
                if (this._hasTimeField()) {
                    this._scale = d3.time.scale()
                        .rangeRound([this.chart.x, this.chart.x + this.chart.width])
                        .domain([this._min, this._max]);
                } else if (this.measure === null || this.measure === undefined) {
                    distinctCats = getOrderedCategories(this, "x", "y");
                    this._scale = d3.scale.ordinal()
                        .rangePoints([this.chart.x, this.chart.x + this.chart.width])
                        .domain(distinctCats.concat([""]));
                } else {
                    this._scale = d3.scale.linear()
                        .range([this.chart.x, this.chart.x + this.chart.width])
                        .domain([this._min, this._max]).nice();
                }
                // If it's visible, orient it at the top or bottom if it's first or second respectively
                if (!this.hidden) {
                    switch (this.chart._axisIndex(this, "x")) {
                    case 0:
                        this._draw = d3.svg.axis()
                            .orient("bottom")
                            .scale(this._scale);
                        break;
                    case 1:
                        this._draw = d3.svg.axis()
                            .orient("top")
                            .scale(this._scale);
                        break;
                    default:
                        break;
                    }
                }
            } else if (this.position === "y") {
                if (this._hasTimeField()) {
                    this._scale = d3.time.scale()
                        .rangeRound([this.chart.y + this.chart.height, this.chart.y])
                        .domain([this._min, this._max]);
                } else if (this._hasLogField()) {
                    this._scale = d3.scale.log()
                        .range([this.chart.y + this.chart.height, this.chart.y])
                        .domain([this._min === 0 ? (this._max > 0 ? this._min + 0.1 : this._min - 0.1) : this._min, this._max])
                        .clamp(true)
                        .base(this.logBase)
                        .nice();
                } else if (this.measure === null || this.measure === undefined) {
                    distinctCats = getOrderedCategories(this, "y", "x");
                    this._scale = d3.scale.ordinal()
                        .rangePoints([this.chart.y + this.chart.height, this.chart.y])
                        .domain(distinctCats.concat([""]));
                } else {
                    this._scale = d3.scale.linear()
                        .range([this.chart.y + this.chart.height, this.chart.y])
                        .domain([this._min, this._max])
                        .nice();
                }
                // if it's visible, orient it at the left or right if it's first or second respectively
                if (!this.hidden) {
                    switch (this.chart._axisIndex(this, "y")) {
                    case 0:
                        this._draw = d3.svg.axis()
                            .orient("left")
                            .scale(this._scale);
                        break;
                    case 1:
                        this._draw = d3.svg.axis()
                            .orient("right")
                            .scale(this._scale);
                        break;
                    default:
                        break;
                    }
                }
            } else if (this.position.length > 0 && this.position[0] === "z") {
                this._scale = d3.scale.linear()
                    .range([this.chart.height / 300, this.chart.height / 10])
                    .domain([this._min, this._max]);
            } else if (this.position.length > 0 && this.position[0] === "c") {
                this._scale = d3.scale.linear()
                    .range([0, (this.colors === null || this.colors.length === 1 ? 1 : this.colors.length - 1)])
                    .domain([this._min, this._max]);
            }
            // Check that the axis ends on a labelled tick
            if ((refactor === null || refactor === undefined || refactor === false) && !this._hasTimeField() && this._scale !== null && this._scale.ticks !== null && this._scale.ticks !== undefined && this._scale.ticks(10).length > 0 && (this.position === "x" || this.position === "y")) {

                // Get the ticks determined based on a split of 10
                ticks = this._scale.ticks(10);
                // Get the step between ticks
                step = ticks[1] - ticks[0];
                // Get the remainder
                remainder = ((this._max - this._min) % step).toFixed(0);

                // If the remainder is not zero
                if (remainder !== 0) {
                    // Set the bounds
                    this._max = Math.ceil(this._max / step) * step;
                    this._min = Math.floor(this._min / step) * step;
                    // Recursively call the method to recalculate the scale.  This shouldn't enter this block again.
                    this._update(true);
                }
            }

            // Populate the origin
            origin = this._scale.copy()(0);

            if (this._origin !== origin) {
                this._previousOrigin = (this._origin === null ? origin : this._origin);
                this._origin = origin;
            }

            // Return axis for chaining
            return this;
        };


        // Copyright: 2013 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/axis/methods/addGroupOrderRule.js
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.axis#wiki-addGroupOrderRule
        this.addGroupOrderRule = function (ordering, desc) {
            this._groupOrderRules.push({ ordering : ordering, desc : desc });
        };
        // Copyright: 2013 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/axis/methods/addOrderRule.js
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.axis#wiki-addOrderRule
        this.addOrderRule = function (ordering, desc) {
            this._orderRules.push({ ordering : ordering, desc : desc });
        };
    };
    // End dimple.axis


    // Copyright: 2013 PMSI-AlignAlytics
    // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
    // Source: /src/objects/chart/begin.js
    // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.chart
    dimple.chart = function (svg, data) {

        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.chart#wiki-svg
        this.svg = svg;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.chart#wiki-x
        this.x = svg[0][0].width.baseVal.value * 0.1;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.chart#wiki-y
        this.y = svg[0][0].height.baseVal.value * 0.1;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.chart#wiki-width
        this.width = svg[0][0].width.baseVal.value * 0.8;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.chart#wiki-height
        this.height = svg[0][0].height.baseVal.value * 0.8;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.chart#wiki-data
        this.data = data;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.chart#wiki-noFormats
        this.noFormats = false;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.chart#wiki-axes
        this.axes = [];
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.chart#wiki-series
        this.series = [];
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.chart#wiki-legends
        this.legends = [];
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.chart#wiki-storyboard
        this.storyboard = null;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.chart#wiki-titleShape
        this.titleShape = null;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.chart#wiki-shapes
        this.shapes = null;

        // The group within which to put all of this chart's objects
        this._group = svg.append("g");
        // The group within which to put tooltips.  This is not initialised here because
        // the group would end up behind other chart contents in a multi chart output.  It will
        // therefore be added and removed by the mouse enter/leave events
        this._tooltipGroup = null;
        // Colors assigned to chart contents.  E.g. a series value.
        this._assignedColors = {};
        // The next colour index to use, this value is cycled around for all default colours
        this._nextColor = 0;


        // Copyright: 2013 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/chart/methods/_axisIndex.js
        // Return the ordinal value of the passed axis.  If an orientation is passed, return the order for the 
        // specific orientation, otherwise return the order from all axes.  Returns -1 if the passed axis isn't part of the collection
        this._axisIndex = function (axis, orientation) {

            var i = 0,
                axisCount = 0,
                index = -1;

            for (i = 0; i < this.axes.length; i += 1) {
                if (this.axes[i] === axis) {
                    index = axisCount;
                    break;
                }
                if (orientation === null || orientation === undefined || orientation[0] === this.axes[i].position[0]) {
                    axisCount += 1;
                }
            }

            return index;

        };


        // Copyright: 2013 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/chart/methods/_getSeriesData.js
        // Create a dataset containing positioning information for every series
        this._getSeriesData = function () {
            // If there are series
            if (this.series !== null && this.series !== undefined) {
                // Iterate all the series
                this.series.forEach(function (series) {
                    // The data for this series
                    var returnData = [],
                        // Handle multiple category values by iterating the fields in the row and concatonate the values
                        // This is repeated for each axis using a small anon function
                        getField = function (axis, row) {
                            var returnField = [];
                            if (axis !== null) {
                                if (axis._hasTimeField()) {
                                    returnField.push(axis._parseDate(row[axis.timeField]));
                                } else if (axis._hasCategories()) {
                                    axis.categoryFields.forEach(function (cat) {
                                        returnField.push(row[cat]);
                                    }, this);
                                }
                            }
                            return returnField;
                        },
                        // Catch a non-numeric value and re-calc as count
                        useCount = { x: false, y: false, z: false, c: false },
                        // If the elements are grouped a unique list of secondary category values will be required
                        secondaryElements = { x: [], y: [] },
                        // Get the x and y totals for percentages.  This cannot be done in the loop above as we need the data aggregated before we get an abs total.
                        // otherwise it will wrongly account for negatives and positives rolled together.
                        totals = { x: [], y: [], z: [] },
                        colorBounds = { min: null, max: null },
                        tot,
                        running = { x: [], y: [], z: [] },
                        addedCats = [],
                        catTotals = {},
                        grandTotals = { x: 0, y: 0, z: 0 },
                        key,
                        storyCat = "",
                        orderedStoryboardArray = [],
                        seriesCat = "",
                        orderedSeriesArray = [],
                        xCat = "",
                        xSortArray = [],
                        yCat = "",
                        ySortArray = [],
                        rules = [],
                        sortedData = this.data,
                        groupRules = [];

                    if (this.storyboard !== null && this.storyboard !== undefined && this.storyboard.categoryFields.length > 0) {
                        storyCat = this.storyboard.categoryFields[0];
                        orderedStoryboardArray = dimple._getOrderedList(this.data, storyCat, this.storyboard._orderRules);
                    }

                    // Deal with mekkos
                    if (series.x._hasCategories() && series.x._hasMeasure()) {
                        xCat = series.x.categoryFields[0];
                        xSortArray = dimple._getOrderedList(this.data, xCat, series.x._orderRules.concat([{ ordering : series.x.measure, desc : true }]));
                    }
                    if (series.y._hasCategories() && series.y._hasMeasure()) {
                        yCat = series.y.categoryFields[0];
                        ySortArray = dimple._getOrderedList(this.data, yCat, series.y._orderRules.concat([{ ordering : series.y.measure, desc : true }]));
                    }

                    if (series.categoryFields !== null && series.categoryFields !== undefined && series.categoryFields.length > 0) {
                        // Concat is used here to break the reference to the parent array, if we don't do this, in a storyboarded chart,
                        // the series rules to grow and grow until the system grinds to a halt trying to deal with them all.
                        rules = [].concat(series._orderRules);
                        seriesCat = series.categoryFields[0];
                        if (series.c !== null && series.c !== undefined && series.c._hasMeasure()) {
                            rules.push({ ordering : series.c.measure, desc : true });
                        } else if (series.z !== null && series.z !== undefined && series.z._hasMeasure()) {
                            rules.push({ ordering : series.z.measure, desc : true });
                        } else if (series.x._hasMeasure()) {
                            rules.push({ ordering : series.x.measure, desc : true });
                        } else if (series.y._hasMeasure()) {
                            rules.push({ ordering : series.y.measure, desc : true });
                        }
                        orderedSeriesArray = dimple._getOrderedList(this.data, seriesCat, rules);
                    }

                    sortedData.sort(function (a, b) {
                        var returnValue = 0;
                        if (storyCat !== "") {
                            returnValue = orderedStoryboardArray.indexOf(a[storyCat]) - orderedStoryboardArray.indexOf(b[storyCat]);
                        }
                        if (xCat !== "" && returnValue === 0) {
                            returnValue = xSortArray.indexOf(a[xCat]) - xSortArray.indexOf(b[xCat]);
                        }
                        if (yCat !== "" && returnValue === 0) {
                            returnValue = ySortArray.indexOf(a[yCat]) - ySortArray.indexOf(b[yCat]);
                        }
                        if (seriesCat !== "" && returnValue === 0) {
                            returnValue = orderedSeriesArray.indexOf(a[seriesCat]) - orderedSeriesArray.indexOf(b[seriesCat]);
                        }
                        return returnValue;
                    });

                    // Iterate every row in the data to calculate the return values
                    sortedData.forEach(function (d) {
                        // Reset the index
                        var foundIndex = -1,
                            xField = getField(series.x, d),
                            yField = getField(series.y, d),
                            zField = getField(series.z, d),
                            // Get the aggregate field using the other fields if necessary
                            aggField = [],
                            key,
                            k,
                            newRow,
                            updateData;
                        if (series.categoryFields === null || series.categoryFields === undefined || series.categoryFields.length === 0) {
                            aggField = ["All"];
                        } else if (series.categoryFields.length === 1 && d[series.categoryFields[0]] === undefined) {
                            aggField = [series.categoryFields[0]];
                        } else {
                            series.categoryFields.forEach(function (cat) {
                                aggField.push(d[cat]);
                            }, this);
                        }
                        // Add a key
                        key = aggField.join("/") + "_" + xField.join("/") + "_" + yField.join("/") + "_" + zField.join("/");
                        // See if this field has already been added. 
                        for (k = 0; k < returnData.length; k += 1) {
                            if (returnData[k].key === key) {
                                foundIndex = k;
                                break;
                            }
                        }
                        // If the field was not added, do so here
                        if (foundIndex === -1) {
                            newRow = {
                                key: key,
                                aggField: aggField,
                                xField: xField,
                                xValue: null,
                                xCount: 0,
                                yField: yField,
                                yValue: null,
                                yCount: 0,
                                zField: zField,
                                zValue: null,
                                zCount: 0,
                                cValue: 0,
                                cCount: 0,
                                x: 0,
                                y: 0,
                                xOffset: 0,
                                yOffset: 0,
                                width: 0,
                                height: 0,
                                cx: 0,
                                cy: 0,
                                xBound: 0,
                                yBound: 0,
                                xValueList: [],
                                yValueList: [],
                                zValueList: [],
                                cValueList: [],
                                fill: {},
                                stroke: {}
                            };
                            returnData.push(newRow);
                            foundIndex = returnData.length - 1;
                        }

                        // Update the return data for the passed axis
                        updateData = function (axis, storyboard) {
                            var passStoryCheck = true,
                                lhs = { value: 0, count: 1 },
                                rhs = { value: 0, count: 1 },
                                selectStoryValue,
                                compare = "",
                                retRow;
                            if (storyboard !== null) {
                                selectStoryValue = storyboard.getFrameValue();
                                storyboard.categoryFields.forEach(function (cat, m) {
                                    if (m > 0) {
                                        compare += "/";
                                    }
                                    compare += d[cat];
                                    passStoryCheck = (compare === selectStoryValue);
                                }, this);
                            }
                            if (axis !== null && axis !== undefined) {
                                if (passStoryCheck) {
                                    retRow = returnData[foundIndex];
                                    if (axis._hasMeasure()) {
                                        // Treat undefined values as zero
                                        if (d[axis.measure] === undefined) {
                                            d[axis.measure] = 0;
                                        }
                                        // Keep a distinct list of values to calculate a distinct count in the case of a non-numeric value being found
                                        if (retRow[axis.position + "ValueList"].indexOf(d[axis.measure]) === -1) {
                                            retRow[axis.position + "ValueList"].push(d[axis.measure]);
                                        }
                                        // The code above is outside this check for non-numeric values because we might encounter one far down the list, and
                                        // want to have a record of all values so far.
                                        if (isNaN(parseFloat(d[axis.measure]))) {
                                            useCount[axis.position] = true;
                                        }
                                        // Set the value using the aggregate function method
                                        lhs.value = retRow[axis.position + "Value"];
                                        lhs.count = retRow[axis.position + "Count"];
                                        rhs.value = d[axis.measure];
                                        retRow[axis.position + "Value"] = series.aggregate(lhs, rhs);
                                        retRow[axis.position + "Count"] += 1;
                                    }
                                }
                            }
                        };
                        // Update all the axes
                        updateData(series.x, this.storyboard);
                        updateData(series.y, this.storyboard);
                        updateData(series.z, this.storyboard);
                        updateData(series.c, this.storyboard);
                    }, this);
                    // Get secondary elements if necessary
                    if (series.x !== null && series.x !== undefined && series.x._hasCategories() && series.x.categoryFields.length > 1 && secondaryElements.x !== undefined) {
                        groupRules = [];
                        if (series.y._hasMeasure()) {
                            groupRules.push({ ordering : series.y.measure, desc : true });
                        }
                        secondaryElements.x = dimple._getOrderedList(this.data, series.x.categoryFields[1], series.x._groupOrderRules.concat(groupRules));
                    }
                    if (series.y !== null && series.y !== undefined && series.y._hasCategories() && series.y.categoryFields.length > 1 && secondaryElements.y !== undefined) {
                        groupRules = [];
                        if (series.x._hasMeasure()) {
                            groupRules.push({ ordering : series.x.measure, desc : true });
                        }
                        secondaryElements.y = dimple._getOrderedList(this.data, series.y.categoryFields[1], series.y._groupOrderRules.concat(groupRules));
                        secondaryElements.y.reverse();
                    }
                    returnData.forEach(function (ret) {
                        if (series.x !== null) {
                            if (useCount.x === true) { ret.xValue = ret.xValueList.length; }
                            tot = (totals.x[ret.xField.join("/")] === null || totals.x[ret.xField.join("/")] === undefined ? 0 : totals.x[ret.xField.join("/")]) + (series.y._hasMeasure() ? Math.abs(ret.yValue) : 0);
                            totals.x[ret.xField.join("/")] = tot;
                        }
                        if (series.y !== null) {
                            if (useCount.y === true) { ret.yValue = ret.yValueList.length; }
                            tot = (totals.y[ret.yField.join("/")] === null || totals.y[ret.yField.join("/")] === undefined ? 0 : totals.y[ret.yField.join("/")]) + (series.x._hasMeasure() ? Math.abs(ret.xValue) : 0);
                            totals.y[ret.yField.join("/")] = tot;
                        }
                        if (series.z !== null) {
                            if (useCount.z === true) { ret.zValue = ret.zValueList.length; }
                            tot = (totals.z[ret.zField.join("/")] === null || totals.z[ret.zField.join("/")] === undefined ? 0 : totals.z[ret.zField.join("/")]) + (series.z._hasMeasure() ? Math.abs(ret.zValue) : 0);
                            totals.z[ret.zField.join("/")] = tot;
                        }
                        if (series.c !== null) {
                            if (colorBounds.min === null || ret.cValue < colorBounds.min) { colorBounds.min = ret.cValue; }
                            if (colorBounds.max === null || ret.cValue > colorBounds.max) { colorBounds.max = ret.cValue; }
                        }
                    }, this);
                    // Before calculating the positions we need to sort elements

                    // Set all the dimension properties of the data
                    for (key in totals.x) { if (totals.x.hasOwnProperty(key)) { grandTotals.x += totals.x[key]; } }
                    for (key in totals.y) { if (totals.y.hasOwnProperty(key)) { grandTotals.y += totals.y[key]; } }
                    for (key in totals.z) { if (totals.z.hasOwnProperty(key)) { grandTotals.z += totals.z[key]; } }

                    returnData.forEach(function (ret) {
                        var baseColor,
                            targetColor,
                            scale,
                            colorVal,
                            floatingPortion,
                            getAxisData = function (axis, opp, size) {
                                var totalField,
                                    value,
                                    selectValue,
                                    pos,
                                    cumValue;
                                if (axis !== null && axis !== undefined) {
                                    pos = axis.position;
                                    if (!axis._hasCategories()) {
                                        value = (axis.showPercent ? ret[pos + "Value"] / totals[opp][ret[opp + "Field"].join("/")] : ret[pos + "Value"]);
                                        totalField = ret[opp + "Field"].join("/") + (ret[pos + "Value"] >= 0);
                                        cumValue = running[pos][totalField] = ((running[pos][totalField] === null || running[pos][totalField] === undefined || pos === "z") ? 0 : running[pos][totalField]) + value;
                                        selectValue = ret[pos + "Bound"] = ret["c" + pos] = (((pos === "x" || pos === "y") && series.stacked) ? cumValue : value);
                                        ret[size] = value;
                                        ret[pos] = selectValue - (((pos === "x" && value >= 0) || (pos === "y" && value <= 0)) ? value : 0);
                                    } else {
                                        if (axis._hasMeasure()) {
                                            totalField = ret[axis.position + "Field"].join("/");
                                            value = (axis.showPercent ? totals[axis.position][totalField] / grandTotals[axis.position] : totals[axis.position][totalField]);
                                            if (addedCats.indexOf(totalField) === -1) {
                                                catTotals[totalField] = value + (addedCats.length > 0 ? catTotals[addedCats[addedCats.length - 1]] : 0);
                                                addedCats.push(totalField);
                                            }
                                            selectValue = ret[pos + "Bound"] = ret["c" + pos] = (((pos === "x" || pos === "y") && series.stacked) ? catTotals[totalField] : value);
                                            ret[size] = value;
                                            ret[pos] = selectValue - (((pos === "x" && value >= 0) || (pos === "y" && value <= 0)) ? value : 0);
                                        } else {
                                            ret[pos] = ret["c" + pos] = ret[pos + "Field"][0];
                                            ret[size] = 1;
                                            if (secondaryElements[pos] !== undefined && secondaryElements[pos] !== null && secondaryElements[pos].length >= 2) {
                                                ret[pos + "Offset"] = secondaryElements[pos].indexOf(ret[pos + "Field"][1]);
                                                ret[size] = 1 / secondaryElements[pos].length;
                                            }
                                        }
                                    }
                                }
                            };
                        getAxisData(series.x, "y", "width");
                        getAxisData(series.y, "x", "height");
                        getAxisData(series.z, "z", "r");

                        // If there is a color axis
                        if (series.c !== null && colorBounds.min !== null && colorBounds.max !== null) {
                            // Handle matching min and max
                            if (colorBounds.min === colorBounds.max) {
                                colorBounds.min -= 0.5;
                                colorBounds.max += 0.5;
                            }
                            // Limit the bounds of the color value to be within the range.  Users may override the axis bounds and this
                            // allows a 2 color scale rather than blending if the min and max are set to 0 and 0.01 for example negative values
                            // and zero value would be 1 color and positive another.
                            colorBounds.min = (series.c.overrideMin !== null && series.c.overrideMin !== undefined ? series.c.overrideMin : colorBounds.min);
                            colorBounds.max = (series.c.overrideMax !== null && series.c.overrideMax !== undefined ? series.c.overrideMax : colorBounds.max);
                            ret.cValue = (ret.cValue > colorBounds.max ? colorBounds.max : (ret.cValue < colorBounds.min ? colorBounds.min : ret.cValue));
                            // Calculate the factors for the calculations
                            scale = d3.scale.linear().range([0, (series.c.colors === null || series.c.colors.length === 1 ? 1 : series.c.colors.length - 1)]).domain([colorBounds.min, colorBounds.max]);
                            colorVal = scale(ret.cValue);
                            floatingPortion = colorVal - Math.floor(colorVal);
                            if (ret.cValue === colorBounds.max) {
                                floatingPortion = 1;
                            }
                            // If there is a single color defined
                            if (series.c.colors !== null && series.c.colors !== undefined && series.c.colors.length === 1) {
                                baseColor = d3.rgb(series.c.colors[0]);
                                targetColor = d3.rgb(this.getColor(ret.aggField.slice(-1)[0]).fill);
                            } else if (series.c.colors !== null && series.c.colors !== undefined && series.c.colors.length > 1) {
                                baseColor = d3.rgb(series.c.colors[Math.floor(colorVal)]);
                                targetColor = d3.rgb(series.c.colors[Math.ceil(colorVal)]);
                            } else {
                                baseColor = d3.rgb("white");
                                targetColor = d3.rgb(this.getColor(ret.aggField.slice(-1)[0]).fill);
                            }
                            // Calculate the correct grade of color
                            baseColor.r = Math.floor(baseColor.r + (targetColor.r - baseColor.r) * floatingPortion);
                            baseColor.g = Math.floor(baseColor.g + (targetColor.g - baseColor.g) * floatingPortion);
                            baseColor.b = Math.floor(baseColor.b + (targetColor.b - baseColor.b) * floatingPortion);
                            // Set the colors on the row
                            ret.fill = baseColor.toString();
                            ret.stroke = baseColor.darker(0.5).toString();
                        }

                    }, this);

                    // populate the data in the series
                    series._positionData = returnData;

                }, this);
            }
        };


        // Copyright: 2013 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/chart/methods/_registerEventHandlers.js
        // Register events, handle standard d3 shape events
        this._registerEventHandlers = function (series) {
            if (series._eventHandlers !== null && series._eventHandlers.length > 0) {
                series._eventHandlers.forEach(function (thisHandler) {
                    if (thisHandler.handler !== null && typeof (thisHandler.handler) === "function") {
                        series.shapes.on(thisHandler.event, function (d) {
                            var e = new dimple.eventArgs();
                            if (series.chart.storyboard !== null) {
                                e.frameValue = series.chart.storyboard.getFrameValue();
                            }
                            e.seriesValue = d.aggField;
                            e.xValue = d.x;
                            e.yValue = d.y;
                            e.zValue = d.z;
                            e.colorValue = d.cValue;
                            e.seriesShapes = series.shapes;
                            e.selectedShape = d3.select(this);
                            thisHandler.handler(e);
                        });
                    }
                }, this);
            }
        };


        // Copyright: 2013 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/chart/methods/addAxis.js
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.chart#wiki-addAxis
        this.addAxis = function (position, categoryFields, measure, timeField, logField) {
            // Convert the passed category fields to an array in case a single string is sent
            if (categoryFields !== null && categoryFields !== undefined) {
                categoryFields = [].concat(categoryFields);
            }
            // Create the axis object based on the passed parameters
            var axis = new dimple.axis(
                this,
                position,
                categoryFields,
                measure,
                timeField,
                logField
            );
            // Add the axis to the array for the chart
            this.axes.push(axis);
            // return the axis
            return axis;
        };


        // Copyright: 2013 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/chart/methods/addCategoryAxis.js
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.chart#wiki-addCategoryAxis
        this.addCategoryAxis = function (position, categoryFields) {
            return this.addAxis(position, categoryFields, null);
        };


        // Copyright: 2013 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/chart/methods/addColorAxis.js
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.chart#wiki-addColorAxis
        this.addColorAxis = function (measure, colors) {
            var colorAxis = this.addAxis("c", null, measure);
            colorAxis.colors = (colors === null || colors === undefined ? null : [].concat(colors));
            return colorAxis;
        };


        // Source: /src/objects/chart/methods/addLegend.js
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.chart#wiki-addLegend
        this.addLegend = function (x, y, width, height, horizontalAlign, series) {
            // Use all series by default
            series = (series === null || series === undefined ? this.series : [].concat(series));
            horizontalAlign = (horizontalAlign === null || horizontalAlign === undefined ? "left" : horizontalAlign);
            // Create the legend
            var legend = new dimple.legend(this, x, y, width, height, horizontalAlign, series);
            // Add the legend to the array
            this.legends.push(legend);
            // Return the legend object
            return legend;
        };
        // Copyright: 2013 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/chart/methods/addLogAxis.js
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.chart#wiki-addLogAxis
        this.addLogAxis = function (position, logField, logFormat, logBase) {
            var axis = this.addAxis(position, null, logField, null, logField);
            if (logBase !== null && logBase !== undefined) {
                axis.logBase = logBase;
            }
            if (logFormat !== null && logFormat !== undefined) {
                axis.logFormat = logFormat;
            }
            return axis;
        };
        // Copyright: 2013 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/chart/methods/addMeasureAxis.js
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.chart#wiki-addMeasureAxis
        this.addMeasureAxis = function (position, measure) {
            return this.addAxis(position, null, measure);
        };


        // Copyright: 2013 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/chart/methods/addPctAxis.js
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.chart#wiki-addPctAxis
        this.addPctAxis = function (position, measure, categories) {
            var pctAxis = null;
            if (categories !== null && categories !== undefined) {
                pctAxis = this.addAxis(position, categories, measure);
            } else {
                pctAxis = this.addMeasureAxis(position, measure);
            }
            pctAxis.showPercent = true;
            return pctAxis;
        };


        // Copyright: 2013 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/chart/methods/addSeries.js
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.chart#wiki-addSeries
        this.addSeries = function (categoryFields, plotFunction, axes) {
            // Deal with no axes passed
            if (axes === null || axes === undefined) { axes = this.axes; }
            // Deal with no plot function
            if (plotFunction === null || plotFunction === undefined) { plotFunction = dimple.plot.bubble; }
            // Axis objects to be picked from the array
            var xAxis = null,
                yAxis = null,
                zAxis = null,
                colorAxis = null,
                series;
            // Iterate the array and pull out the relevant axes
            axes.forEach(function (axis) {
                if (axis !== null && plotFunction.supportedAxes.indexOf(axis.position) > -1) {
                    if (xAxis === null && axis.position[0] === "x") {
                        xAxis = axis;
                    } else if (yAxis === null && axis.position[0] === "y") {
                        yAxis = axis;
                    } else if (zAxis === null && axis.position[0] === "z") {
                        zAxis = axis;
                    } else if (colorAxis === null && axis.position[0] === "c") {
                        colorAxis = axis;
                    }
                }
            }, this);
            // Put single values into single value arrays
            if (categoryFields !== null && categoryFields !== undefined) {
                categoryFields = [].concat(categoryFields);
            }
            // Create a series object
            series = new dimple.series(
                this,
                categoryFields,
                xAxis,
                yAxis,
                zAxis,
                colorAxis,
                plotFunction,
                dimple.aggregateMethod.sum,
                plotFunction.stacked
            );
            // Add the series to the chart's array
            this.series.push(series);
            // Return the series
            return series;
        };


        // Copyright: 2013 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/chart/methods/addTimeAxis.js
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.chart#wiki-addTimeAxis
        this.addTimeAxis = function (position, timeField, inputFormat, outputFormat) {
            var axis = this.addAxis(position, null, null, timeField);
            axis.tickFormat = outputFormat;
            axis.dateParseFormat = inputFormat;
            return axis;
        };


        // Copyright: 2013 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/chart/methods/assignColor.js
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.chart#wiki-assignColor
        this.assignColor = function (tag, fill, stroke, opacity) {
            this._assignedColors[tag] = new dimple.color(fill, stroke, opacity);
            return this._assignedColors[tag];
        };


        // Copyright: 2013 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/chart/methods/defaultColors.js
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.chart#wiki-defaultColors
        this.defaultColors = [
            new dimple.color("#80B1D3"),
            new dimple.color("#FB8072"),
            new dimple.color("#FDB462"),
            new dimple.color("#B3DE69"),
            new dimple.color("#FFED6F"),
            new dimple.color("#BC80BD"),
            new dimple.color("#8DD3C7"),
            new dimple.color("#CCEBC5"),
            new dimple.color("#FFFFB3"),
            new dimple.color("#BEBADA"),
            new dimple.color("#FCCDE5"),
            new dimple.color("#D9D9D9")
        ];
        // Copyright: 2013 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/chart/methods/draw.js
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.chart#wiki-draw
        this.draw = function (duration) {
            // Deal with optional parameter
            duration = (duration === null || duration === undefined ? 0 : duration);
            // Catch the first x and y
            var firstX = null,
                firstY = null,
                distinctCats,
                xGridSet = false,
                yGridSet = false;
            // Many of the draw methods use positioning data in each series.  Therefore we should
            // decorate the series with it now
            this._getSeriesData();
            // Iterate the axes and calculate bounds, this is done within the chart because an
            // axis' bounds are determined by other axes and the way that series tie them together
            this.axes.forEach(function (axis) {
                axis._min = 0;
                axis._max = 0;
                // Check that the axis has a measure
                if (axis._hasMeasure()) {
                    // Is this axis linked to a series
                    var linked = false;
                    // Find any linked series
                    this.series.forEach(function (series) {
                        // if this axis is linked
                        if (series[axis.position] === axis) {
                            // Get the bounds
                            var bounds = series._axisBounds(axis.position);
                            if (axis._min > bounds.min) { axis._min = bounds.min; }
                            if (axis._max < bounds.max) { axis._max = bounds.max; }
                            linked = true;
                        }
                    }, this);
                    // If the axis is not linked, use the data bounds, this is unlikely to be used
                    // in a real context, but when developing it is nice to see axes before any series have
                    // been added.
                    if (!linked) {
                        this.data.forEach(function (d) {
                            if (axis._min > d[axis.measure]) { axis._min = d[axis.measure]; }
                            if (axis._max < d[axis.measure]) { axis._max = d[axis.measure]; }
                        }, this);
                    }
                } else if (axis._hasTimeField()) {
                    // Parse the dates and assign the min and max
                    axis._min = null;
                    axis._max = null;
                    this.data.forEach(function (d) {
                        var dt = axis._parseDate(d[axis.timeField]);
                        if (axis._min === null || dt < axis._min) {
                            axis._min = dt;
                        }
                        if (axis._max === null || dt > axis._max) {
                            axis._max = dt;
                        }
                    }, this);
                } else if (axis._hasCategories()) {
                    // A category axis is just set to show the number of categories
                    axis._min = 0;
                    distinctCats = [];
                    this.data.forEach(function (d) {
                        if (distinctCats.indexOf(d[axis.categoryFields[0]]) === -1) {
                            distinctCats.push(d[axis.categoryFields[0]]);
                        }
                    }, this);
                    axis._max = distinctCats.length;
                }


                // Update the axis now we have all information set
                axis._update();

                // Record the index of the first x and first y axes
                if (firstX === null && axis.position === "x") {
                    firstX = axis;
                } else if (firstY === null && axis.position === "y") {
                    firstY = axis;
                }
            }, this);
            // Iterate the axes again
            this.axes.forEach(function (axis) {
                // Don't animate axes on first draw
                var firstDraw = false,
                    transform = null,
                    gridSize = 0,
                    gridTransform = null,
                    handleTrans,
                    rotated = false,
                    widest = 0,
                    box = { l: null, t: null, r: null, b: null },
                    titleX = 0,
                    titleY = 0,
                    rotate = "",
                    chart = this;
                if (axis.gridlineShapes === null) {
                    if (axis.showGridlines || (axis.showGridlines === null && !axis._hasCategories() && ((!xGridSet && axis.position === "x") || (!yGridSet && axis.position === "y")))) {
                        // Add a group for the gridlines to allow css formatting
                        axis.gridlineShapes = this._group.append("g").attr("class", "gridlines");
                        if (axis.position === "x") {
                            xGridSet = true;
                        } else {
                            yGridSet = true;
                        }
                    }
                } else {
                    if (axis.position === "x") {
                        xGridSet = true;
                    } else {
                        yGridSet = true;
                    }
                }
                if (axis.shapes === null) {
                    // Add a group for the axes to allow css formatting
                    axis.shapes = this._group.append("g").attr("class", "axis");
                    firstDraw = true;
                }
                // If this is the first x and there is a y axis cross them at zero
                if (axis === firstX && firstY !== null) {
                    transform = "translate(0, " + (firstY.categoryFields === null || firstY.categoryFields.length === 0 ? firstY._scale(0) : this.y + this.height) + ")";
                    gridTransform = "translate(0, " + (axis === firstX ? this.y + this.height : this.y) + ")";
                    gridSize = -this.height;
                } else if (axis === firstY && firstX !== null) {
                    transform = "translate(" + (firstX.categoryFields === null || firstX.categoryFields.length === 0 ? firstX._scale(0) : this.x) + ", 0)";
                    gridTransform = "translate(" + (axis === firstY ? this.x : this.x + this.width) + ", 0)";
                    gridSize = -this.width;
                } else if (axis.position === "x") {
                    gridTransform = transform = "translate(0, " + (axis === firstX ? this.y + this.height : this.y) + ")";
                    gridSize = -this.height;
                } else if (axis.position === "y") {
                    gridTransform = transform = "translate(" + (axis === firstY ? this.x : this.x + this.width) + ", 0)";
                    gridSize = -this.width;
                }
                // Draw the axis
                // This code might seem unneccesary but even applying a duration of 0 to a transition will cause the code to execute after the 
                // code below and precedence is important here.
                handleTrans = function (ob) {
                    var returnObj;
                    if (transform === null || duration === 0 || firstDraw) {
                        returnObj = ob;
                    } else {
                        returnObj = ob.transition().duration(duration);
                    }
                    return returnObj;
                };
                if (transform !== null && axis._draw !== null) {

                    // Add a tick format
                    if (axis._hasTimeField()) {
                        handleTrans(axis.shapes).call(axis._draw.ticks(axis._getTimePeriod(), axis.timeInterval).tickFormat(axis._getFormat())).attr("transform", transform);
                    } else {
                        handleTrans(axis.shapes).call(axis._draw.tickFormat(axis._getFormat())).attr("transform", transform);
                    }
                    if (axis.gridlineShapes !== null) {
                        handleTrans(axis.gridlineShapes).call(axis._draw.tickSize(gridSize, 0, 0).tickFormat("")).attr("transform", gridTransform);
                    }
                    // Move labels around
                    if (axis.measure === null || axis.measure === undefined) {
                        if (axis.position === "x") {
                            handleTrans(axis.shapes.selectAll(".axis text")).attr("x", (this.width / axis._max) / 2);
                        } else if (axis.position === "y") {
                            handleTrans(axis.shapes.selectAll(".axis text")).attr("y", -1 * (this.height / axis._max) / 2);
                        }
                    }
                    if (axis.categoryFields !== null && axis.categoryFields !== undefined && axis.categoryFields.length > 0) {
                        // Off set the labels to counter the transform.  This will put the labels along the outside of the chart so they
                        // don't interfere with the chart contents
                        if (axis === firstX && (firstY.categoryFields === null || firstY.categoryFields.length === 0)) {
                            handleTrans(axis.shapes.selectAll(".axis text")).attr("y", this.y + this.height - firstY._scale(0) + 9);
                        }
                        if (axis === firstY && (firstX.categoryFields === null || firstX.categoryFields.length === 0)) {
                            handleTrans(axis.shapes.selectAll(".axis text")).attr("x", -1 * (firstX._scale(0) - this.x) - 9);
                        }
                    }
                }
                // Set some initial css values
                if (!this.noFormats) {
                    handleTrans(axis.shapes.selectAll(".axis text"))
                        .style("font-family", "sans-serif")
                        .style("font-size", (this.height / 35 > 10 ? this.height / 35 : 10) + "px");
                    handleTrans(axis.shapes.selectAll(".axis path, .axis line"))
                        .style("fill", "none")
                        .style("stroke", "black")
                        .style("shape-rendering", "crispEdges");
                    if (axis.gridlineShapes !== null) {
                        handleTrans(axis.gridlineShapes.selectAll(".gridlines line"))
                            .style("fill", "none")
                            .style("stroke", "lightgray")
                            .style("opacity", 0.8);
                    }
                }
                // Rotate labels, this can only be done once the formats are set
                if (axis.measure === null || axis.measure === undefined) {
                    if (axis === firstX) {
                        // If the gaps are narrower than the widest label display all labels horizontally
                        widest = 0;
                        axis.shapes.selectAll(".axis text").each(function () {
                            var w = this.getComputedTextLength();
                            widest = (w > widest ? w : widest);
                        });
                        if (widest > this.width / axis.shapes.selectAll(".axis text")[0].length) {
                            rotated = true;
                            axis.shapes.selectAll(".axis text")
                                .style("text-anchor", "start")
                                .each(function () {
                                    var rec = this.getBBox();
                                    d3.select(this)
                                        .attr("transform", "rotate(90," + rec.x + "," + (rec.y + (rec.height / 2)) + ") translate(-5, 0)");
                                });
                        }
                    } else if (axis.position === "x") {
                        // If the gaps are narrower than the widest label display all labels horizontally
                        widest = 0;
                        axis.shapes.selectAll(".axis text")
                            .each(function () {
                                var w = this.getComputedTextLength();
                                widest = (w > widest ? w : widest);
                            });
                        if (widest > this.width / axis.shapes.selectAll(".axis text")[0].length) {
                            rotated = true;
                            axis.shapes.selectAll(".axis text")
                                .style("text-anchor", "end")
                                .each(function () {
                                    var rec = this.getBBox();
                                    d3.select(this)
                                        .attr("transform", "rotate(90," + (rec.x + rec.width) + "," + (rec.y + (rec.height / 2)) + ") translate(5, 0)");
                                });
                        }
                    }
                }
                if (axis.titleShape === null && axis.shapes !== null && axis.shapes.node().firstChild !== null) {
                    // Get the bounds of the axis objects
                    axis.shapes.selectAll(".axis text")
                        .each(function () {
                            var rec = this.getBBox();
                            if (box.l === null ||  -9 - rec.width < box.l) {
                                box.l = -9 - rec.width;
                            }
                            if (box.r === null || rec.x + rec.width > box.r) {
                                box.r = rec.x + rec.width;
                            }
                            if (rotated) {
                                if (box.t === null || rec.y + rec.height - rec.width < box.t) {
                                    box.t = rec.y + rec.height - rec.width;
                                }
                                if (box.b === null || rec.height + rec.width > box.b) {
                                    box.b = rec.height + rec.width;
                                }
                            } else {
                                if (box.t === null || rec.y < box.t) {
                                    box.t = rec.y;
                                }
                                if (box.b === null || 9 + rec.height > box.b) {
                                    box.b = 9 + rec.height;
                                }
                            }
                        });

                    if (axis.position === "x") {
                        if (axis === firstX) {
                            titleY = this.y + this.height + box.b + 5;
                        } else {
                            titleY = this.y + box.t - 10;
                        }
                        titleX = this.x + (this.width / 2);
                    } else if (axis.position === "y") {
                        if (axis === firstY) {
                            titleX = this.x + box.l - 10;
                        } else {
                            titleX = this.x + this.width + box.r + 20;
                        }
                        titleY = this.y + (this.height / 2);
                        rotate = "rotate(270, " + titleX + ", " + titleY + ")";
                    }

                    // Add a title for the axis
                    axis.titleShape = this._group.append("text").attr("class", "axis title");
                    axis.titleShape
                        .attr("x", titleX)
                        .attr("y", titleY)
                        .attr("text-anchor", "middle")
                        .attr("transform", rotate)
                        .text((axis.categoryFields === null || axis.categoryFields === undefined || axis.categoryFields.length === 0 ? axis.measure : axis.categoryFields.join("/")))
                        .each(function () {
                            if (!chart.noFormats) {
                                d3.select(this)
                                    .style("font-family", "sans-serif")
                                    .style("font-size", (chart.height / 35 > 10 ? chart.height / 35 : 10) + "px");
                            }
                        });

                    // Offset Y position to baseline. This previously used dominant-baseline but this caused
                    // browser inconsistency
                    if (axis === firstX) {
                        axis.titleShape.each(function () {
                            d3.select(this).attr("y", titleY + this.getBBox().height / 1.65);
                        });
                    } else if (axis === firstY) {
                        axis.titleShape.each(function () {
                            d3.select(this).attr("x", titleX + this.getBBox().height / 1.65);
                        });
                    }
                }
            }, this);

            // Iterate the series
            this.series.forEach(function (series) {
                series.plot.draw(this, series, duration);
                this._registerEventHandlers(series);
            }, this);

            // Iterate the legends
            this.legends.forEach(function (legend) {
                legend._draw(duration);
            }, this);

            // If the chart has a storyboard
            if (this.storyboard !== null && this.storyboard !== undefined) {
                this.storyboard._drawText();
                if (this.storyboard.autoplay) {
                    this.storyboard.startAnimation();
                }
            }

            // Return the chart for chaining
            return this;

        };

        // Copyright: 2013 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/chart/methods/getColor.js
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.chart#wiki-getColor
        this.getColor = function (tag) {
            // If no color is assigned, do so here
            if (this._assignedColors[tag] === null || this._assignedColors[tag] === undefined) {
                this._assignedColors[tag] = this.defaultColors[this._nextColor];
                this._nextColor = (this._nextColor + 1) % this.defaultColors.length;
            }
            // Return the color
            return this._assignedColors[tag];
        };


        // Copyright: 2013 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/chart/methods/setBounds.js
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.chart#wiki-setBounds
        this.setBounds = function (x, y, width, height) {
            // Define the bounds
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            // Refresh the axes to redraw them against the new bounds
            this.axes.forEach(function (axis) {
                axis._update();
            }, this);
            // return the chart object for method chaining
            return this;
        };

        // Copyright: 2013 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/chart/methods/setStoryboard.js
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.chart#wiki-setStoryboard
        this.setStoryboard = function (categoryFields, tickHandler) {
            // Create and assign the storyboard
            this.storyboard = new dimple.storyboard(this, categoryFields);
            // Set the event handler
            if (tickHandler !== null && tickHandler !== undefined) {
                this.storyboard.onTick = tickHandler;
            }
            // Return the storyboard
            return this.storyboard;
        };

    };
    // End dimple.chart


    // Copyright: 2013 PMSI-AlignAlytics
    // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
    // Source: /src/objects/color/begin.js
    // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.color
    dimple.color = function (fill, stroke, opacity) {

        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.color#wiki-fill
        this.fill = fill;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.color#wiki-stroke
        this.stroke = (stroke === null || stroke === undefined ? d3.rgb(fill).darker(0.5).toString() : stroke);
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.color#wiki-opacity
        this.opacity = (opacity === null || opacity === undefined ? 0.8 : opacity);

    };
    // End dimple.color


    // Copyright: 2013 PMSI-AlignAlytics
    // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
    // Source: /src/objects/eventArgs/begin.js
    // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.eventArgs
    dimple.eventArgs = function () {

        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.eventArgs#wiki-seriesValue
        this.seriesValue = null;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.eventArgs#wiki-xValue
        this.xValue = null;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.eventArgs#wiki-yValue
        this.yValue = null;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.eventArgs#wiki-zValue
        this.zValue = null;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.eventArgs#wiki-colorValue
        this.colorValue = null;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.eventArgs#wiki-frameValue
        this.frameValue = null;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.eventArgs#wiki-seriesShapes
        this.seriesShapes = null;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.eventArgs#wiki-selectedShape
        this.selectedShape = null;

    };
    // End dimple.eventArgs


    // Copyright: 2013 PMSI-AlignAlytics
    // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
    // Source: /src/objects/legend/begin.js
    // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.legend
    dimple.legend = function (chart, x, y, width, height, horizontalAlign, series) {

        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.legend#wiki-chart
        this.chart = chart;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.legend#wiki-series
        this.series = series;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.legend#wiki-x
        this.x = x;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.legend#wiki-y
        this.y = y;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.legend#wiki-width
        this.width = width;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.legend#wiki-height
        this.height = height;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.legend#wiki-horizontalAlign
        this.horizontalAlign = horizontalAlign;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.legend#wiki-shapes
        this.shapes = null;
        // Source: /src/objects/legend/methods/_draw.js
        this._draw = function (duration) {

            // Create an array of distinct color elements from the series
            var legendArray = this._getEntries(),
                maxWidth = 0,
                maxHeight = 0,
                runningX = 0,
                runningY = 0,
                keyWidth = 15,
                keyHeight = 9,
                self = this,
                theseShapes;

            // If there is already a legend, fade to transparent and remove
            if (this.shapes !== null && this.shapes !== undefined) {
                this.shapes
                    .transition()
                    .duration(duration * 0.2)
                    .attr("opacity", 0)
                    .remove();
            }

            // Create an empty hidden group for every legend entry
            // the selector here must not pick up any legend entries being removed by the
            // transition above
            theseShapes = this.chart._group
                .selectAll(".dontSelectAny")
                .data(legendArray)
                .enter()
                .append("g")
                    .attr("class", "legend")
                    .attr("opacity", 0);

            // Add text into the group
            theseShapes.append("text")
                .attr("id", function (d) { return "legend_" + d.key; })
                .attr("class", "legendText")
                .text(function(d) {
                    return d.key;
                })
                .call(function () {
                    if (!self.chart.noFormats) {
                        this.style("font-family", "sans-serif")
                            .style("font-size", (self.chart.height / 35 > 10 ? self.chart.height / 35 : 10) + "px")
                            .style("shape-rendering", "crispEdges");
                    }
                })
                .each(function () {
                    var b = this.getBBox();
                    if (b.width > maxWidth) {
                        maxWidth = b.width;
                    }
                    if (b.height > maxHeight) {
                        maxHeight = b.height;
                    }
                });

            // Add a rectangle into the group
            theseShapes.append("rect")
                .attr("class", "legendKey")
                .attr("height", keyHeight)
                .attr("width",  keyWidth);

            // Expand the bounds of the largest shape slightly.  This will be the size allocated to
            // all elements
            maxHeight = (maxHeight < keyHeight ? keyHeight : maxHeight) + 2;
            maxWidth += keyWidth + 20;

            // Iterate the shapes and position them based on the alignment and size of the legend
            theseShapes
                .each(function (d) {
                    if (runningX + maxWidth > self.width) {
                        runningX = 0;
                        runningY += maxHeight;
                    }
                    if (runningY > self.height) {
                        d3.select(this).remove();
                    } else {
                        d3.select(this).select("text")
                            .attr("x", (self.horizontalAlign === "left" ? self.x + keyWidth + 5 + runningX : self.x + (self.width - runningX - maxWidth) + keyWidth + 5))
                            .attr("y", function () {
                                // This was previously done with dominant-baseline but this is used
                                // instead due to browser inconsistancy.
                                return self.y + runningY + this.getBBox().height / 1.65;
                            })
                            .attr("width", self.width)
                            .attr("height", self.height);
                        d3.select(this).select("rect")
                            .attr("class", "legend legendKey")
                            .attr("x", (self.horizontalAlign === "left" ? self.x + runningX : self.x + (self.width - runningX - maxWidth)))
                            .attr("y", self.y + runningY)
                            .attr("height", keyHeight)
                            .attr("width",  keyWidth)
                            .style("fill", function () { return dimple._helpers.fill(d, self.chart, d.series); })
                            .style("stroke", function () { return dimple._helpers.stroke(d, self.chart, d.series); })
                            .style("opacity", function () { return dimple._helpers.opacity(d, self.chart, d.series); })
                            .style("shape-rendering", "crispEdges");
                        runningX += maxWidth;
                    }
                });

            // Fade in the shapes if this is transitioning
            theseShapes
                .transition()
                .delay(duration * 0.2)
                .duration(duration * 0.8)
                .attr("opacity", 1);

            // Assign them to the public property for modification by the user.
            this.shapes = theseShapes;
        };

        // Source: /src/objects/legend/methods/_getEntries.js
        this._getEntries = function () {
            // Create an array of distinct series values
            var entries = [];
            // If there are some series
            if (this.series !== null && this.series !== undefined) {
                // Iterate all the associated series
                this.series.forEach(function (series) {
                    // Get the series data
                    var data = series._positionData;
                    // Iterate the aggregated data
                    data.forEach(function (row) {
                        // Check whether this element is new
                        var index = -1,
                            j;
                        for (j = 0; j < entries.length; j += 1) {
                            if (entries[j].key === row.aggField.slice(-1)[0]) {
                                index = j;
                                break;
                            }
                        }
                        if (index === -1) {
                            // If it's a new element create a new row in the return array
                            entries.push({ key: row.aggField.slice(-1)[0], fill: row.fill, stroke: row.stroke, series: series, aggField: row.aggField });
                            index = entries.length - 1;
                        }
                    });
                }, this);
            }
            return entries;
        };

    };
    // End dimple.legend


    // Copyright: 2013 PMSI-AlignAlytics
    // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
    // Source: /src/objects/series/begin.js
    // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.series
    dimple.series = function (chart, categoryFields, xAxis, yAxis, zAxis, colorAxis, plotFunction, aggregateFunction, stacked) {

        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.series#wiki-chart
        this.chart = chart;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.series#wiki-x
        this.x = xAxis;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.series#wiki-y
        this.y = yAxis;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.series#wiki-z
        this.z = zAxis;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.series#wiki-c
        this.c = colorAxis;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.series#wiki-plot
        this.plot = plotFunction;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.series#wiki-categoryFields
        this.categoryFields = categoryFields;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.series#wiki-aggregateFunction
        this.aggregate = aggregateFunction;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.series#wiki-stacked
        this.stacked = stacked;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.series#wiki-barGap
        this.barGap = 0.2;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.series#wiki-clusterBarGap
        this.clusterBarGap = 0.1;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.series#wiki-lineWeight
        this.lineWeight = 2;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.series#wiki-lineMarkers
        this.lineMarkers = false;

        // Any event handlers joined to this series
        this._eventHandlers = [];
        // The series positioning information
        this._positionData = [];
        // The order definition array
        this._orderRules = [];

        // Copyright: 2013 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/series/methods/_axisBounds.js
        this._axisBounds = function (position) {
            var bounds = { min: 0, max: 0 },
                // The primary axis for this comparison
                primaryAxis = null,
                // The secondary axis for this comparison
                secondaryAxis = null,
                // The running totals of the categories
                categoryTotals = [],
                // The maximum index of category totals
                catCount = 0,
                measureName,
                fieldName,
                distinctCats,
                aggData = this._positionData;

            // If the primary axis is x the secondary is y and vice versa, a z axis has no secondary
            if (position === "x") {
                primaryAxis = this.x;
                secondaryAxis = this.y;
            } else if (position === "y") {
                primaryAxis = this.y;
                secondaryAxis = this.x;
            } else if (position === "z") {
                primaryAxis = this.z;
            } else if (position === "c") {
                primaryAxis = this.c;
            }

            // If the corresponding axis is category axis
            if (primaryAxis.showPercent) {
                // Iterate the data
                aggData.forEach(function (d) {
                    if (d[primaryAxis.position + "Bound"] < bounds.min) {
                        bounds.min = d[primaryAxis.position + "Bound"];
                    }
                    if (d[primaryAxis.position + "Bound"] > bounds.max) {
                        bounds.max = d[primaryAxis.position + "Bound"];
                    }
                }, this);
            } else if (secondaryAxis === null || secondaryAxis.categoryFields === null || secondaryAxis.categoryFields.length === 0) {
                aggData.forEach(function (d) {
                    // If the primary axis is stacked
                    if (this.stacked && (primaryAxis.position === "x" || primaryAxis.position === "y")) {
                        // We just need to push the bounds.  A stacked axis will always include 0 so I just need to push the min and max out from there
                        if (d[primaryAxis.position + "Value"] < 0) {
                            bounds.min = bounds.min + d[primaryAxis.position + "Value"];
                        } else {
                            bounds.max = bounds.max + d[primaryAxis.position + "Value"];
                        }
                    } else {
                        // If it isn't stacked we need to catch the minimum and maximum values
                        if (d[primaryAxis.position + "Value"] < bounds.min) {
                            bounds.min = d[primaryAxis.position + "Value"];
                        }
                        if (d[primaryAxis.position + "Value"] > bounds.max) {
                            bounds.max = d[primaryAxis.position + "Value"];
                        }
                    }
                }, this);
            } else {
                // If this category value (or combination if multiple fields defined) is not already in the array of categories, add it.
                measureName = primaryAxis.position + "Value";
                fieldName = secondaryAxis.position + "Field";
                // Get a list of distinct categories on the secondary axis
                distinctCats = [];
                aggData.forEach(function (d) {
                    // Create a field for this row in the aggregated data
                    var field = d[fieldName].join("/"),
                        index = distinctCats.indexOf(field);
                    if (index === -1) {
                        distinctCats.push(field);
                        index = distinctCats.length - 1;
                    }
                    // Get the index of the field
                    if (categoryTotals[index] === undefined) {
                        categoryTotals[index] = { min: 0, max: 0 };
                        if (index >= catCount) {
                            catCount = index + 1;
                        }
                    }
                    // The secondary axis is a category axis, we need to account
                    // for distribution across categories
                    if (this.stacked) {
                        if (d[measureName] < 0) {
                            categoryTotals[index].min = categoryTotals[index].min + d[measureName];
                        } else {
                            categoryTotals[index].max = categoryTotals[index].max + d[measureName];
                        }
                    } else {
                        // If it isn't stacked we need to catch the minimum and maximum values
                        if (d[measureName] < categoryTotals[index].min) {
                            categoryTotals[index].min = d[measureName];
                        }
                        if (d[measureName] > categoryTotals[index].max) {
                            categoryTotals[index].max = d[measureName];
                        }
                    }
                }, this);
                categoryTotals.forEach(function (catTot) {
                    if (catTot !== undefined) {
                        if (catTot.min < bounds.min) {
                            bounds.min = catTot.min;
                        }
                        if (catTot.max > bounds.max) {
                            bounds.max = catTot.max;
                        }
                    }
                }, this);
            }
            return bounds;
        };


        // Copyright: 2013 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/series/methods/_dropLineOrigin.js
        this._dropLineOrigin = function() {

            // Get the origin co-ordinates for axis drop lines
            var xIndex = 0,
                yIndex = 0,
                // This contains the drop line destinations
                coord = {
                    // The x co-ordinate for a y-axis drop line
                    x: null,
                    // The y co-ordinate for an x-axis drop line
                    y: null
                },
                // The origin of the first axes
                firstOrig = {
                    x: null,
                    y: null
                };
            // Get the first x and y first of all
            this.chart.axes.forEach(function (axis) {
                if (axis.position === "x" && firstOrig.x === null) {
                    if (axis._hasTimeField()) {
                        firstOrig.x = this.chart.x;
                    } else {
                        firstOrig.x = axis._origin;
                    }
                } else if (axis.position === "y" && firstOrig.y === null) {
                    if (axis._hasTimeField()) {
                        firstOrig.y = this.chart.y + this.chart.height;
                    } else {
                        firstOrig.y = axis._origin;
                    }
                }
            }, this);
            // Get the axis position based on the axis index
            this.chart.axes.forEach(function (axis) {
                if (axis.position === "x" && !this.x.hidden) {
                    if (axis === this.x) {
                        // Set the y co-ordinate for the x axis 
                        if (xIndex === 0) {
                            coord.y = firstOrig.y;
                        } else if (xIndex === 1) {
                            coord.y = this.chart.y;
                        }
                    }
                    xIndex += 1;
                } else if (axis.position === "y" && !this.y.hidden) {
                    if (axis === this.y) {
                        // Set the x co-ordinate for the y axis 
                        if (yIndex === 0) {
                            coord.x = firstOrig.x;
                        } else if (yIndex === 1) {
                            coord.x = this.chart.x + this.chart.width;
                        }
                    }
                    yIndex += 1;
                }
            }, this);

            // Return the co-ordinate
            return coord;
        };
        // Copyright: 2013 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/series/methods/addEventHandler.js
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.series#wiki-addEventHandler
        this.addEventHandler = function (event, handler) {
            this._eventHandlers.push({ event: event, handler: handler });
        };


        // Copyright: 2013 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/series/methods/addOrderRule.js
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.series#wiki-addOrderRule
        this.addOrderRule = function (ordering, desc) {
            this._orderRules.push({ ordering : ordering, desc : desc });
        };
    };
    // End dimple.series


    // Copyright: 2013 PMSI-AlignAlytics
    // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
    // Source: /src/objects/storyboard/begin.js
    // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.storyboard
    dimple.storyboard = function (chart, categoryFields) {

        // Handle an individual string as an array
        if (categoryFields !== null && categoryFields !== undefined) {
            categoryFields = [].concat(categoryFields);
        }

        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.storyboard#wiki-chart
        this.chart = chart;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.storyboard#wiki-categoryFields
        this.categoryFields = categoryFields;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.storyboard#wiki-autoplay
        this.autoplay = true;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.storyboard#wiki-frameDuration
        this.frameDuration = 3000;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.storyboard#wiki-storyLabel
        this.storyLabel = null;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.storyboard#wiki-onTick
        this.onTick = null;

        // The current frame index
        this._frame = 0;
        // The animation interval
        this._animationTimer = null;
        // The category values
        this._categories = [];
        // The category values when the last cache happened
        this._cachedCategoryFields = [];
        // The rules for ordering the storyboard
        this._orderRules = [];

        // Copyright: 2013 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/storyboard/methods/drawText.js
        this._drawText = function (duration) {
            if (this.storyLabel === null || this.storyLabel === undefined) {
                var chart = this,
                    xCount = 0;
                // Check for a secondary x axis
                this.chart.axes.forEach(function (a) {
                    if (a.position === "x") {
                        xCount += 1;
                    }
                }, this);
                this.storyLabel = this.chart._group.append("text")
                    .attr("x", this.chart.x + this.chart.width * 0.01)
                    .attr("y", this.chart.y + (this.chart.height / 35 > 10 ? this.chart.height / 35 : 10) * (xCount > 1 ? 1.25 : -1))
                    .call(function () {
                        if (!chart.noFormats) {
                            this.style("font-family", "sans-serif")
                                .style("font-size", (chart.height / 35 > 10 ? chart.height / 35 : 10) + "px");
                        }
                    });
            }
            this.storyLabel
                .transition().duration(duration * 0.2)
                .attr("opacity", 0);
            this.storyLabel
                .transition().delay(duration * 0.2)
                .text(this.categoryFields.join("\\") + ": " + this.getFrameValue())
                .transition().duration(duration * 0.8)
                .attr("opacity", 1);
        };


        // Copyright: 2013 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/storyboard/methods/_getCategories.js
        this._getCategories = function() {
            if (this._categoryFields !== this._cachedCategoryFields) {
                // Clear the array
                this._categories = [];
                // Iterate every row in the data
                this.chart.data.forEach(function (d) {
                    // Initialise the index of the categories array matching the current row
                    var index = -1,
                        field = "";
                    // If this is a category axis handle multiple category values by iterating the fields in the row and concatonate the values
                    if (this.categoryFields !== null) {
                        this.categoryFields.forEach(function (cat, i) {
                            if (i > 0) {
                                field += "/";
                            }
                            field += d[cat];
                        }, this);
                        index = this._categories.indexOf(field);
                        if (index === -1) {
                            this._categories.push(field);
                            index = this._categories.length - 1;
                        }
                    }
                }, this);
                // Mark this as cached
                this._cachedCategoryFields = this._categoryFields;
            }
            // Return the array
            return this._categories;
        };
        // Copyright: 2013 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/storyboard/methods/_goToFrameIndex.js
        this._goToFrameIndex = function (index) {
            this._frame = index % this._getCategories().length;
            // Draw it with half duration, we want the effect of a 50% animation 50% pause.
            this.chart.draw(this.frameDuration / 2);
        };


        // Copyright: 2013 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/storyboard/methods/addOrderRule.js
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.storyboard#wiki-addOrderRule
        this.addOrderRule = function (ordering, desc) {
            this._orderRules.push({ ordering : ordering, desc : desc });
        };
        // Copyright: 2013 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/storyboard/methods/getFrameValue.js
        this.getFrameValue = function () {
            var returnValue = null;
            if (this._frame >= 0 && this._getCategories().length > this._frame) {
                returnValue = this._getCategories()[this._frame];
            }
            return returnValue;
        };


        // Copyright: 2013 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/storyboard/methods/goToFrame.js
        this.goToFrame = function (frameText) {
            if (this._getCategories().length > 0) {
                var index = this._getCategories().indexOf(frameText);
                this._goToFrameIndex(index);
            }
        };


        // Copyright: 2013 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/storyboard/methods/pauseAnimation.js
        this.pauseAnimation = function () {
            if (this._animationTimer !== null) {
                window.clearInterval(this._animationTimer);
                this._animationTimer = null;
            }
        };


        // Copyright: 2013 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/storyboard/methods/startAnimation.js
        this.startAnimation = function () {
            if (this._animationTimer === null) {
                if (this.onTick !== null) { this.onTick(this.getFrameValue()); }
                this._animationTimer = window.setInterval((function (storyboard) {
                    return function () {
                        storyboard._goToFrameIndex(storyboard._frame + 1);
                        if (storyboard.onTick !== null) {
                            storyboard.onTick(storyboard.getFrameValue());
                        }
                        storyboard._drawText(storyboard.frameDuration / 2);
                    };
                }(this)), this.frameDuration);
            }
        };


        // Copyright: 2013 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/storyboard/methods/stopAnimation.js
        this.stopAnimation = function () {
            if (this._animationTimer !== null) {
                window.clearInterval(this._animationTimer);
                this._animationTimer = null;
                this._frame = 0;
            }
        };


    };
    // End dimple.storyboard


    // Copyright: 2013 PMSI-AlignAlytics
    // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
    // Source: /src/objects/aggregateMethod/avg.js
    dimple.aggregateMethod.avg = function (lhs, rhs) {
        lhs.value = (lhs.value === null || lhs.value === undefined ? 0 : parseFloat(lhs.value));
        lhs.count = (lhs.count === null || lhs.count === undefined ? 1 : parseFloat(lhs.count));
        rhs.value = (rhs.value === null || rhs.value === undefined ? 0 : parseFloat(rhs.value));
        rhs.count = (rhs.count === null || rhs.count === undefined ? 1 : parseFloat(rhs.count));
        return ((lhs.value * lhs.count) + (rhs.value * rhs.count)) / (lhs.count + rhs.count);
    };

    // Copyright: 2013 PMSI-AlignAlytics
    // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
    // Source: /src/objects/aggregateMethod/count.js
    dimple.aggregateMethod.count = function (lhs, rhs) {
        lhs.count = (lhs.count === null || lhs.count === undefined ? 0 : parseFloat(lhs.count));
        rhs.count = (rhs.count === null || rhs.count === undefined ? 0 : parseFloat(rhs.count));
        return lhs.count + rhs.count;
    };

    // Copyright: 2013 PMSI-AlignAlytics
    // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
    // Source: /src/objects/aggregateMethod/max.js
    dimple.aggregateMethod.max = function (lhs, rhs) {
        lhs.value = (lhs.value === null || lhs.value === undefined ? 0 : parseFloat(lhs.value));
        rhs.value = (rhs.value === null || rhs.value === undefined ? 0 : parseFloat(rhs.value));
        return lhs.value > rhs.value ? lhs.value : rhs.value;
    };

    // Copyright: 2013 PMSI-AlignAlytics
    // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
    // Source: /src/objects/aggregateMethod/min.js
    dimple.aggregateMethod.min = function (lhs, rhs) {
        return (lhs.value === null ? parseFloat(rhs.value) : (parseFloat(lhs.value) < parseFloat(rhs.value) ? parseFloat(lhs.value) : parseFloat(rhs.value)));
    };

    // Copyright: 2013 PMSI-AlignAlytics
    // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
    // Source: /src/objects/aggregateMethod/sum.js
    dimple.aggregateMethod.sum = function (lhs, rhs) {
        lhs.value = (lhs.value === null || lhs.value === undefined ? 0 : parseFloat(lhs.value));
        rhs.value = (rhs.value === null || rhs.value === undefined ? 0 : parseFloat(rhs.value));
        return lhs.value + rhs.value;
    };

    // Copyright: 2013 PMSI-AlignAlytics
    // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
    // Source: /src/objects/plot/area.js
    dimple.plot.area = {
        stacked: true,

        supportedAxes: ["x", "y", "c"],

        draw: function (chart, series, duration) {
            // Get self pointer for inner functions
            var self = this,
                data = series._positionData,
                uniqueValues = [],
                firstAgg = 1,
                graded = false,
                line,
                catPoints = {},
                markers;

            if (chart._tooltipGroup !== null && chart._tooltipGroup !== undefined) {
                chart._tooltipGroup.remove();
            }

            // If there is a category axis we should draw a line for each aggField.  Otherwise
            // the first aggField defines the points and the others define the line
            if (series.x._hasCategories() || series.y._hasCategories()) {
                firstAgg = 0;
            }
            data.forEach(function (d) {
                var filter = [],
                    match = false,
                    k;
                for (k = firstAgg; k < d.aggField.length; k += 1) {
                    filter.push(d.aggField[k]);
                }
                uniqueValues.forEach(function (e) {
                    match = match || (e === filter.join("/"));
                }, this);
                if (!match) {
                    uniqueValues.push(filter.join("/"));
                }
            }, this);

            if (series.c !== null && series.c !== undefined && ((series.x._hasCategories() && series.y._hasMeasure()) || (series.y._hasCategories() && series.x._hasMeasure()))) {
                graded = true;
                uniqueValues.forEach(function (seriesValue) {
                    dimple._addGradient(seriesValue, "fill-area-gradient-" + seriesValue.join("_").replace(" ", ""), (series.x._hasCategories() ? series.x : series.y), data, chart, duration, "fill");
                    dimple._addGradient(seriesValue, "stroke-area-gradient-" + seriesValue.join("_").replace(" ", ""), (series.x._hasCategories() ? series.x : series.y), data, chart, duration, "stroke");
                }, this);
            }

            line = d3.svg.line()
                    .x(function (d) { return dimple._helpers.cx(d, chart, series); })
                    .y(function (d) { return dimple._helpers.cy(d, chart, series); });

            if (series.shapes === null || series.shapes === undefined) {
                series.shapes = chart._group.selectAll(".area")
                    .data(uniqueValues)
                    .enter()
                        .append("svg:path")
                        .attr("opacity", function(d) { return chart.getColor(d).opacity; });
            }

            series.shapes
                .data(uniqueValues)
                .transition()
                .duration(duration)
                .attr("class", function (d) { return "series area " + d.replace(" ", ""); })
                .attr("d", function (d) {
                    var seriesData,
                        baseline = [],
                        max = 0,
                        row,
                        newObj,
                        j,
                        k,
                        m,
                        q,
                        r;
                    seriesData = dimple.filterData(data, "aggField", d);
                    seriesData.sort(function (a, b) {
                        var sortValue = 0;
                        if (series.x._hasCategories()) {
                            sortValue = (dimple._helpers.cx(a, chart, series) < dimple._helpers.cx(b, chart, series) ? -1 : 1);
                        } else if (series.y._hasCategories()) {
                            sortValue = (dimple._helpers.cy(a, chart, series) < dimple._helpers.cy(b, chart, series) ? -1 : 1);
                        }
                        return sortValue;
                    });
                    for (j = seriesData.length - 1; j >= 0; j -= 1) {
                        row = seriesData[j];
                        newObj = { cx: 0, cy: 0, height: 0, width: 0, xOffset: 0, yOffset: 0 };
                        if (series.x._hasCategories()) {
                            // Fix the x properties
                            newObj.cx = row.cx;
                            newObj.width = row.width;
                            newObj.xOffset = row.xOffset;
                            // Find the largest value for the xField less than this value
                            if (catPoints[row.xField] === undefined) {
                                catPoints[row.xField] = [];
                            } else {
                                max = 0;
                                for (k = 0; k <= catPoints[row.xField].length; k += 1) {
                                    q = catPoints[row.xField][k];
                                    if ((row.cy >= 0 && q >= 0) || (row.cy <= 0 && q <= 0)) {
                                        if (Math.abs(q) <= Math.abs(row.cy) && Math.abs(q) > Math.abs(max)) {
                                            max = q;
                                        }
                                    }
                                }
                                newObj.cy = max;
                            }
                            baseline.push(newObj);
                            catPoints[row.xField].push(row.cy);
                        } else if (series.y._hasCategories()) {
                            // Fix the y properties
                            newObj.cy = row.cy;
                            newObj.height = row.height;
                            newObj.yOffset = row.yOffset;
                            // Find the largest value for the xField less than this value
                            if (catPoints[row.yField] === undefined) {
                                catPoints[row.yField] = [];
                            } else {
                                max = 0;
                                for (m = 0; m <= catPoints[row.yField].length; m += 1) {
                                    r = catPoints[row.yField][m];
                                    if ((row.cx >= 0 && r >= 0) || (row.cx <= 0 && r <= 0)) {
                                        if (Math.abs(r) <= Math.abs(row.cx) && Math.abs(r) > Math.abs(max)) {
                                            max = r;
                                        }
                                    }
                                }
                                newObj.cx = max;
                            }
                            baseline.push(newObj);
                            catPoints[row.yField].push(row.cx);
                        }
                    }
                    //return line(startPoint.concat(seriesData).concat(endPoint));
                    return line(seriesData.concat(baseline).concat(seriesData[0]));
                })
                .call(function () {
                    if (!chart.noFormats) {
                        this.attr("fill", function (d) { return (graded ? "url(#fill-area-gradient-" + d.join("_").replace(" ", "") + ")" : chart.getColor(d).fill); })
                            .attr("stroke", function (d) { return (graded ? "url(#stroke-area-gradient-" + d.join("_").replace(" ", "") + ")" : chart.getColor(d).stroke); })
                            .attr("stroke-width", series.lineWeight);
                    }
                });

            // Add line markers.  
            markers = chart._group.selectAll(".markers")
                .data(data)
                .enter();

            // Add a fully opaque white circle first so we don't see a ghost of the line
            if (series.lineMarkers) {
                markers.append("circle")
                    .transition().duration(duration)
                        .attr("cx", function (d) { return dimple._helpers.cx(d, chart, series); })
                        .attr("cy", function (d) { return dimple._helpers.cy(d, chart, series); })
                        .attr("r", 2 + series.lineWeight)
                        .attr("fill", "white")
                        .attr("stroke", "none");
            }

            // Add the actual marker. We need to do this even if we aren't displaying them because they
            // catch hover events
            markers.append("circle")
                .on("mouseover", function (e) {
                    self.enterEventHandler(e, this, chart, series);
                })
                .on("mouseleave", function (e) {
                    self.leaveEventHandler(e, this, chart, series);
                })
                .transition().duration(duration)
                .attr("cx", function (d) { return dimple._helpers.cx(d, chart, series); })
                .attr("cy", function (d) { return dimple._helpers.cy(d, chart, series); })
                .attr("r", 2 + series.lineWeight)
                .attr("opacity", function (d) { return (series.lineMarkers ? chart.getColor(d).opacity : 0); })
                .call(function () {
                    if (!chart.noFormats) {
                        this.attr("fill", "white")
                            .style("stroke-width", series.lineWeight)
                            .attr("stroke", function (d) { return dimple._helpers.stroke(d, chart, series); });
                    }
                });
        },

        // Handle the mouse enter event
        enterEventHandler: function (e, shape, chart, series) {

            // The margin between the text and the box
            var textMargin = 5,
                // The margin between the ring and the popup
                popupMargin = 10,
                // The popup animation duration in ms
                animDuration = 750,
                // Collect some facts about the highlighted bubble
                selectedShape = d3.select(shape),
                cx = parseFloat(selectedShape.attr("cx")),
                cy = parseFloat(selectedShape.attr("cy")),
                r = parseFloat(selectedShape.attr("r")),
                opacity = dimple._helpers.opacity(e, chart, series),
                fill = dimple._helpers.fill(e, chart, series),
                dropDest = series._dropLineOrigin(),
                // Fade the popup stroke mixing the shape fill with 60% white
                popupStrokeColor = d3.rgb(
                    d3.rgb(fill).r + 0.6 * (255 - d3.rgb(fill).r),
                    d3.rgb(fill).g + 0.6 * (255 - d3.rgb(fill).g),
                    d3.rgb(fill).b + 0.6 * (255 - d3.rgb(fill).b)
                ),
                // Fade the popup fill mixing the shape fill with 80% white
                popupFillColor = d3.rgb(
                    d3.rgb(fill).r + 0.8 * (255 - d3.rgb(fill).r),
                    d3.rgb(fill).g + 0.8 * (255 - d3.rgb(fill).g),
                    d3.rgb(fill).b + 0.8 * (255 - d3.rgb(fill).b)
                ),
                t,
                y = 0,
                w = 0,
                h = 0,
                box,
                overlap,
                rows = [];

            if (chart._tooltipGroup !== null && chart._tooltipGroup !== undefined) {
                chart._tooltipGroup.remove();
            }
            chart._tooltipGroup = chart.svg.append("g");

            // On hover make the line marker visible immediately
            selectedShape.style("opacity", 1);
            // Add a ring around the data point
            chart._tooltipGroup.append("circle")
                .attr("cx", cx)
                .attr("cy", cy)
                .attr("r", r)
                .attr("opacity", 0)
                .style("fill", "none")
                .style("stroke", fill)
                .style("stroke-width", 1)
                .transition()
                .duration(animDuration / 2)
                .ease("linear")
                    .attr("opacity", 1)
                    .attr("r", r + 4)
                    .style("stroke-width", 2);

            // Add a drop line to the x axis
            if (dropDest.y !== null) {
                chart._tooltipGroup.append("line")
                    .attr("x1", cx)
                    .attr("y1", (cy < dropDest.y ? cy + r + 4 : cy - r - 4))
                    .attr("x2", cx)
                    .attr("y2", (cy < dropDest.y ? cy + r + 4 : cy - r - 4))
                    .style("fill", "none")
                    .style("stroke", fill)
                    .style("stroke-width", 2)
                    .style("stroke-dasharray", ("3, 3"))
                    .style("opacity", opacity)
                    .transition()
                        .delay(animDuration / 2)
                        .duration(animDuration / 2)
                        .ease("linear")
                        .attr("y2", dropDest.y);
            }

            // Add a drop line to the y axis
            if (dropDest.x !== null) {
                chart._tooltipGroup.append("line")
                    .attr("x1", (cx < dropDest.x ? cx + r + 4 : cx - r - 4))
                    .attr("y1", cy)
                    .attr("x2", (cx < dropDest.x ? cx + r + 4 : cx - r - 4))
                    .attr("y2", cy)
                    .style("fill", "none")
                    .style("stroke", fill)
                    .style("stroke-width", 2)
                    .style("stroke-dasharray", ("3, 3"))
                    .style("opacity", opacity)
                    .transition()
                        .delay(animDuration / 2)
                        .duration(animDuration / 2)
                        .ease("linear")
                        .attr("x2", dropDest.x);
            }

            // Add a group for text
            t = chart._tooltipGroup.append("g");
            // Create a box for the popup in the text group
            box = t.append("rect");

            // Add the series categories
            if (series.categoryFields !== null && series.categoryFields !== undefined && series.categoryFields.length > 0) {
                series.categoryFields.forEach(function (c, i) {
                    // If the category name and value match don't display the category name
                    rows.push(c + (e.aggField[i] !== c ? ": " + e.aggField[i] : ""));
                }, this);
            }

            if (series.x._hasTimeField()) {
                rows.push(series.x.timeField + ": " + series.x._getFormat()(e.xField[0]));
            } else if (series.x._hasCategories()) {
                // Add the x axis categories
                series.x.categoryFields.forEach(function (c, i) {
                    // If the category name and value match don't display the category name
                    rows.push(c + (e.xField[i] !== c ? ": " + e.xField[i] : ""));
                }, this);
            } else {
                // Add the axis measure value
                rows.push(series.x.measure + ": " + series.x._getFormat()(e.width));
            }

            if (series.y._hasTimeField()) {
                rows.push(series.y.timeField + ": " + series.y._getFormat()(e.yField[0]));
            } else if (series.y._hasCategories()) {
                // Add the y axis categories
                series.y.categoryFields.forEach(function (c, i) {
                    rows.push(c + (e.yField[i] !== c ? ": " + e.yField[i] : ""));
                }, this);
            } else {
                // Add the axis measure value
                rows.push(series.y.measure + ": " + series.y._getFormat()(e.height));
            }

            if (series.z !== null && series.z !== undefined) {
                // Add the axis measure value
                rows.push(series.z.measure + ": " + series.z._getFormat()(e.zValue));
            }

            if (series.c !== null && series.c !== undefined) {
                // Add the axis measure value
                rows.push(series.c.measure + ": " + series.c._getFormat()(e.cValue));
            }

            // Get distinct text rows to deal with cases where 2 axes have the same dimensionality
            rows = rows.filter(function(elem, pos) {
                return rows.indexOf(elem) === pos;
            });

            // Create a text object for every row in the popup
            t.selectAll(".textHoverShapes").data(rows).enter()
                .append("text")
                    .text(function (d) { return d; })
                    .style("font-family", "sans-serif")
                    .style("font-size", "10px");

            // Get the max height and width of the text items
            t.each(function () {
                w = (this.getBBox().width > w ? this.getBBox().width : w);
                h = (this.getBBox().width > h ? this.getBBox().height : h);
            });

            // Position the text relatve to the bubble, the absolute positioning
            // will be done by translating the group
            t.selectAll("text")
                .attr("x", 0)
                .attr("y", function () {
                    // Increment the y position
                    y += this.getBBox().height;
                    // Position the text at the centre point
                    return y - (this.getBBox().height / 2);
                });

            // Draw the box with a margin around the text
            box.attr("x", -textMargin)
                .attr("y", -textMargin)
                .attr("height", Math.floor(y + textMargin) - 0.5)
                .attr("width", w + 2 * textMargin)
                .attr("rx", 5)
                .attr("ry", 5)
                .style("fill", popupFillColor)
                .style("stroke", popupStrokeColor)
                .style("stroke-width", 2)
                .style("opacity", 0.95);

            // Shift the ring margin left or right depending on whether it will overlap the edge
            overlap = cx + r + textMargin + popupMargin + w > parseFloat(chart.svg.attr("width"));

            // Translate the shapes to the x position of the bubble (the x position of the shapes is handled)
            t.attr("transform", "translate(" +
                   (overlap ? cx - (r + textMargin + popupMargin + w) : cx + r + textMargin + popupMargin) + " , " +
                   (cy - ((y - (h - textMargin)) / 2)) +
                ")");
        },

        // Handle the mouse leave event
        leaveEventHandler: function (e, shape, chart, series) {
            // Return the opacity of the marker
            d3.select(shape).style("opacity", (series.lineMarkers ? dimple._helpers.opacity(e, chart, series) : 0));
            if (chart._tooltipGroup !== null && chart._tooltipGroup !== undefined) {
                chart._tooltipGroup.remove();
            }
        }
    };


    // Copyright: 2013 PMSI-AlignAlytics
    // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
    // Source: /src/objects/plot/bar.js
    dimple.plot.bar = {

        // By default the bar series is stacked if there are series categories
        stacked: true,

        // The axes which will affect the bar chart - not z
        supportedAxes: ["x", "y", "c"],

        // Draw the chart
        draw: function (chart, series, duration) {

            // Get self pointer for inner functions
            var self = this,
                // Get the series data
                chartData = series._positionData,
                // If the series is uninitialised create placeholders, otherwise use the existing shapes
                theseShapes = null,
                className = "series" + chart.series.indexOf(series);

            if (chart._tooltipGroup !== null && chart._tooltipGroup !== undefined) {
                chart._tooltipGroup.remove();
            }

            if (series.shapes === null || series.shapes === undefined) {
                theseShapes = chart._group.selectAll("." + className).data(chartData);
            } else {
                theseShapes = series.shapes.data(chartData, function (d) { return d.key; });
            }

            // Add
            theseShapes
                .enter()
                .append("rect")
                .attr("id", function (d) { return d.key; })
                .attr("class", function (d) { return className + " bar " + d.aggField.join(" ") + " " + d.xField.join(" ") + " " + d.yField.join(" "); })
                .attr("x", function (d) { return dimple._helpers.x(d, chart, series); })
                .attr("y", function (d) { return dimple._helpers.y(d, chart, series) + dimple._helpers.height(d, chart, series); })
                .attr("width", function (d) {return (d.xField !== null && d.xField.length > 0 ? dimple._helpers.width(d, chart, series) : 0); })
                .attr("height", function (d) {return (d.yField !== null && d.yField.length > 0 ? dimple._helpers.height(d, chart, series) : 0); })
                .attr("opacity", function (d) { return dimple._helpers.opacity(d, chart, series); })
                .on("mouseover", function (e) {
                    self.enterEventHandler(e, this, chart, series);
                })
                .on("mouseleave", function () {
                    self.leaveEventHandler(chart);
                })
                .call(function () {
                    if (!chart.noFormats) {
                        this.attr("fill", function (d) { return dimple._helpers.fill(d, chart, series); })
                            .attr("stroke", function (d) { return dimple._helpers.stroke(d, chart, series); });
                    }
                });

            // Update
            theseShapes
                .transition().duration(duration)
                .attr("x", function (d) { return dimple._helpers.x(d, chart, series); })
                .attr("y", function (d) { return dimple._helpers.y(d, chart, series); })
                .attr("width", function (d) { return dimple._helpers.width(d, chart, series); })
                .attr("height", function (d) { return dimple._helpers.height(d, chart, series); })
                .call(function () {
                    if (!chart.noFormats) {
                        this.attr("fill", function (d) { return dimple._helpers.fill(d, chart, series); })
                            .attr("stroke", function (d) { return dimple._helpers.stroke(d, chart, series); });
                    }
                });

            // Remove
            theseShapes
                .exit()
                .transition().duration(duration)
                .attr("x", function (d) { return dimple._helpers.x(d, chart, series); })
                .attr("y", function (d) { return dimple._helpers.y(d, chart, series); })
                .attr("width", function (d) { return dimple._helpers.width(d, chart, series); })
                .attr("height", function (d) { return dimple._helpers.height(d, chart, series); })
                .each("end", function () {
                    d3.select(this).remove();
                });

            // Save the shapes to the series array
            series.shapes = theseShapes;
        },

        // Handle the mouse enter event
        enterEventHandler: function (e, shape, chart, series) {

            // The margin between the text and the box
            var textMargin = 5,
                // The margin between the ring and the popup
                popupMargin = 10,
                // The popup animation duration in ms
                animDuration = 750,
                // Collect some facts about the highlighted bubble
                selectedShape = d3.select(shape),
                x = parseFloat(selectedShape.attr("x")),
                y = parseFloat(selectedShape.attr("y")),
                width = parseFloat(selectedShape.attr("width")),
                height = parseFloat(selectedShape.attr("height")),
                opacity = selectedShape.attr("opacity"),
                fill = selectedShape.attr("fill"),
                dropDest = series._dropLineOrigin(),
                // Fade the popup stroke mixing the shape fill with 60% white
                popupStrokeColor = d3.rgb(
                    d3.rgb(fill).r + 0.6 * (255 - d3.rgb(fill).r),
                    d3.rgb(fill).g + 0.6 * (255 - d3.rgb(fill).g),
                    d3.rgb(fill).b + 0.6 * (255 - d3.rgb(fill).b)
                ),
                // Fade the popup fill mixing the shape fill with 80% white
                popupFillColor = d3.rgb(
                    d3.rgb(fill).r + 0.8 * (255 - d3.rgb(fill).r),
                    d3.rgb(fill).g + 0.8 * (255 - d3.rgb(fill).g),
                    d3.rgb(fill).b + 0.8 * (255 - d3.rgb(fill).b)
                ),
                t,
                box,
                rows = [],
                // The running y value for the text elements
                yRunning = 0,
                // The maximum bounds of the text elements
                w = 0,
                h = 0;

            if (chart._tooltipGroup !== null && chart._tooltipGroup !== undefined) {
                chart._tooltipGroup.remove();
            }
            chart._tooltipGroup = chart.svg.append("g");

            // Add a drop line to the x axis
            if (!series.x._hasCategories() && dropDest.y !== null) {
                chart._tooltipGroup.append("line")
                    .attr("x1", (x < series.x._origin ? x + 1 : x + width - 1))
                    .attr("y1", (y < dropDest.y ? y + height : y))
                    .attr("x2", (x < series.x._origin ? x + 1 : x + width - 1))
                    .attr("y2", (y < dropDest.y ? y + height : y))
                    .style("fill", "none")
                    .style("stroke", fill)
                    .style("stroke-width", 2)
                    .style("stroke-dasharray", ("3, 3"))
                    .style("opacity", opacity)
                    .transition()
                        .delay(animDuration / 2)
                        .duration(animDuration / 2)
                        .ease("linear")
                    .attr("y2", dropDest.y);
            }

            // Add a drop line to the y axis
            if (!series.y._hasCategories() && dropDest.x !== null) {
                chart._tooltipGroup.append("line")
                    .attr("x1", (x < dropDest.x ? x + width : x))
                    .attr("y1", (y < series.y._origin ? y + 1 : y + height - 1))
                    .attr("x2", (x < dropDest.x ? x + width : x))
                    .attr("y2", (y < series.y._origin ? y + 1 : y + height - 1))
                    .style("fill", "none")
                    .style("stroke", fill)
                    .style("stroke-width", 2)
                    .style("stroke-dasharray", ("3, 3"))
                    .style("opacity", opacity)
                    .transition()
                        .delay(animDuration / 2)
                        .duration(animDuration / 2)
                        .ease("linear")
                    .attr("x2", dropDest.x);
            }

            // Add a group for text
            t = chart._tooltipGroup.append("g");
            // Create a box for the popup in the text group
            box = t.append("rect");

            // Add the series categories
            if (series.categoryFields !== null && series.categoryFields !== undefined && series.categoryFields.length > 0) {
                series.categoryFields.forEach(function (c, i) {
                    // If the category name and value match don't display the category name
                    rows.push(c + (e.aggField[i] !== c ? ": " + e.aggField[i] : ""));
                }, this);
            }

            if (series.x._hasTimeField()) {
                rows.push(series.x.timeField + ": " + series.x._getFormat()(e.xField[0]));
            } else if (series.x._hasCategories()) {
                // Add the x axis categories
                series.x.categoryFields.forEach(function (c, i) {
                    // If the category name and value match don't display the category name
                    rows.push(c + (e.xField[i] !== c ? ": " + e.xField[i] : ""));
                }, this);
            } else {
                // Add the axis measure value
                rows.push(series.x.measure + ": " + series.x._getFormat()(e.width));
            }

            if (series.y._hasTimeField()) {
                rows.push(series.y.timeField + ": " + series.y._getFormat()(e.yField[0]));
            } else if (series.y._hasCategories()) {
                // Add the y axis categories
                series.y.categoryFields.forEach(function (c, i) {
                    rows.push(c + (e.yField[i] !== c ? ": " + e.yField[i] : ""));
                }, this);
            } else {
                // Add the axis measure value
                rows.push(series.y.measure + ": " + series.y._getFormat()(e.height));
            }

            if (series.c !== null && series.c !== undefined) {
                // Add the axis measure value
                rows.push(series.c.measure + ": " + series.c._getFormat()(series.c.showPercent ? e.cPct : e.cValue));
            }

            // Get distinct text rows to deal with cases where 2 axes have the same dimensionality
            rows = rows.filter(function(elem, pos) {
                return rows.indexOf(elem) === pos;
            });

            // Create a text object for every row in the popup
            t.selectAll(".textHoverShapes").data(rows).enter()
                .append("text")
                    .text(function (d) { return d; })
                    .style("font-family", "sans-serif")
                    .style("font-size", "10px");

            // Get the max height and width of the text items
            t.each(function () {
                w = (this.getBBox().width > w ? this.getBBox().width : w);
                h = (this.getBBox().width > h ? this.getBBox().height : h);
            });

            // Position the text relatve to the bubble, the absolute positioning
            // will be done by translating the group
            t.selectAll("text")
                .attr("x", 0)
                .attr("y", function () {
                    // Increment the y position
                    yRunning += this.getBBox().height;
                    // Position the text at the centre point
                    return yRunning - (this.getBBox().height / 2);
                });

            // Draw the box with a margin around the text
            box.attr("x", -textMargin)
                .attr("y", -textMargin)
                .attr("height", Math.floor(yRunning + textMargin) - 0.5)
                .attr("width", w + 2 * textMargin)
                .attr("rx", 5)
                .attr("ry", 5)
                .style("fill", popupFillColor)
                .style("stroke", popupStrokeColor)
                .style("stroke-width", 2)
                .style("opacity", 0.95);

            // Shift the popup around to avoid overlapping the svg edge
            if (x + width + textMargin + popupMargin + w < parseFloat(chart.svg.attr("width"))) {
                // Draw centre right
                t.attr("transform", "translate(" +
                    (x + width + textMargin + popupMargin) + " , " +
                    (y + (height / 2) - ((yRunning - (h - textMargin)) / 2)) +
                    ")");
            } else if (x - (textMargin + popupMargin + w) > 0) {
                // Draw centre left
                t.attr("transform", "translate(" +
                    (x - (textMargin + popupMargin + w)) + " , " +
                    (y + (height / 2) - ((yRunning - (h - textMargin)) / 2)) +
                    ")");
            } else if (y + height + yRunning + popupMargin + textMargin < parseFloat(chart.svg.attr("height"))) {
                // Draw centre below
                t.attr("transform", "translate(" +
                    (x + (width / 2) - (2 * textMargin + w) / 2) + " , " +
                    (y + height + 2 * textMargin) +
                    ")");
            } else {
                // Draw centre above
                t.attr("transform", "translate(" +
                    (x + (width / 2) - (2 * textMargin + w) / 2) + " , " +
                    (y - yRunning - (h - textMargin)) +
                    ")");
            }
        },

        // Handle the mouse leave event
        leaveEventHandler: function (chart) {
            if (chart._tooltipGroup !== null && chart._tooltipGroup !== undefined) {
                chart._tooltipGroup.remove();
            }
        }
    };


    // Copyright: 2013 PMSI-AlignAlytics
    // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
    // Source: /src/objects/plot/bubble.js
    dimple.plot.bubble = {

        // By default the bubble values are not stacked
        stacked: false,

        // The axis positions affecting the bubble series
        supportedAxes: ["x", "y", "z", "c"],

        // Draw the axis
        draw: function (chart, series, duration) {

            // Get self pointer for inner functions
            var self = this,
                // Get the series data
                chartData = series._positionData,
                // If the series is uninitialised create placeholders, otherwise use the existing shapes
                theseShapes = null,
                className = "series" + chart.series.indexOf(series);

            if (chart._tooltipGroup !== null && chart._tooltipGroup !== undefined) {
                chart._tooltipGroup.remove();
            }

            if (series.shapes === null || series.shapes === undefined) {
                theseShapes = chart._group.selectAll("." + className).data(chartData);
            } else {
                theseShapes = series.shapes.data(chartData, function (d) { return d.key; });
            }

            // Add
            theseShapes
                .enter()
                .append("circle")
                .attr("id", function (d) { return d.key; })
                .attr("class", function (d) { return className + " bubble " + d.aggField.join(" ") + " " + d.xField.join(" ") + " " + d.yField.join(" ") + " " + d.zField.join(" "); })
                .attr("cx", function (d) {
                    return (series.x._hasCategories() ? dimple._helpers.cx(d, chart, series) : series.x._origin);
                })
                .attr("cy", function (d) {
                    return (series.y._hasCategories() ? dimple._helpers.cy(d, chart, series) : series.y._origin);
                })
                .attr("r", 0)
                .attr("opacity", function (d) { return dimple._helpers.opacity(d, chart, series); })
                .on("mouseover", function (e) {
                    self.enterEventHandler(e, this, chart, series);
                })
                .on("mouseleave", function () {
                    self.leaveEventHandler(chart);
                })
                .call(function () {
                    if (!chart.noFormats) {
                        this.attr("fill", function (d) { return dimple._helpers.fill(d, chart, series); })
                            .attr("stroke", function (d) { return dimple._helpers.stroke(d, chart, series); });
                    }
                });

            // Update
            theseShapes
                .transition().duration(duration)
                .attr("cx", function (d) { return dimple._helpers.cx(d, chart, series); })
                .attr("cy", function (d) { return dimple._helpers.cy(d, chart, series); })
                .attr("r", function (d) { return dimple._helpers.r(d, chart, series); })
                .call(function () {
                    if (!chart.noFormats) {
                        this.attr("fill", function (d) { return dimple._helpers.fill(d, chart, series); })
                            .attr("stroke", function (d) { return dimple._helpers.stroke(d, chart, series); });
                    }
                });

            // Remove
            theseShapes
                .exit()
                .transition().duration(duration)
                .attr("r", 0)
                .attr("cx", function (d) {
                    return (series.x._hasCategories() ? dimple._helpers.cx(d, chart, series) : series.x._origin);
                })
                .attr("cy", function (d) {
                    return (series.y._hasCategories() ? dimple._helpers.cy(d, chart, series) : series.y._origin);
                })
                .each("end", function () {
                    d3.select(this).remove();
                });

            // Save the shapes to the series array
            series.shapes = theseShapes;
        },

        // Handle the mouse enter event
        enterEventHandler: function (e, shape, chart, series) {

            // The margin between the text and the box
            var textMargin = 5,
                // The margin between the ring and the popup
                popupMargin = 10,
                // The popup animation duration in ms
                animDuration = 750,
                // Collect some facts about the highlighted bubble
                selectedShape = d3.select(shape),
                cx = parseFloat(selectedShape.attr("cx")),
                cy = parseFloat(selectedShape.attr("cy")),
                r = parseFloat(selectedShape.attr("r")),
                opacity = selectedShape.attr("opacity"),
                fill = selectedShape.attr("fill"),
                dropDest = series._dropLineOrigin(),
                // Fade the popup stroke mixing the shape fill with 60% white
                popupStrokeColor = d3.rgb(
                    d3.rgb(fill).r + 0.6 * (255 - d3.rgb(fill).r),
                    d3.rgb(fill).g + 0.6 * (255 - d3.rgb(fill).g),
                    d3.rgb(fill).b + 0.6 * (255 - d3.rgb(fill).b)
                ),
                // Fade the popup fill mixing the shape fill with 80% white
                popupFillColor = d3.rgb(
                    d3.rgb(fill).r + 0.8 * (255 - d3.rgb(fill).r),
                    d3.rgb(fill).g + 0.8 * (255 - d3.rgb(fill).g),
                    d3.rgb(fill).b + 0.8 * (255 - d3.rgb(fill).b)
                ),
                t,
                box,
                rows = [],
                // The running y value for the text elements
                y = 0,
                // The maximum bounds of the text elements
                w = 0,
                h = 0,
                overlap;

            if (chart._tooltipGroup !== null && chart._tooltipGroup !== undefined) {
                chart._tooltipGroup.remove();
            }
            chart._tooltipGroup = chart.svg.append("g");

            // Add a ring around the data point
            chart._tooltipGroup.append("circle")
                .attr("cx", cx)
                .attr("cy", cy)
                .attr("r", r)
                .attr("opacity", 0)
                .style("fill", "none")
                .style("stroke", fill)
                .style("stroke-width", 1)
                .transition()
                    .duration(animDuration / 2)
                    .ease("linear")
                        .attr("opacity", 1)
                        .attr("r", r + 4)
                        .style("stroke-width", 2);

            // Add a drop line to the x axis
            if (dropDest.y !== null) {
                chart._tooltipGroup.append("line")
                    .attr("x1", cx)
                    .attr("y1", (cy < dropDest.y ? cy + r + 4 : cy - r - 4))
                    .attr("x2", cx)
                    .attr("y2", (cy < dropDest.y ? cy + r + 4 : cy - r - 4))
                    .style("fill", "none")
                    .style("stroke", fill)
                    .style("stroke-width", 2)
                    .style("stroke-dasharray", ("3, 3"))
                    .style("opacity", opacity)
                    .transition()
                        .delay(animDuration / 2)
                        .duration(animDuration / 2)
                        .ease("linear")
                            .attr("y2", dropDest.y);
            }

            // Add a drop line to the y axis
            if (dropDest.x !== null) {
                chart._tooltipGroup.append("line")
                    .attr("x1", (cx < dropDest.x ? cx + r + 4 : cx - r - 4))
                    .attr("y1", cy)
                    .attr("x2", (cx < dropDest.x ? cx + r + 4 : cx - r - 4))
                    .attr("y2", cy)
                    .style("fill", "none")
                    .style("stroke", fill)
                    .style("stroke-width", 2)
                    .style("stroke-dasharray", ("3, 3"))
                    .style("opacity", opacity)
                    .transition()
                        .delay(animDuration / 2)
                        .duration(animDuration / 2)
                        .ease("linear")
                            .attr("x2", dropDest.x);
            }

            // Add a group for text
            t = chart._tooltipGroup.append("g");
            // Create a box for the popup in the text group
            box = t.append("rect");

            // Add the series categories
            if (series.categoryFields !== null && series.categoryFields !== undefined && series.categoryFields.length > 0) {
                series.categoryFields.forEach(function (c, i) {
                    // If the category name and value match don't display the category name
                    rows.push(c + (e.aggField[i] !== c ? ": " + e.aggField[i] : ""));
                }, this);
            }

            if (series.x._hasTimeField()) {
                rows.push(series.x.timeField + ": " + series.x._getFormat()(e.xField[0]));
            } else if (series.x._hasCategories()) {
                // Add the x axis categories
                series.x.categoryFields.forEach(function (c, i) {
                    // If the category name and value match don't display the category name
                    rows.push(c + (e.xField[i] !== c ? ": " + e.xField[i] : ""));
                }, this);
            } else if (series.x._hasLogField()) {
                // Add the y axis log
                rows.push(series.x.measure + ": " + e.cx);
            } else {
                // Add the axis measure value
                rows.push(series.x.measure + ": " + series.x._getFormat()(e.cx));
            }

            if (series.y._hasTimeField()) {
                rows.push(series.y.timeField + ": " + series.y._getFormat()(e.yField[0]));
            } else if (series.y._hasCategories()) {
                // Add the y axis categories
                series.y.categoryFields.forEach(function (c, i) {
                    rows.push(c + (e.yField[i] !== c ? ": " + e.yField[i] : ""));
                }, this);
            } else if (series.y._hasLogField()) {
                // Add the y axis log
                rows.push(series.y.measure + ": " + e.cy);
            } else {
                // Add the axis measure value
                rows.push(series.y.measure + ": " + series.y._getFormat()(e.cy));
            }

            if (series.z !== null && series.z !== undefined) {
                // Add the axis measure value
                rows.push(series.z.measure + ": " + series.z._getFormat()(e.zValue));
            }

            if (series.c !== null && series.c !== undefined) {
                // Add the axis measure value
                rows.push(series.c.measure + ": " + series.c._getFormat()(e.cValue));
            }

            // Get distinct text rows to deal with cases where 2 axes have the same dimensionality
            rows = rows.filter(function(elem, pos) {
                return rows.indexOf(elem) === pos;
            });

            // Create a text object for every row in the popup
            t.selectAll(".textHoverShapes").data(rows).enter()
                .append("text")
                    .text(function (d) { return d; })
                    .style("font-family", "sans-serif")
                    .style("font-size", "10px");

            // Get the max height and width of the text items
            t.each(function () {
                w = (this.getBBox().width > w ? this.getBBox().width : w);
                h = (this.getBBox().width > h ? this.getBBox().height : h);
            });

            // Position the text relatve to the bubble, the absolute positioning
            // will be done by translating the group
            t.selectAll("text")
                .attr("x", 0)
                .attr("y", function () {
                    // Increment the y position
                    y += this.getBBox().height;
                    // Position the text at the centre point
                    return y - (this.getBBox().height / 2);
                });

            // Draw the box with a margin around the text
            box.attr("x", -textMargin)
                .attr("y", -textMargin)
                .attr("height", Math.floor(y + textMargin) - 0.5)
                .attr("width", w + 2 * textMargin)
                .attr("rx", 5)
                .attr("ry", 5)
                .style("fill", popupFillColor)
                .style("stroke", popupStrokeColor)
                .style("stroke-width", 2)
                .style("opacity", 0.95);

            // Shift the ring margin left or right depending on whether it will overlap the edge
            overlap = cx + r + textMargin + popupMargin + w > parseFloat(chart.svg.attr("width"));

            // Translate the shapes to the x position of the bubble (the x position of the shapes is handled)
            t.attr("transform", "translate(" +
                   (overlap ? cx - (r + textMargin + popupMargin + w) : cx + r + textMargin + popupMargin) + " , " +
                   (cy - ((y - (h - textMargin)) / 2)) +
                ")");
        },

        // Handle the mouse leave event
        leaveEventHandler: function (chart) {
            if (chart._tooltipGroup !== null && chart._tooltipGroup !== undefined) {
                chart._tooltipGroup.remove();
            }
        }
    };


    // Copyright: 2013 PMSI-AlignAlytics
    // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
    // Source: /src/objects/plot/line.js
    dimple.plot.line = {
        stacked: false,
        supportedAxes: ["x", "y", "c"],
        draw: function (chart, series, duration) {

            // Get self pointer for inner functions
            var self = this,
                data = series._positionData,
                fillIns = [],
                uniqueValues = [],
                // If there is a category axis we should draw a line for each aggField.  Otherwise
                // the first aggField defines the points and the others define the line
                firstAgg = 1,
                graded = false,
                line,
                markers;

            if (chart._tooltipGroup !== null && chart._tooltipGroup !== undefined) {
                chart._tooltipGroup.remove();
            }

            if (series.x._hasCategories() || series.y._hasCategories()) {
                firstAgg = 0;
            }

            data.forEach(function (d) {
                var filter = [],
                    match = false,
                    k;

                for (k = firstAgg; k < d.aggField.length; k += 1) {
                    filter.push(d.aggField[k]);
                }

                uniqueValues.forEach(function (d) {
                    match = match || (d.join("/") === filter.join("/"));
                }, this);

                if (!match) {
                    uniqueValues.push(filter);
                }

            }, this);

            if (series.c !== null && series.c !== undefined && ((series.x._hasCategories() && series.y._hasMeasure()) || (series.y._hasCategories() && series.x._hasMeasure()))) {
                graded = true;
                uniqueValues.forEach(function (seriesValue) {
                    dimple._addGradient(seriesValue, "fill-line-gradient-" + seriesValue.join("_").replace(" ", ""), (series.x._hasCategories() ? series.x : series.y), data, chart, duration, "fill");
                }, this);
            }

            line = d3.svg.line()
                .x(function (d) { return dimple._helpers.cx(d, chart, series); })
                .y(function (d) { return dimple._helpers.cy(d, chart, series); });

            if (series.shapes === null || series.shapes === undefined) {
                series.shapes = chart._group.selectAll(".line")
                    .data(uniqueValues)
                    .enter()
                        .append("svg:path")
                            .attr("opacity", function(d) { return chart.getColor(d).opacity; });
            }
            series.shapes
                .data(uniqueValues)
                .transition().duration(duration)
                .attr("class", function (d) { return "series line " + d.join("_").replace(" ", ""); })
                .attr("d", function (d) {
                    var seriesData = [];
                    data.forEach(function (r) {
                        var add = true,
                            k;
                        for (k = firstAgg; k < r.aggField.length; k += 1) {
                            add = add && (d[k - firstAgg] === r.aggField[k]);
                        }
                        if (add) {
                            seriesData.push(r);
                        }
                    }, this);
                    seriesData.sort(function (a, b) {
                        var sortValue = 0;
                        if (series.x._hasCategories()) {
                            sortValue = (dimple._helpers.cx(a, chart, series) < dimple._helpers.cx(b, chart, series) ? -1 : 1);
                        } else if (series.y._hasCategories()) {
                            sortValue = (dimple._helpers.cy(a, chart, series) < dimple._helpers.cy(b, chart, series) ? -1 : 1);
                        }
                        return sortValue;
                    });
                    if (seriesData.length === 1) {
                        fillIns.push({
                            cx: dimple._helpers.cx(seriesData[0], chart, series),
                            cy: dimple._helpers.cy(seriesData[0], chart, series),
                            opacity: chart.getColor(d[d.length - 1]).opacity,
                            color: chart.getColor(d[d.length - 1]).stroke
                        });
                        d3.select(this).remove();
                    }
                    return line(seriesData);
                })
                .call(function () {
                    if (!chart.noFormats) {
                        this.attr("fill", "none")
                            .attr("stroke", function (d) { return (graded ? "url(#fill-line-gradient-" + d.join("_").replace(" ", "") + ")" : chart.getColor(d[d.length - 1]).stroke);    })
                            .attr("stroke-width", series.lineWeight);
                    }
                });

            // Add line markers.  
            markers = chart._group.selectAll(".markers")
                .data(data)
                .enter();

            // Add a fully opaque white circle first so we don't see a ghost of the line
            if (series.lineMarkers) {
                markers.append("circle")
                    .transition().duration(duration)
                    .attr("cx", function (d) { return dimple._helpers.cx(d, chart, series); })
                    .attr("cy", function (d) { return dimple._helpers.cy(d, chart, series); })
                    .attr("r", 2 + series.lineWeight)
                    .attr("fill", "white")
                    .attr("stroke", "none");
            }

            // Add the actual marker. We need to do this even if we aren't displaying them because they
            // catch hover events
            markers.append("circle")
                .on("mouseover", function (e) {
                    self.enterEventHandler(e, this, chart, series);
                })
                .on("mouseleave", function (e) {
                    self.leaveEventHandler(e, this, chart, series);
                })
                .transition().duration(duration)
                .attr("cx", function (d) { return dimple._helpers.cx(d, chart, series); })
                .attr("cy", function (d) { return dimple._helpers.cy(d, chart, series); })
                .attr("r", 2 + series.lineWeight)
                .attr("opacity", function (d) { return (series.lineMarkers ? chart.getColor(d).opacity : 0); })
                .call(function () {
                    if (!chart.noFormats) {
                        this.attr("fill", "white")
                            .style("stroke-width", series.lineWeight)
                            .attr("stroke", function (d) {
                                return (graded ? dimple._helpers.fill(d, chart, series) : chart.getColor(d.aggField[d.aggField.length - 1]).stroke);
                            });
                    }
                });

            // Deal with single point lines if there are no markers
            if (!series.lineMarkers) {
                chart._group.selectAll(".fill")
                    .data(fillIns)
                    .enter()
                    .append("circle")
                    .attr("cx", function (d) { return d.cx; })
                    .attr("cy", function (d) { return d.cy; })
                    .attr("r", series.lineWeight)
                    .attr("opacity", function (d) { return d.opacity; })
                    .call(function () {
                        if (!chart.noFormats) {
                            this.attr("fill", function (d) { return d.color; })
                                .attr("stroke", "none");
                        }
                    });
            }
        },

        // Handle the mouse enter event
        enterEventHandler: function (e, shape, chart, series) {

            // The margin between the text and the box
            var textMargin = 5,
                // The margin between the ring and the popup
                popupMargin = 10,
                // The popup animation duration in ms
                animDuration = 750,
                // Collect some facts about the highlighted bubble
                selectedShape = d3.select(shape),
                cx = parseFloat(selectedShape.attr("cx")),
                cy = parseFloat(selectedShape.attr("cy")),
                r = parseFloat(selectedShape.attr("r")),
                opacity = dimple._helpers.opacity(e, chart, series),
                fill = selectedShape.attr("stroke"),
                dropDest = series._dropLineOrigin(),
                // Fade the popup stroke mixing the shape fill with 60% white
                popupStrokeColor = d3.rgb(
                    d3.rgb(fill).r + 0.6 * (255 - d3.rgb(fill).r),
                    d3.rgb(fill).g + 0.6 * (255 - d3.rgb(fill).g),
                    d3.rgb(fill).b + 0.6 * (255 - d3.rgb(fill).b)
                ),
                // Fade the popup fill mixing the shape fill with 80% white
                popupFillColor = d3.rgb(
                    d3.rgb(fill).r + 0.8 * (255 - d3.rgb(fill).r),
                    d3.rgb(fill).g + 0.8 * (255 - d3.rgb(fill).g),
                    d3.rgb(fill).b + 0.8 * (255 - d3.rgb(fill).b)
                ),
                // The running y value for the text elements
                y = 0,
                // The maximum bounds of the text elements
                w = 0,
                h = 0,
                t,
                box,
                rows = [],
                overlap;

            if (chart._tooltipGroup !== null && chart._tooltipGroup !== undefined) {
                chart._tooltipGroup.remove();
            }
            chart._tooltipGroup = chart.svg.append("g");

            // On hover make the line marker visible immediately
            selectedShape.style("opacity", 1);

            // Add a ring around the data point
            chart._tooltipGroup.append("circle")
                .attr("cx", cx)
                .attr("cy", cy)
                .attr("r", r)
                .attr("opacity", 0)
                .style("fill", "none")
                .style("stroke", fill)
                .style("stroke-width", 1)
                .transition()
                    .duration(animDuration / 2)
                    .ease("linear")
                        .attr("opacity", 1)
                        .attr("r", r + series.lineWeight + 2)
                        .style("stroke-width", 2);

            // Add a drop line to the x axis
            if (dropDest.y !== null) {
                chart._tooltipGroup.append("line")
                    .attr("x1", cx)
                    .attr("y1", (cy < dropDest.y ? cy + r + series.lineWeight + 2 : cy - r - series.lineWeight - 2))
                    .attr("x2", cx)
                    .attr("y2", (cy < dropDest.y ? cy + r + series.lineWeight + 2 : cy - r - series.lineWeight - 2))
                    .style("fill", "none")
                    .style("stroke", fill)
                    .style("stroke-width", 2)
                    .style("stroke-dasharray", ("3, 3"))
                    .style("opacity", opacity)
                    .transition()
                        .delay(animDuration / 2)
                        .duration(animDuration / 2)
                        .ease("linear")
                        .attr("y2", dropDest.y);
            }

            // Add a drop line to the y axis
            if (dropDest.x !== null) {
                chart._tooltipGroup.append("line")
                    .attr("x1", (cx < dropDest.x ? cx + r + series.lineWeight + 2 : cx - r - series.lineWeight - 2))
                    .attr("y1", cy)
                    .attr("x2", (cx < dropDest.x ? cx + r + series.lineWeight + 2 : cx - r - series.lineWeight - 2))
                    .attr("y2", cy)
                    .style("fill", "none")
                    .style("stroke", fill)
                    .style("stroke-width", 2)
                    .style("stroke-dasharray", ("3, 3"))
                    .style("opacity", opacity)
                    .transition()
                        .delay(animDuration / 2)
                        .duration(animDuration / 2)
                        .ease("linear")
                    .attr("x2", dropDest.x);
            }

            // Add a group for text
            t = chart._tooltipGroup.append("g");
            // Create a box for the popup in the text group
            box = t.append("rect");

            // Add the series categories
            if (series.categoryFields !== null && series.categoryFields !== undefined && series.categoryFields.length > 0) {
                series.categoryFields.forEach(function (c, i) {
                    // If the category name and value match don't display the category name
                    rows.push(c + (e.aggField[i] !== c ? ": " + e.aggField[i] : ""));
                }, this);
            }

            if (series.x._hasTimeField()) {
                rows.push(series.x.timeField + ": " + series.x._getFormat()(e.xField[0]));
            } else if (series.x._hasCategories()) {
                // Add the x axis categories
                series.x.categoryFields.forEach(function (c, i) {
                    // If the category name and value match don't display the category name
                    rows.push(c + (e.xField[i] !== c ? ": " + e.xField[i] : ""));
                }, this);
            } else if (series.x._hasLogField()) {
                // Add the y axis log
                rows.push(series.x.measure + ": " + e.cx);
            } else {
                // Add the axis measure value
                rows.push(series.x.measure + ": " + series.x._getFormat()(e.cx));
            }

            if (series.y._hasTimeField()) {
                rows.push(series.y.timeField + ": " + series.y._getFormat()(e.yField[0]));
            } else if (series.y._hasCategories()) {
                // Add the y axis categories
                series.y.categoryFields.forEach(function (c, i) {
                    rows.push(c + (e.yField[i] !== c ? ": " + e.yField[i] : ""));
                }, this);
            } else if (series.y._hasLogField()) {
                // Add the y axis log
                rows.push(series.y.measure + ": " + e.cy);
            } else {
                // Add the axis measure value
                rows.push(series.y.measure + ": " + series.y._getFormat()(e.cy));
            }

            if (series.z !== null && series.z !== undefined) {
                // Add the axis measure value
                rows.push(series.z.measure + ": " + series.z._getFormat()(e.zValue));
            }

            if (series.c !== null && series.c !== undefined) {
                // Add the axis measure value
                rows.push(series.c.measure + ": " + series.c._getFormat()(e.cValue));
            }

            // Get distinct text rows to deal with cases where 2 axes have the same dimensionality
            rows = rows.filter(function(elem, pos) {
                return rows.indexOf(elem) === pos;
            });

            // Create a text object for every row in the popup
            t.selectAll(".textHoverShapes").data(rows).enter()
                .append("text")
                    .text(function (d) { return d; })
                    .style("font-family", "sans-serif")
                    .style("font-size", "10px");

            // Get the max height and width of the text items
            t.each(function () {
                w = (this.getBBox().width > w ? this.getBBox().width : w);
                h = (this.getBBox().width > h ? this.getBBox().height : h);
            });

            // Position the text relatve to the bubble, the absolute positioning
            // will be done by translating the group
            t.selectAll("text")
                .attr("x", 0)
                .attr("y", function () {
                    // Increment the y position
                    y += this.getBBox().height;
                    // Position the text at the centre point
                    return y - (this.getBBox().height / 2);
                });

            // Draw the box with a margin around the text
            box.attr("x", -textMargin)
                .attr("y", -textMargin)
                .attr("height", Math.floor(y + textMargin) - 0.5)
                .attr("width", w + 2 * textMargin)
                .attr("rx", 5)
                .attr("ry", 5)
                .style("fill", popupFillColor)
                .style("stroke", popupStrokeColor)
                .style("stroke-width", 2)
                .style("opacity", 0.95);

            // Shift the ring margin left or right depending on whether it will overlap the edge
            overlap = cx + r + textMargin + popupMargin + w > parseFloat(chart.svg.attr("width"));

            // Translate the shapes to the x position of the bubble (the x position of the shapes is handled)
            t.attr("transform", "translate(" +
                   (overlap ? cx - (r + textMargin + popupMargin + w) : cx + r + textMargin + popupMargin) + " , " +
                   (cy - ((y - (h - textMargin)) / 2)) +
                ")");
        },

        // Handle the mouse leave event
        leaveEventHandler: function (e, shape, chart, series) {
            // Return the opacity of the marker
            d3.select(shape).style("opacity", (series.lineMarkers ? dimple._helpers.opacity(e, chart, series) : 0));
            if (chart._tooltipGroup !== null && chart._tooltipGroup !== undefined) {
                chart._tooltipGroup.remove();
            }
        }
    };


    // Copyright: 2013 PMSI-AlignAlytics
    // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
    // Source: /src/methods/_addGradient.js
    dimple._addGradient = function (seriesValue, id, categoryAxis, data, chart, duration, colorProperty) {

        var grad = chart._group.select("#" + id),
            cats = [],
            field = categoryAxis.position + "Field",
            transition = true,
            colors = [];

        data.forEach(function (d) {
            if (cats.indexOf(d[field]) === -1) {
                cats.push(d[field]);
            }
        }, this);

        cats = cats.sort(function (a, b) { return categoryAxis._scale(a) - categoryAxis._scale(b); });

        if (grad.node() === null) {
            transition = false;
            grad = chart._group.append("linearGradient")
                .attr("id", id)
                .attr("gradientUnits", "userSpaceOnUse")
                .attr("x1", (categoryAxis.position === "x" ? categoryAxis._scale(cats[0]) + ((chart.width / cats.length) / 2) : 0))
                .attr("y1", (categoryAxis.position === "y" ? categoryAxis._scale(cats[0]) - ((chart.height / cats.length) / 2) : 0))
                .attr("x2", (categoryAxis.position === "x" ? categoryAxis._scale(cats[cats.length - 1]) + ((chart.width / cats.length) / 2) : 0))
                .attr("y2", (categoryAxis.position === "y" ? categoryAxis._scale(cats[cats.length - 1]) - ((chart.height / cats.length) / 2) : 0));
        }

        cats.forEach(function (cat, j) {

            var row = {},
                k = 0;

            for (k = 0; k < data.length; k = k + 1) {
                if (data[k].aggField.join("_") === seriesValue.join("_") && data[k][field].join("_") === cat.join("_")) {
                    row = data[k];
                    break;
                }
            }

            colors.push({ offset: Math.round((j / (cats.length - 1)) * 100) + "%", color: row[colorProperty] });
        }, this);

        if (transition) {
            grad.selectAll("stop")
                .data(colors)
                .transition().duration(duration)
                .attr("offset", function(d) { return d.offset; })
                .attr("stop-color", function(d) { return d.color; });
        } else {
            grad.selectAll("stop")
                .data(colors)
                .enter()
                .append("stop")
                .attr("offset", function(d) { return d.offset; })
                .attr("stop-color", function(d) { return d.color; });
        }
    };


    // Copyright: 2013 PMSI-AlignAlytics
    // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
    // Source: /src/objects/chart/methods/_getOrderedList.js
    dimple._getOrderedList = function (data, mainField, levelDefinitions) {
        var rollupData = [],
            sortStack = [],
            finalArray = [],
            fields = [mainField],
            defs = [];
        // Force the level definitions into an array
        if (levelDefinitions !== null && levelDefinitions !== undefined) {
            defs = defs.concat(levelDefinitions);
        }
        // Add the base case
        defs = defs.concat({ ordering: mainField, desc: false });
        // Exclude fields if this does not contain a function
        defs.forEach(function (def) {
            var field;
            if (typeof def.ordering === "function") {
                for (field in data[0]) {
                    if (data[0].hasOwnProperty(field) && fields.indexOf(field) === -1) {
                        fields.push(field);
                    }
                }
            } else if (!(def.ordering instanceof Array)) {
                fields.push(def.ordering);
            }
        }, this);
        rollupData = dimple._rollUp(data, mainField, fields);
        // If we go below the leaf stop recursing
        if (defs.length >= 1) {
            // Build a stack of compare methods
            // Iterate each level definition
            defs.forEach(function (def) {
                // Draw ascending by default
                var desc = (def.desc === null || def.desc === undefined ? false : def.desc),
                    ordering = def.ordering,
                    orderArray = [],
                    field = (typeof ordering === "string" ? ordering : null),
                    sum = function (array) {
                        var total = 0,
                            i;
                        for (i = 0; i < array.length; i += 1) {
                            if (isNaN(array[i])) {
                                total = 0;
                                break;
                            } else {
                                total += parseFloat(array[i]);
                            }
                        }
                        return total;
                    },
                    compare = function (a, b) {
                        var result = 0,
                            sumA = sum(a),
                            sumB = sum(b);
                        if (!isNaN(sumA) && sumA !== 0 && !isNaN(sumB) && sumB !== 0) {
                            result = parseFloat(sumA) - parseFloat(sumB);
                        } else if (!isNaN(Date.parse(a[0])) && !isNaN(Date.parse(b[0]))) {
                            result = Date.parse(a[0]) - Date.parse(b[0]);
                        } else if (a[0] < b[0]) {
                            result = -1;
                        } else if (a[0] > b[0]) {
                            result = 1;
                        }
                        return result;
                    };
                // Handle the ordering based on the type set
                if (typeof ordering === "function") {
                    // Apply the sort predicate directly
                    sortStack.push(function (a, b) {
                        return (desc ? -1 : 1) * ordering(a, b);
                    });
                } else if (ordering instanceof Array) {
                    // The order list may be an array of arrays
                    // combine the values with pipe delimiters.
                    // The delimiter is irrelevant as long as it is consistent
                    // with the sort predicate below
                    ordering.forEach(function (d) {
                        orderArray.push(([].concat(d)).join("|"));
                    }, this);
                    // Sort according to the axis position
                    sortStack.push(function (a, b) {
                        var aStr = "".concat(a[mainField]),
                            bStr = "".concat(b[mainField]),
                            aIx,
                            bIx;
                        // If the value is not found it should go to the end (if descending it
                        // should go to the start so that it ends up at the back when reversed)
                        aIx = orderArray.indexOf(aStr);
                        bIx = orderArray.indexOf(bStr);
                        aIx = (aIx < 0 ? (desc ? -1 : orderArray.length) : aIx);
                        bIx = (bIx < 0 ? (desc ? -1 : orderArray.length) : bIx);
                        return (desc ? -1 : 1) * (aIx - bIx);
                    });
                } else {
                    // Sort the data
                    sortStack.push(function (a, b) {
                        // The result value
                        var result = 0;
                        // Find the field
                        if (a[field] !== undefined && b[field] !== undefined) {
                            // Compare just the first mapped value
                            result = compare([].concat(a[field]), [].concat(b[field]));
                        }
                        return (desc ? -1 : 1) * result;
                    });
                }
            });
            rollupData.sort(function (a, b) {
                var compareIx = 0,
                    result = 0;
                while (compareIx < sortStack.length && result === 0) {
                    result = sortStack[compareIx](a, b);
                    compareIx += 1;
                }
                return result;
            });
            // Return a simple array if only one field is being returned.
            // for multiple fields remove extra fields but leave objects
            rollupData.forEach(function (d) {
                finalArray.push(d[mainField]);
            }, this);
        }
        // Return the ordered list
        return finalArray;
    };


    // Copyright: 2013 PMSI-AlignAlytics
    // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
    // Source: /src/methods/_helpers.js
    dimple._helpers = {

        // Calculate the centre x position
        cx: function (d, chart, series) {
            var returnCx = 0;
            if (series.x.measure !== null && series.x.measure !== undefined) {
                returnCx = series.x._scale(d.cx);
            } else if (series.x._hasCategories() && series.x.categoryFields.length >= 2) {
                returnCx = series.x._scale(d.cx) + dimple._helpers.xGap(chart, series) + ((d.xOffset + 0.5) * (((chart.width / series.x._max) - 2 * dimple._helpers.xGap(chart, series)) * d.width));
            } else {
                returnCx = series.x._scale(d.cx) + ((chart.width / series.x._max) / 2);
            }
            return returnCx;
        },

        // Calculate the centre y position
        cy: function (d, chart, series) {
            var returnCy = 0;
            if (series.y.measure !== null && series.y.measure !== undefined) {
                returnCy = series.y._scale(d.cy);
            } else if (series.y.categoryFields !== null && series.y.categoryFields !== undefined && series.y.categoryFields.length >= 2) {
                returnCy = (series.y._scale(d.cy) - (chart.height / series.y._max)) +  dimple._helpers.yGap(chart, series) + ((d.yOffset + 0.5) * (((chart.height / series.y._max) - 2 * dimple._helpers.yGap(chart, series)) * d.height));
            } else {
                returnCy = series.y._scale(d.cy) - ((chart.height / series.y._max) / 2);
            }
            return returnCy;
        },

        // Calculate the radius
        r: function (d, chart, series) {
            var returnR = 0;
            if (series.z === null || series.z === undefined) {
                returnR = 5;
            } else if (series.z._hasMeasure()) {
                returnR = series.z._scale(d.r);
            } else {
                returnR = series.z._scale(chart.height / 100);
            }
            return returnR;
        },

        // Calculate the x gap for bar type charts
        xGap: function (chart, series) {
            var returnXGap = 0;
            if ((series.x.measure === null || series.x.measure === undefined) && series.barGap > 0) {
                returnXGap = ((chart.width / series.x._max) * (series.barGap > 0.99 ? 0.99 : series.barGap)) / 2;
            }
            return returnXGap;
        },

        // Calculate the x gap for clusters within bar type charts
        xClusterGap: function (d, chart, series) {
            var returnXClusterGap = 0;
            if (series.x.categoryFields !== null && series.x.categoryFields !== undefined && series.x.categoryFields.length >= 2 && series.clusterBarGap > 0 && !series.x._hasMeasure()) {
                returnXClusterGap = (d.width * ((chart.width / series.x._max) - (dimple._helpers.xGap(chart, series) * 2)) * (series.clusterBarGap > 0.99 ? 0.99 : series.clusterBarGap)) / 2;
            }
            return returnXClusterGap;
        },

        // Calculate the y gap for bar type charts
        yGap: function (chart, series) {
            var returnYGap = 0;
            if ((series.y.measure === null || series.y.measure === undefined) && series.barGap > 0) {
                returnYGap = ((chart.height / series.y._max) * (series.barGap > 0.99 ? 0.99 : series.barGap)) / 2;
            }
            return returnYGap;
        },

        // Calculate the y gap for clusters within bar type charts
        yClusterGap: function (d, chart, series) {
            var returnYClusterGap = 0;
            if (series.y.categoryFields !== null && series.y.categoryFields !== undefined && series.y.categoryFields.length >= 2 && series.clusterBarGap > 0 && !series.y._hasMeasure()) {
                returnYClusterGap = (d.height * ((chart.height / series.y._max) - (dimple._helpers.yGap(chart, series) * 2)) * (series.clusterBarGap > 0.99 ? 0.99 : series.clusterBarGap)) / 2;
            }
            return returnYClusterGap;
        },

        // Calculate the top left x position for bar type charts
        x: function (d, chart, series) {
            var returnX = 0;
            if (series.x._hasTimeField()) {
                returnX = series.x._scale(d.x) - (dimple._helpers.width(d, chart, series) / 2);
            } else {
                returnX = series.x._scale(d.x) + dimple._helpers.xGap(chart, series) + (d.xOffset * (dimple._helpers.width(d, chart, series) + 2 * dimple._helpers.xClusterGap(d, chart, series))) + dimple._helpers.xClusterGap(d, chart, series);
            }
            return returnX;
        },

        // Calculate the top left y position for bar type charts
        y: function (d, chart, series) {
            var returnY = 0;
            if (series.y._hasTimeField()) {
                returnY = series.y._scale(d.y) - (dimple._helpers.height(d, chart, series) / 2);
            } else if (series.y.measure !== null && series.y.measure !== undefined) {
                returnY = series.y._scale(d.y);
            } else if (series.y.measure !== null && series.y.measure !== undefined) {
                returnY = series.y._scale(d.y);
            } else {
                returnY = (series.y._scale(d.y) - (chart.height / series.y._max)) + dimple._helpers.yGap(chart, series) + (d.yOffset * (dimple._helpers.height(d, chart, series) + 2 * dimple._helpers.yClusterGap(d, chart, series))) + dimple._helpers.yClusterGap(d, chart, series);
            }
            return returnY;
        },

        // Calculate the width for bar type charts
        width: function (d, chart, series) {
            var returnWidth = 0;
            if (series.x.measure !== null && series.x.measure !== undefined) {
                returnWidth = Math.abs(series.x._scale(d.width) - series.x._scale(0));
            } else if (series.x._hasTimeField()) {
                returnWidth = series.x.floatingBarWidth;
            } else {
                returnWidth = d.width * ((chart.width / series.x._max) - (dimple._helpers.xGap(chart, series) * 2)) - (dimple._helpers.xClusterGap(d, chart, series) * 2);
            }
            return returnWidth;
        },

        // Calculate the height for bar type charts
        height: function (d, chart, series) {
            var returnHeight = 0;
            if (series.y._hasTimeField()) {
                returnHeight = series.y.floatingBarWidth;
            } else if (series.y.measure !== null && series.y.measure !== undefined) {
                returnHeight = Math.abs(series.y._scale(0) - series.y._scale(d.height));
            } else {
                returnHeight = d.height * ((chart.height / series.y._max) - (dimple._helpers.yGap(chart, series) * 2)) - (dimple._helpers.yClusterGap(d, chart, series) * 2);
            }
            return returnHeight;
        },

        // Calculate the opacity for series
        opacity: function (d, chart, series) {
            var returnOpacity = 0;
            if (series.c !== null && series.c !== undefined) {
                returnOpacity = d.opacity;
            } else {
                returnOpacity = chart.getColor(d.aggField.slice(-1)[0]).opacity;
            }
            return returnOpacity;
        },

        // Calculate the fill coloring for series
        fill: function (d, chart, series) {
            var returnFill = 0;
            if (series.c !== null && series.c !== undefined) {
                returnFill = d.fill;
            } else {
                returnFill = chart.getColor(d.aggField.slice(-1)[0]).fill;
            }
            return returnFill;
        },

        // Calculate the stroke coloring for series
        stroke: function (d, chart, series) {
            var stroke = 0;
            if (series.c !== null && series.c !== undefined) {
                stroke = d.stroke;
            } else {
                stroke = chart.getColor(d.aggField.slice(-1)[0]).stroke;
            }
            return stroke;
        }

    };


    // Copyright: 2013 PMSI-AlignAlytics
    // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
    // Source: /src/methods/_rollUp.js
    dimple._rollUp = function (data, fields, includeFields) {

        var returnList = [];
        // Put single values into single value arrays
        if (fields !== null && fields !== undefined) {
            fields = [].concat(fields);
        } else {
            fields = [];
        }
        // Iterate every row in the data
        data.forEach(function (d) {
            // The index of the corresponding row in the return list
            var index = -1,
                newRow = {},
                match = true;
            // Find the corresponding value in the return list
            returnList.forEach(function (r, j) {
                if (index === -1) {
                    // Indicates a match
                    match = true;
                    // Iterate the passed fields and compare
                    fields.forEach(function (f) {
                        match = match && d[f] === r[f];
                    }, this);
                    // If this is a match get the index
                    if (match) {
                        index = j;
                    }
                }
            }, this);
            // Pick up the matched row, or add a new one
            if (index !== -1) {
                newRow = returnList[index];
            } else {
                // Iterate the passed fields and add to the new row
                fields.forEach(function (f) {
                    newRow[f] = d[f];
                }, this);
                returnList.push(newRow);
                index = returnList.length - 1;
            }
            // Iterate all the fields in the data
            includeFields.forEach(function (field) {
                if (fields.indexOf(field) === -1) {
                    if (newRow[field] === undefined) {
                        newRow[field] = [];
                    }
                    newRow[field] = newRow[field].concat(d[field]);
                }
            }, this);
            // Update the return list
            returnList[index] = newRow;
        }, this);
        // Return the flattened list
        return returnList;
    };

    // Copyright: 2013 PMSI-AlignAlytics
    // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
    // Source: /src/methods/filterData.js
    // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple#wiki-filterData
    dimple.filterData = function (data, field, filterValues) {
        var returnData = data;
        if (field !== null && filterValues !== null) {
            // Build an array from a single filter value or use the array
            if (filterValues !== null && filterValues !== undefined) { filterValues = [].concat(filterValues); }
            // The data to return
            returnData = [];
            // Iterate all the data
            data.forEach(function (d) {
                // If an invalid field is passed, just pass the data
                if (d[field] === null) {
                    returnData.push(d);
                } else {
                    if (filterValues.indexOf([].concat(d[field]).join("/")) > -1) {
                        returnData.push(d);
                    }
                }
            }, this);
        }
        // Return the filtered data
        return returnData;
    };


    // Copyright: 2013 PMSI-AlignAlytics
    // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
    // Source: /src/methods/getUniqueValues.js
    // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple#wiki-getUniqueValues
    dimple.getUniqueValues = function (data, fields) {
        var returnlist = [];
        // Put single values into single value arrays
        if (fields !== null && fields !== undefined) {
            fields = [].concat(fields);
            // Iterate every row in the data
            data.forEach(function (d) {
                // Handle multiple category values by iterating the fields in the row and concatonate the values
                var field = "";
                fields.forEach(function (f, i) {
                    if (i > 0) {
                        field += "/";
                    }
                    field += d[f];
                }, this);
                // If the field was not found, add it to the end of the categories array
                if (returnlist.indexOf(field) === -1) {
                    returnlist.push(field);
                }
            }, this);
        }
        return returnlist;
    };

    // Copyright: 2013 PMSI-AlignAlytics
    // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
    // Source: /src/methods/newSvg.js
    // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple#wiki-newSvg
    dimple.newSvg = function (parentSelector, width, height) {
        var selectedShape = null;
        if (parentSelector === null || parentSelector === undefined) {
            parentSelector = "body";
        }
        selectedShape = d3.select(parentSelector);
        if (selectedShape.empty()) {
            throw "The '" + parentSelector + "' selector did not match any elements.  Please prefix with '#' to select by id or '.' to select by class";
        }
        return selectedShape.append("svg").attr("width", width).attr("height", height);
    };


}());
// End dimple