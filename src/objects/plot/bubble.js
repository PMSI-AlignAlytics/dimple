    // Copyright: 2015 AlignAlytics
    // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
    // Source: /src/objects/plot/bubble.js
    dimple.plot.bubble = {

        // By default the bubble values are not stacked
        stacked: false,

        // This is not a grouped plot meaning that one point is treated as one series value
        grouped: false,

        // The axis positions affecting the bubble series
        supportedAxes: ["x", "y", "z", "c"],

        // Draw the axis
        draw: function (chart, series, duration) {

            var chartData = series._positionData,
                theseShapes = null,
                classes = ["dimple-series-" + chart.series.indexOf(series), "dimple-bubble"],
                entered,
                updated,
                removed;

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
                .append("circle")
                .attr("id", function (d) { return dimple._createClass([d.key]); })
                .attr("class", function (d) {
                    var c = [];
                    c = c.concat(d.aggField);
                    c = c.concat(d.xField);
                    c = c.concat(d.yField);
                    c = c.concat(d.zField);
                    return classes.join(" ") + " " + dimple._createClass(c) + " " + chart.customClassList.bubbleSeries + " " + dimple._helpers.css(d, chart);
                })
                .attr("cx", function (d) { return (series.x._hasCategories() ? dimple._helpers.cx(d, chart, series) : series.x._previousOrigin); })
                .attr("cy", function (d) { return (series.y._hasCategories() ? dimple._helpers.cy(d, chart, series) : series.y._previousOrigin); })
                .attr("r", 0)
                .on("mouseover", function (e, d) { dimple._showPointTooltip(d, this, chart, series); })
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
                .attr("cx", function (d) { return dimple._helpers.cx(d, chart, series); })
                .attr("cy", function (d) { return dimple._helpers.cy(d, chart, series); })
                .attr("r", function (d) { return dimple._helpers.r(d, chart, series); })
                .call(function (context) {
                    if (!chart.noFormats) {
                        context.attr("fill", function (d) { return dimple._helpers.fill(d, chart, series); })
                            .attr("stroke", function (d) { return dimple._helpers.stroke(d, chart, series); });
                    }
                });

            // Remove
            removed = chart._handleTransition(theseShapes.exit(), duration, chart, series)
                .attr("r", 0)
                .attr("cx", function (d) { return (series.x._hasCategories() ? dimple._helpers.cx(d, chart, series) : series.x._origin); })
                .attr("cy", function (d) { return (series.y._hasCategories() ? dimple._helpers.cy(d, chart, series) : series.y._origin); });

            dimple._postDrawHandling(series, updated, removed, duration);

            // Save the shapes to the series array
            series.shapes = series._group.selectAll("." + classes.join("."));

        }
    };
