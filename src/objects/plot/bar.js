    // Copyright: 2014 PMSI-AlignAlytics
    // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
    // Source: /src/objects/plot/bar.js
    dimple.plot.bar = {

        // By default the bar series is stacked if there are series categories
        stacked: true,

        // The axes which will affect the bar chart - not z
        supportedAxes: ["x", "y", "c"],

        // Draw the chart
        draw: function (chart, series, duration) {

            var chartData = series._positionData,
                theseShapes = null,
                classes = ["dimple-series-" + chart.series.indexOf(series), "dimple-bar"],
                updated,
                removed,
                xFloat = !series._isStacked() && series.x._hasMeasure(),
                yFloat = !series._isStacked() && series.y._hasMeasure();

            if (chart._tooltipGroup !== null && chart._tooltipGroup !== undefined) {
                chart._tooltipGroup.remove();
            }

            if (series.shapes === null || series.shapes === undefined) {
                theseShapes = chart._group.selectAll("." + classes.join(".")).data(chartData);
            } else {
                theseShapes = series.shapes.data(chartData, function (d) { return d.key; });
            }

            // Add
            theseShapes
                .enter()
                .append("rect")
                .attr("id", function (d) { return d.key; })
                .attr("class", function (d) {
                    var c = [];
                    c = c.concat(d.aggField);
                    c = c.concat(d.xField);
                    c = c.concat(d.yField);
                    return classes.join(" ") + " " + dimple._createClass(c);
                })
                .attr("x", function (d) { return dimple._helpers.x(d, chart, series); })
                .attr("y", function (d) { return dimple._helpers.y(d, chart, series) + dimple._helpers.height(d, chart, series); })
                .attr("width", function (d) {return (d.xField !== null && d.xField.length > 0 ? dimple._helpers.width(d, chart, series) : 0); })
                .attr("height", function (d) {return (d.yField !== null && d.yField.length > 0 ? dimple._helpers.height(d, chart, series) : 0); })
                .attr("opacity", function (d) { return dimple._helpers.opacity(d, chart, series); })
                .on("mouseover", function (e) {
                    dimple._showBarTooltip(e, this, chart, series);
                })
                .on("mouseleave", function (e) {
                    dimple._removeTooltip(e, this, chart, series);
                })
                .call(function () {
                    if (!chart.noFormats) {
                        this.attr("fill", function (d) { return dimple._helpers.fill(d, chart, series); })
                            .attr("stroke", function (d) { return dimple._helpers.stroke(d, chart, series); });
                    }
                });

            // Update
            updated = dimple._handleTransition(theseShapes, duration)
                .attr("x", function (d) { return xFloat ? dimple._helpers.cx(d, chart, series) - series.x.floatingBarWidth / 2 : dimple._helpers.x(d, chart, series); })
                .attr("y", function (d) { return yFloat ? dimple._helpers.cy(d, chart, series) - series.y.floatingBarWidth / 2 : dimple._helpers.y(d, chart, series); })
                .attr("width", function (d) { return (xFloat ? series.x.floatingBarWidth : dimple._helpers.width(d, chart, series)); })
                .attr("height", function (d) { return (yFloat ? series.y.floatingBarWidth : dimple._helpers.height(d, chart, series)); })
                .call(function () {
                    if (!chart.noFormats) {
                        this.attr("fill", function (d) { return dimple._helpers.fill(d, chart, series); })
                            .attr("stroke", function (d) { return dimple._helpers.stroke(d, chart, series); });
                    }
                });

            // Remove
            removed = dimple._handleTransition(theseShapes.exit(), duration)
                .attr("x", function (d) { return dimple._helpers.x(d, chart, series); })
                .attr("y", function (d) { return dimple._helpers.y(d, chart, series) + dimple._helpers.height(d, chart, series); })
                .attr("width", function (d) {return (d.xField !== null && d.xField.length > 0 ? dimple._helpers.width(d, chart, series) : 0); })
                .attr("height", function (d) {return (d.yField !== null && d.yField.length > 0 ? dimple._helpers.height(d, chart, series) : 0); });

            dimple._postDrawHandling(series, updated, removed, duration);

            // Save the shapes to the series array
            series.shapes = theseShapes;
        }
    };

