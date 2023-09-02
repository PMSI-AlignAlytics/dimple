    // Copyright: 2015 AlignAlytics
    // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
    // Source: /src/objects/plot/bar.js
    dimple.plot.bar = {

        // By default the bar series is stacked if there are series categories
        stacked: true,

        // This is not a grouped plot meaning that one point is treated as one series value
        grouped: false,

        // The axes which will affect the bar chart - not z
        supportedAxes: ["x", "y", "c"],

        // Draw the chart
        draw: function (chart, series, duration) {

            var chartData = series._positionData,
                theseShapes = null,
                classes = ["dimple-series-" + chart.series.indexOf(series), "dimple-bar"],
                entered,
                updated,
                removed,
                xFloat = !series._isStacked() && series.x._hasMeasure(),
                yFloat = !series._isStacked() && series.y._hasMeasure(),
                cat = "none";

            if (series.x._hasCategories() && series.y._hasCategories()) {
                cat = "both";
            } else if (series.x._hasCategories()) {
                cat = "x";
            } else if (series.y._hasCategories()) {
                cat = "y";
            }

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
                .append("rect")
                .attr("id", function (d) { return dimple._createClass([d.key]); })
                .attr("class", function (d) {
                    var c = [];
                    c = c.concat(d.aggField);
                    c = c.concat(d.xField);
                    c = c.concat(d.yField);
                    return classes.join(" ") + " " + dimple._createClass(c) + " " + chart.customClassList.barSeries + " " + dimple._helpers.css(d, chart);
                })
                .attr("x", function (d) {
                    var returnValue = series.x._previousOrigin;
                    if (cat === "x") {
                        returnValue = dimple._helpers.x(d, chart, series);
                    } else if (cat === "both") {
                        returnValue = dimple._helpers.cx(d, chart, series);
                    }
                    return returnValue;
                })
                .attr("y", function (d) {
                    var returnValue = series.y._previousOrigin;
                    if (cat === "y") {
                        returnValue = dimple._helpers.y(d, chart, series);
                    } else if (cat === "both") {
                        returnValue = dimple._helpers.cy(d, chart, series);
                    }
                    return returnValue;
                })
                .attr("width", function (d) { return (cat === "x" ?  dimple._helpers.width(d, chart, series) : 0); })
                .attr("height", function (d) { return (cat === "y" ?  dimple._helpers.height(d, chart, series) : 0); })
                .on("mouseover", function (e, d) { dimple._showBarTooltip(d, this, chart, series); })
                .on("mouseleave", function (e, d) { dimple._removeTooltip(d, this, chart, series); })
                .call(function (context) {
                    if (!chart.noFormats) {
                        context.attr("opacity", function (d) { return dimple._helpers.opacity(d, chart, series); })
                            .style("fill", function (d) { return dimple._helpers.fill(d, chart, series); })
                            .style("stroke", function (d) { return dimple._helpers.stroke(d, chart, series); });
                    }
                });

            // Update
            updated = chart._handleTransition(theseShapes.merge(entered), duration, chart, series)
                .attr("x", function (d) { return xFloat ? dimple._helpers.cx(d, chart, series) - series.x.floatingBarWidth / 2 : dimple._helpers.x(d, chart, series); })
                .attr("y", function (d) { return yFloat ? dimple._helpers.cy(d, chart, series) - series.y.floatingBarWidth / 2 : dimple._helpers.y(d, chart, series); })
                .attr("width", function (d) { return (xFloat ? series.x.floatingBarWidth : dimple._helpers.width(d, chart, series)); })
                .attr("height", function (d) { return (yFloat ? series.y.floatingBarWidth : dimple._helpers.height(d, chart, series)); })
                .call(function (context) {
                    if (!chart.noFormats) {
                        context.attr("fill", function (d) { return dimple._helpers.fill(d, chart, series); })
                            .attr("stroke", function (d) { return dimple._helpers.stroke(d, chart, series); });
                    }
                });

            // Remove
            removed = chart._handleTransition(theseShapes.exit(), duration, chart, series)
                .attr("x", function (d) {
                    var returnValue = series.x._origin;
                    if (cat === "x") {
                        returnValue = dimple._helpers.x(d, chart, series);
                    } else if (cat === "both") {
                        returnValue = dimple._helpers.cx(d, chart, series);
                    }
                    return returnValue;
                })
                .attr("y", function (d) {
                    var returnValue = series.y._origin;
                    if (cat === "y") {
                        returnValue = dimple._helpers.y(d, chart, series);
                    } else if (cat === "both") {
                        returnValue = dimple._helpers.cy(d, chart, series);
                    }
                    return returnValue;
                })
                .attr("width", function (d) { return (cat === "x" ?  dimple._helpers.width(d, chart, series) : 0); })
                .attr("height", function (d) { return (cat === "y" ?  dimple._helpers.height(d, chart, series) : 0); });

            dimple._postDrawHandling(series, updated, removed, duration);

            // Save the shapes to the series array
            series.shapes = series._group.selectAll("." + classes.join("."));
        }
    };
