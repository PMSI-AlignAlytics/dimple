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
                        .rangeRound([this.chart._xPixels(), this.chart._xPixels() + this.chart._widthPixels()])
                        .domain([this._min, this._max]);
                } else if (this.useLog) {
                    this._scale = d3.scale.log()
                        .range([this.chart._xPixels(), this.chart._xPixels() + this.chart._widthPixels()])
                        .domain([
                            (this._min === 0 ? Math.pow(this.logBase, -1) : this._min),
                            (this._max === 0 ? -1 * Math.pow(this.logBase, -1) : this._max)
                        ])
                        .clamp(true)
                        .base(this.logBase)
                        .nice();
                } else if (this.measure === null || this.measure === undefined) {
                    distinctCats = getOrderedCategories(this, "x", "y");
                    this._scale = d3.scale.ordinal()
                        .rangePoints([this.chart._xPixels(), this.chart._xPixels() + this.chart._widthPixels()])
                        .domain(distinctCats.concat([""]));
                } else {
                    this._scale = d3.scale.linear()
                        .range([this.chart._xPixels(), this.chart._xPixels() + this.chart._widthPixels()])
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
                        .rangeRound([this.chart._yPixels() + this.chart._heightPixels(), this.chart._yPixels()])
                        .domain([this._min, this._max]);
                } else if (this.useLog) {
                    this._scale = d3.scale.log()
                        .range([this.chart._yPixels() + this.chart._heightPixels(), this.chart._yPixels()])
                        .domain([
                            (this._min === 0 ? Math.pow(this.logBase, -1) : this._min),
                            (this._max === 0 ? -1 * Math.pow(this.logBase, -1) : this._max)
                        ])
                        .clamp(true)
                        .base(this.logBase)
                        .nice();
                } else if (this.measure === null || this.measure === undefined) {
                    distinctCats = getOrderedCategories(this, "y", "x");
                    this._scale = d3.scale.ordinal()
                        .rangePoints([this.chart._yPixels() + this.chart._heightPixels(), this.chart._yPixels()])
                        .domain(distinctCats.concat([""]));
                } else {
                    this._scale = d3.scale.linear()
                        .range([this.chart._yPixels() + this.chart._heightPixels(), this.chart._yPixels()])
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
                if (this.useLog) {
                    this._scale = d3.scale.log()
                        .range([this.chart._heightPixels() / 300, this.chart._heightPixels() / 10])
                        .domain([
                            (this._min === 0 ? Math.pow(this.logBase, -1) : this._min),
                            (this._max === 0 ? -1 * Math.pow(this.logBase, -1) : this._max)
                        ])
                        .clamp(true)
                        .base(this.logBase);
                } else {
                    this._scale = d3.scale.linear()
                        .range([this.chart._heightPixels() / 300, this.chart._heightPixels() / 10])
                        .domain([this._min, this._max]);
                }
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

            // Populate the origin.  Previously this incorrectly looked up 0 on the axis which only works
            // for measure axes leading to Issue #19.  This fix uses the first category value in cases where
            // one is required.
            if (distinctCats !== null && distinctCats !== undefined && distinctCats.length > 0) {
                origin = this._scale.copy()(distinctCats[0]);
            } else {
                origin = this._scale.copy()(0);
            }

            if (this._origin !== origin) {
                this._previousOrigin = (this._origin === null ? origin : this._origin);
                this._origin = origin;
            }

            // Return axis for chaining
            return this;
        };

