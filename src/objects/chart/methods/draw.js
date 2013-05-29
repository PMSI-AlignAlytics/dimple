// Copyright: 2013 PMSI-AlignAlytics
// License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
// Source: /src/objects/chart/methods/draw.js
// Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.chart#wiki-draw
this.draw = function (duration) {
    // Deal with optional parameter
    duration = (duration == null || duration == undefined ? 0 : duration);
    // Catch the first x and y
    var firstX = null, firstY = null;
    // Many of the draw methods use positioning data in each series.  Therefore we should
    // decorate the series with it now
    this._getSeriesData()
    // Iterate the axes and calculate bounds, this is done within the chart because an
    // axis' bounds are determined by other axes and the way that series tie them together
    this.axes.forEach(function (axis, i) {
        axis._min = 0;
        axis._max = 0;
        // Check that the axis has a measure
        if (axis.measure != null && axis.measure != undefined) {
            // Is this axis linked to a series
            var linked = false;
            // Find any linked series
            this.series.forEach(function (series, i) {
                // if this axis is linked
                if (series[axis.position] == axis) {
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
                this.data.forEach(function (d, i) {
                    if (axis._min > d[axis.measure]) { axis._min = d[axis.measure]; }
                    if (axis._max < d[axis.measure]) { axis._max = d[axis.measure]; }
                }, this);
            }
        }
        else {
            // A category axis is just set to show the number of categories
            axis._min = 0;
            var distinctCats = [];
            this.data.forEach(function (d, i) {
                if (distinctCats.indexOf(d[axis.categoryFields[0]]) == -1) {
                    distinctCats.push(d[axis.categoryFields[0]]);    
                }
            }, this);
            axis._max = distinctCats.length;
        }

        // Update the axis now we have all information set
        axis._update();

        // Record the index of the first x and first y axes
        if (firstX == null && axis.position == "x") {
            firstX = axis;
        } else if (firstY == null && axis.position == "y") {
            firstY = axis;
        }
    }, this);
    var xGridSet = false;
    var yGridSet = false;
    // Iterate the axes again
    this.axes.forEach(function (axis, i) {
        // Don't animate axes on first draw
        var firstDraw = false;
        if (axis.gridlineShapes == null) {
            if (axis.showGridlines || (axis.showGridlines == null && !axis._hasCategories() && ((!xGridSet && axis.position == "x") || (!yGridSet && axis.position == "y")))) {
                // Add a group for the gridlines to allow css formatting
                axis.gridlineShapes = this._group.append("g").attr("class", "gridlines")
                if (axis.position == "x") {
                    xGridSet = true;
                }
                else {
                    yGridSet = true;
                }
            }
        }
        else {
            if (axis.position == "x") {
                xGridSet = true;
            }
            else {
                yGridSet = true;
            }
        }
        if (axis.shapes == null) {
            // Add a group for the axes to allow css formatting
            axis.shapes = this._group.append("g").attr("class", "axis");
            firstDraw = true;
        }
        var transform = null;
        var gridSize = 0;
        var gridTransform = null;
        // If this is the first x and there is a y axis cross them at zero
        if (axis == firstX && firstY != null) {
            transform = "translate(0, " + (firstY.categoryFields == null || firstY.categoryFields.length == 0 ? firstY._scale(0) : this.y + this.height) + ")";
            gridTransform = "translate(0, " + (axis == firstX ? this.y + this.height : this.y) + ")";
            gridSize = -this.height;
        }
        // If this is the first y and there is an x axis cross them at zero
        else if (axis == firstY && firstX != null) {
            transform = "translate(" + (firstX.categoryFields == null || firstX.categoryFields.length == 0 ? firstX._scale(0) : this.x) + ", 0)";
            gridTransform = "translate(" + (axis == firstY ? this.x : this.x + this.width) + ", 0)";
            gridSize = -this.width;
        }
        // Otherwise set the x translation to use the whole width
        else if (axis.position == "x") {
            gridTransform = transform = "translate(0, " + (axis == firstX ? this.y + this.height : this.y) + ")";
            gridSize = -this.height;
        }
        // Or the y translation to use the whole height
        else if (axis.position == "y") {
            gridTransform = transform = "translate(" + (axis == firstY ? this.x : this.x + this.width) + ", 0)";
            gridSize = -this.width;
        }
        // Draw the axis
        // This code might seem unneccesary but even applying a duration of 0 to a transition will cause the code to execute after the 
        // code below and precedence is important here.
        var handleTrans = function (ob) {
            if (transform == null || duration == 0 || firstDraw) { return ob; }
            else { return ob.transition().duration(duration); }
        }
        if (transform != null && axis._draw != null) {
            handleTrans(axis.shapes).call(axis._draw.tickFormat(axis._getFormat())).attr("transform", transform);
            if (axis.gridlineShapes != null) {
                handleTrans(axis.gridlineShapes).call(axis._draw.tickSize(gridSize, 0, 0).tickFormat("")).attr("transform", gridTransform);
            }
            // Move labels around
            if (axis.measure == null || axis.measure == undefined) {
                if (axis.position == "x") {
                    handleTrans(axis.shapes.selectAll(".axis text")).attr("x", (this.width / axis._max) / 2);
                }
                else if (axis.position == "y") {
                    handleTrans(axis.shapes.selectAll(".axis text")).attr("y", -1 * (this.height / axis._max) / 2);
                }
            }
            if (axis.categoryFields != null && axis.categoryFields != undefined && axis.categoryFields.length > 0) {
                // Off set the labels to counter the transform.  This will put the labels along the outside of the chart so they
                // don't interfere with the chart contents
                if (axis == firstX && (firstY.categoryFields == null || firstY.categoryFields.length == 0)) {
                    handleTrans(axis.shapes.selectAll(".axis text")).attr("y", this.y + this.height - firstY._scale(0) + 9);
                }
                if (axis == firstY && (firstX.categoryFields == null || firstX.categoryFields.length == 0)) {
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
            if (axis.gridlineShapes != null) {
                handleTrans(axis.gridlineShapes.selectAll(".gridlines line"))
                    .style("fill", "none")
                    .style("stroke", "lightgray")
                    .style("opacity", 0.8);
            }
        }
        var rotated = false;
        // Rotate labels, this can only be done once the formats are set
        if (axis.measure == null || axis.measure == undefined) {
            if (axis == firstX) {
                // If the gaps are narrower than the widest label display all labels horizontally
                var widest = 0;
                axis.shapes.selectAll(".axis text").each(function () {
                        var w = this.getComputedTextLength();
                        widest = (w > widest ? w : widest);
                    });
                if (widest > this.width / axis._max) {
                    rotated = true;
                    var offset = (this.width / axis._max) / 2;
                    axis.shapes.selectAll(".axis text")
                        .style("text-anchor", "start")
                        .each(function () {
                            var rec = this.getBBox();
                            d3.select(this)
                                .attr("transform", "rotate(90," + rec.x + "," + (rec.y + (rec.height / 2)) + ") translate(-5, 0)");  
                        })
                }
            }
            else if (axis.position == "x") {
                // If the gaps are narrower than the widest label display all labels horizontally
                var widest = 0;
                axis.shapes.selectAll(".axis text")
                    .each(function () {
                        var w = this.getComputedTextLength();
                        widest = (w > widest ? w : widest);
                    });
                if (widest > this.width / axis._max) {
                    var offset = (this.width / axis._max) / 2;
                    axis.shapes.selectAll(".axis text")
                        .style("text-anchor", "end")
                        .each(function () {
                            var rec = this.getBBox();
                            d3.select(this)
                                .attr("transform", "rotate(90," + (rec.x + rec.width) + "," + (rec.y + (rec.height / 2)) + ") translate(5, 0)");  
                        }) 
                }
            }
        }
        if (axis.titleShape == null && axis.shapes != null && axis.shapes.node().firstChild != null) {
            // Get the maximum edge bounds
            var box = { l: null, t: null, r: null, b: null };
            // Get the bounds of the axis objects
            axis.shapes.selectAll(".axis text")
                .each(function () {
                    var rec = this.getBBox();
                    box.l = (box.l == null || rec.x < box.l ? rec.x : box.l);
                    box.t = (rotated ? (box.t == null ||rec.y + rec.width < box.t ? rec.y + rec.width : box.t) : (box.t == null || rec.y < box.t ? rec.y : box.t));
                    box.r = (box.r == null || rec.x + rec.width > box.r ? rec.x + rec.width : box.r);
                    box.b = (rotated ? (box.b == null || rec.y + rec.width > box.b ? rec.y + rec.width : box.b) : (box.b == null || rec.y + rec.height > box.b ? rec.y + rec.height : box.b));
                });
            var titleX = 0;
            var titleY = 0;
            var rotate = "";
            if (axis.position == "x") {
                if (axis == firstX) {
                    titleY = this.y + this.height + box.b + 10;
                }
                else {
                    titleY = this.y + box.l + box.t - 5;
                    
                }
                titleX = this.x + (this.width / 2);
            }
            else if (axis.position == "y") {
                if (axis == firstY) {
                    titleX = this.x + box.l - 10;  
                }
                else {
                    titleX = this.x + this.width + box.r + 10;
                }
                titleY = this.y + (this.height / 2);
                rotate = "rotate(270, " + titleX + ", " + titleY + ")"
            }
            
            // Add a title for the axis
            axis.titleShape = this._group.append("text").attr("class", "axis title");
            var chart = this;
            axis.titleShape
                .attr("x", titleX)
                .attr("y", titleY)
                .attr("text-anchor", "middle")
                .attr("transform", rotate)
                .text((axis.categoryFields == null || axis.categoryFields == undefined || axis.categoryFields.length == 0 ? axis.measure : axis.categoryFields.join("/")))
                .each(function () {
                    if (!chart.noFormats) {
                        d3.select(this)
                            .style("font-family", "sans-serif")
                            .style("font-size", (chart.height / 35 > 10 ? chart.height / 35 : 10) + "px");
                    }
                });
            
            // Offset Y position to baseline. This previously used dominant-baseline but this caused
            // browser inconsistency
            if (axis == firstX) {
                axis.titleShape.each(function () {
                    d3.select(this).attr("y", titleY + this.getBBox().height / 1.65);
                });
            }
            else if (axis == firstY) {
                axis.titleShape.each(function () {
                    d3.select(this).attr("x", titleX + this.getBBox().height / 1.65);
                });
            }
        }
    }, this);
 
    // Iterate the series
    this.series.forEach(function (series, i) {
        series.plot.draw(this, series, duration);
        this._registerEventHandlers(series);
    }, this);
    // Iterate the legends
    this.legends.forEach(function (legend, i) {
        legend._draw(duration);
    }, this);
    // If the chart has a storyboard
    if (this.storyboard != null && this.storyboard != undefined) {
        this.storyboard._drawText();
        if (this.storyboard.autoplay) {
            this.storyboard.startAnimation();
        }
    }
    // Return the chart for chaining
    return this;
};
