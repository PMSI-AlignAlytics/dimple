    // Copyright: 2015 AlignAlytics
    // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
    // Source: /src/objects/plot/pie.js
    dimple.plot.pie = {
        // By default the bar series is stacked if there are series categories
        stacked: false,
        // This is not a grouped plot meaning that one point is treated as one series value
        grouped: false,
        // The axes which will affect the bar chart - not z
        supportedAxes: ["x", "y", "c", "z", "p"],

        // Draw the chart
        draw: function (chart, series, duration) {

            var chartData = series._positionData,
                theseShapes = null,
                classes = ["dimple-series-" + chart.series.indexOf(series), "dimple-pie"],
                entered,
                updated,
                removed,
                getOuterBase = function (d) {
                    var oR;
                    if (series.x && series.y) {
                        oR = dimple._helpers.r(d, chart, series);
                    } else {
                        oR = chart._widthPixels() < chart._heightPixels() ? chart._widthPixels() / 2 : chart._heightPixels() / 2;
                    }
                    return oR;
                },
                getOuterRadius = function (d) {
                    var oR = getOuterBase(d);
                    if (series.outerRadius) {
                        oR = dimple._parsePosition(series.outerRadius, oR);
                    }
                    return Math.max(oR, 0);
                },
                getInnerRadius = function (d) {
                    var iR = 0;
                    if (series.innerRadius) {
                        iR = dimple._parsePosition(series.innerRadius, getOuterBase(d));
                    }
                    return Math.max(iR, 0);
                },
                getArc = function (d) {
                    // Calculate the radii of the circles
                    var arc;
                    // The actual arc
                    arc = d3.arc()
                        .innerRadius(getInnerRadius(d))
                        .outerRadius(getOuterRadius(d));
                    // Return the value
                    return arc(d);
                },
                arcTween = function (a) {
                    a.innerRadius = getInnerRadius(a);
                    a.outerRadius = getOuterRadius(a);
                    var i = d3.interpolate(this._current, a),
                        arc;
                    // The actual arc
                    arc = d3.arc()
                        .innerRadius(function (d) { return d.innerRadius; })
                        .outerRadius(function (d) { return d.outerRadius; });
                    this._current = i(0);
                    return function (t) {
                        return arc(i(t));
                    };
                },
                getTransform = function (origin) {
                    return function (d) {
                        var xString,
                            yString;
                        if (series.x && series.y) {
                            if (!origin || series.x._hasCategories()) {
                                xString = dimple._helpers.cx(d, chart, series);
                            } else {
                                xString = series.x._previousOrigin;
                            }
                            if (!origin || series.y._hasCategories()) {
                                yString = dimple._helpers.cy(d, chart, series);
                            } else {
                                yString = series.y._previousOrigin;
                            }
                        } else {
                            xString = (chart._xPixels() + chart._widthPixels() / 2);
                            yString = (chart._yPixels() + chart._heightPixels() / 2);
                        }
                        return "translate(" + xString + "," + yString + ")";
                    };
                };

            // Clear tool tips
            if (chart._tooltipGroup) {
                chart._tooltipGroup.remove();
            }

            if (!series.shapes) {
                theseShapes = series._group.selectAll("." + classes.join(".")).data(chartData, function (d) { return d.key; });
            } else {
                theseShapes = series.shapes.data(chartData, function (d) { return d.key; });
            }

            // Add
            entered = theseShapes
                .enter()
                .append("path")
                .attr("id", function (d) { return dimple._createClass([d.key]); })
                .attr("class", function (d) {
                    var c = [];
                    c = c.concat(d.aggField);
                    c = c.concat(d.pField);
                    return classes.join(" ") + " " + dimple._createClass(c) + " " + chart.customClassList.pieSeries + " " + dimple._helpers.css(d, chart);
                })
                .attr("d", getArc)
                .on("mouseover", function (e) { dimple._showBarTooltip(e, this, chart, series); })
                .on("mouseleave", function (e) { dimple._removeTooltip(e, this, chart, series); })
                .call(function (context) {
                    if (!chart.noFormats) {
                        context.attr("opacity", function (d) { return dimple._helpers.opacity(d, chart, series); })
                            .style("fill", function (d) { return dimple._helpers.fill(d, chart, series); })
                            .style("stroke", function (d) { return dimple._helpers.stroke(d, chart, series); });
                    }
                })
                .attr("transform", getTransform(true))
                .each(function (d) {
                    this._current = d;
                    d.innerRadius = getInnerRadius(d);
                    d.outerRadius = getOuterRadius(d);
                });

            // Update
            updated = chart._handleTransition(theseShapes.merge(entered), duration, chart, series)
                .call(function (context) {
                    if (duration && duration > 0) {
                        context.attrTween("d", arcTween);
                    } else {
                        context.attr("d", getArc);
                    }
                    if (!chart.noFormats) {
                        context.attr("fill", function (d) { return dimple._helpers.fill(d, chart, series); })
                            .attr("stroke", function (d) { return dimple._helpers.stroke(d, chart, series); });
                    }
                })
                .attr("transform", getTransform(false));

            // Remove
            removed = chart._handleTransition(theseShapes.exit(), duration, chart, series)
                .attr("transform", getTransform(true))
                .attr("d", getArc);

            dimple._postDrawHandling(series, updated, removed, duration);

            // Save the shapes to the series array
            series.shapes = series._group.selectAll("." + classes.join("."));

        }
    };
