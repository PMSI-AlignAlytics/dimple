    dimple.series.pie = {
        // By default the bar series is stacked if there are series categories
        stacked: false,
        // This is not a grouped plot meaning that one point is treated as one series value
        grouped: false,
        // The axes which will affect the bar chart - not z
        supportedAxes: ["x", "y", "c", "p"],

        // Draw the chart
        draw: function (chart, series, duration) {

            var chartData = series._positionData,
                theseShapes = null,
                classes = ["dimple-series-" + chart.series.indexOf(series), "dimple-pie"],
                updated,
                removed,
                center = { x: 0, y: 0 },
                arc,
                pie,
                startAngle = (series.startAngle * (Math.PI / 180) || 0),
                endAngle = (series.endAngle || 360) * (Math.PI / 180);

            // If the startAngle is after the endAngle (e.g. 270deg -> 90deg becomes -90deg -> 90deg.
            if (startAngle > endAngle) {
                startAngle -= 2 * Math.PI;
            }

            // Store the displayed angles in _current.
            // Then, interpolate from _current to the new angles.
            // During the transition, _current is updated in-place by d3.interpolate.
            function arcTween(a) {
                var i = d3.interpolate(this._current, a);
                this._current = i(0);
                return function(t) {
                    return arc(i(t));
                };
            }

            // Clear tool tips
            if (chart._tooltipGroup !== null && chart._tooltipGroup !== undefined) {
                chart._tooltipGroup.remove();
            }

            // Calculate the dimensions of the pie
            center.x = chart._widthPixels() / 2;
            center.y = chart._heightPixels() / 2;

            // The actual arc
            arc = d3.svg.arc()
                .innerRadius(series.innerRadius || 0)
                .outerRadius(center.x < center.y ? center.x : center.y);

            // Set the layout
            pie = d3.layout.pie()
                .sort(null)
                .startAngle(startAngle)
                .endAngle(endAngle)
                .value(function (d) {
                    return d.pValue;
                });

            if (series.shapes === null || series.shapes === undefined) {
                theseShapes =  chart._group.selectAll("." + classes.join(".")).data(pie(chartData));
            } else {
                theseShapes = series.shapes.data(pie(chartData), function (d) { return d.data.key; });
            }

            // Add
            theseShapes
                .enter()
                .append("path")
                .attr("id", function (d) { return d.key; })
                .attr("class", function (d) {
                    var c = [];
                    c = c.concat(d.data.aggField);
                    c = c.concat(d.data.pField);
                    return classes.join(" ") + " " + dimple._createClass(c);
                })
                .attr("d", arc)
                .attr("opacity", function (d) { return dimple._helpers.opacity(d.data, chart, series); })
                .on("mouseover", function (e) { dimple._showBarTooltip(e.data, this, chart, series); })
                .on("mouseleave", function (e) { dimple._removeTooltip(e.data, this, chart, series); })
                .call(function () {
                    if (!chart.noFormats) {
                        this.attr("fill", function (d) { return dimple._helpers.fill(d.data, chart, series); })
                            .attr("stroke", function (d) { return dimple._helpers.stroke(d.data, chart, series); });
                    }
                })
                .attr("transform", "translate(" + (chart._xPixels() + center.x) + ", " + (chart._yPixels() + center.y) + ")")
                .each(function (d) {
                    this._current = d;
                });

            // Update
            updated = chart._handleTransition(theseShapes, duration, chart, series)
                .call(function () {
                    if (duration && duration > 0) {
                        this.attrTween("d", arcTween);
                    } else {
                        this.attr("d", arc);
                    }
                    if (!chart.noFormats) {
                        this.attr("fill", function (d) { return dimple._helpers.fill(d.data, chart, series); })
                            .attr("stroke", function (d) { return dimple._helpers.stroke(d.data, chart, series); });
                    }
                })
                .each(function (d) {
                    // Slight hack to expose the centroid to calling code
                    d.centroid = arc.centroid(d);
                });

            // Remove
            removed = chart._handleTransition(theseShapes.exit(), duration, chart, series)
                .attr("d", arc);

            dimple._postDrawHandling(series, updated, removed, duration);

            // Save the shapes to the series array
            series.shapes = theseShapes;
        }
    };