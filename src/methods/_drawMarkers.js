    // Copyright: 2015 AlignAlytics
    // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
    // Source: /src/methods/_drawMarkers.js
    dimple._drawMarkers = function (lineDataRow, chart, series, duration, className, useGradient, enterEventHandler, leaveEventHandler, lineShape) {
        var markers,
            markerClasses = ["dimple-marker", className, lineDataRow.keyString],
            rem,
            shapes;

        // Deal with markers in the same way as main series to fix #28
        if (series._markers === null || series._markers === undefined || series._markers[lineDataRow.keyString] === undefined) {
            markers = chart._group.selectAll("." + markerClasses.join(".")).data(lineDataRow.markerData);
        } else {
            markers = series._markers[lineDataRow.keyString].data(lineDataRow.markerData, function (d) {
                return d.key;
            });
        }
        // Add
        if (lineShape.nextSibling && lineShape.nextSibling.id) {
            shapes = markers.enter().insert("circle", '#' + lineShape.nextSibling.id);
        } else {
            shapes = markers.enter().append("circle");
        }
        shapes
            .attr("id", function (d) {
                return dimple._createClass([d.key + " Marker"]);
            })
            .attr("class", function (d) {
                var fields = [],
                    css = chart.getClass(d.aggField.length > 0 ? d.aggField[d.aggField.length - 1] : "All");
                if (series.x._hasCategories()) {
                    fields = fields.concat(d.xField);
                }
                if (series.y._hasCategories()) {
                    fields = fields.concat(d.yField);
                }
                return dimple._createClass(fields) + " " + markerClasses.join(" ") + " " + chart.customClassList.lineMarker + " " + css;
            })
            .on("mouseover", function (e) {
                enterEventHandler(e, this, chart, series);
            })
            .on("mouseleave", function (e) {
                leaveEventHandler(e, this, chart, series);
            })
            .attr("cx", function (d) {
                return (series.x._hasCategories() ? dimple._helpers.cx(d, chart, series) : series.x._previousOrigin);
            })
            .attr("cy", function (d) {
                return (series.y._hasCategories() ? dimple._helpers.cy(d, chart, series) : series.y._previousOrigin);
            })
            .attr("r", 0)
            .attr("opacity", (series.lineMarkers || lineDataRow.data.length < 2 ? lineDataRow.color.opacity : 0))
            .call(function () {
                if (!chart.noFormats) {
                    this.attr("fill", "white")
                        .style("stroke-width", series.lineWeight)
                        .attr("stroke", function (d) {
                            return (useGradient ? dimple._helpers.fill(d, chart, series) : lineDataRow.color.stroke);
                        });
                }
            });

        // Update
        chart._handleTransition(markers, duration, chart)
            .attr("cx", function (d) { return dimple._helpers.cx(d, chart, series); })
            .attr("cy", function (d) { return dimple._helpers.cy(d, chart, series); })
            .attr("r", 2 + series.lineWeight)
            .attr("opacity", (series.lineMarkers || lineDataRow.data.length < 2 ? lineDataRow.color.opacity : 0))
            .call(function () {
                if (!chart.noFormats) {
                    this.attr("fill", "white")
                        .style("stroke-width", series.lineWeight)
                        .attr("stroke", function (d) {
                            return (useGradient ? dimple._helpers.fill(d, chart, series) : lineDataRow.color.stroke);
                        });
                }
            });

        // Remove
        rem = chart._handleTransition(markers.exit(), duration, chart)
            .attr("cx", function (d) { return (series.x._hasCategories() ? dimple._helpers.cx(d, chart, series) : series.x._origin); })
            .attr("cy", function (d) { return (series.y._hasCategories() ? dimple._helpers.cy(d, chart, series) : series.y._origin); })
            .attr("r", 0);

        // Run after transition methods
        if (duration === 0) {
            rem.remove();
        } else {
            rem.each("end", function () {
                d3.select(this).remove();
            });
        }

        if (series._markers === undefined || series._markers === null) {
            series._markers = {};
        }
        series._markers[lineDataRow.keyString] = markers;

        // Insert the backings before the markers
        dimple._drawMarkerBacks(lineDataRow, chart, series, duration, className, lineShape);

    };
