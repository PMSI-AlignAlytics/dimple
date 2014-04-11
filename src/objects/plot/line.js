    // Copyright: 2014 PMSI-AlignAlytics
    // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
    // Source: /src/objects/plot/line.js
    dimple.plot.line = {
        stacked: false,
        supportedAxes: ["x", "y", "c"],
        draw: function (chart, series, duration) {
            // Get the position data
            var data = series._positionData,
                self = this,
                lineData = [],
                theseShapes = null,
                className = "dmp-series-" + chart.series.indexOf(series),
                // If there is a category axis we should draw a line for each aggField.  Otherwise
                // the first aggField defines the points and the others define the line
                firstAgg = (series.x._hasCategories() || series.y._hasCategories() ? 0 : 1),
                // Build the point calculator
                updateCoords = d3.svg.line()
                    .x(function (d) { return (dimple._helpers.cx(d, chart, series)).toFixed(2); })
                    .y(function (d) { return (dimple._helpers.cy(d, chart, series)).toFixed(2); }),
                // Build the point calculator
                entryCoords = d3.svg.line()
                    .x(function (d) { return (series.x._hasCategories() ? dimple._helpers.cx(d, chart, series) : series.x._previousOrigin).toFixed(2); })
                    .y(function (d) { return (series.y._hasCategories() ? dimple._helpers.cy(d, chart, series) : series.y._previousOrigin).toFixed(2); }),
                // Build the point calculator
                exitCoords = d3.svg.line()
                    .x(function (d) { return (series.x._hasCategories() ? dimple._helpers.cx(d, chart, series) : series.x._origin).toFixed(2); })
                    .y(function (d) { return (series.y._hasCategories() ? dimple._helpers.cy(d, chart, series) : series.y._origin).toFixed(2); }),
                graded = false,
                i,
                k,
                key,
                keyString,
                rowIndex,
                getSeriesOrder = function (d, s) {
                    var rules = [].concat(series._orderRules),
                        cats = s.categoryFields,
                        returnValue = [];
                    if (cats !== null && cats !== undefined && cats.length > 0) {
                        // Concat is used here to break the reference to the parent array, if we don't do this, in a storyboarded chart,
                        // the series rules to grow and grow until the system grinds to a halt trying to deal with them all.
                        if (s.c !== null && s.c !== undefined && s.c._hasMeasure()) {
                            rules.push({ ordering : s.c.measure, desc : true });
                        }
                        if (s.x._hasMeasure()) {
                            rules.push({ ordering : s.x.measure, desc : true });
                        }
                        if (s.y._hasMeasure()) {
                            rules.push({ ordering : s.y.measure, desc : true });
                        }
                        returnValue = dimple._getOrderedList(d, cats, rules);
                    }
                    return returnValue;
                },
                // Get the array of ordered values
                orderedSeriesArray = getSeriesOrder(series.data || chart.data, series),
                arrayIndexCompare = function (array, a, b) {
                    var returnValue,
                        p,
                        q,
                        aMatch,
                        bMatch,
                        rowArray;
                    for (p = 0; p < array.length; p += 1) {
                        aMatch = true;
                        bMatch = true;
                        rowArray = [].concat(array[p]);
                        for (q = 0; q < a.length; q += 1) {
                            aMatch = aMatch && (a[q] === rowArray[q]);
                        }
                        for (q = 0; q < b.length; q += 1) {
                            bMatch = bMatch && (b[q] === rowArray[q]);
                        }
                        if (aMatch && bMatch) {
                            returnValue = 0;
                            break;
                        } else if (aMatch) {
                            returnValue = -1;
                            break;
                        } else if (bMatch) {
                            returnValue = 1;
                            break;
                        }
                    }
                    return returnValue;
                },
                sortFunction = function (a, b) {
                    var sortValue = 0;
                    if (series.x._hasCategories()) {
                        sortValue = (dimple._helpers.cx(a, chart, series) < dimple._helpers.cx(b, chart, series) ? -1 : 1);
                    } else if (series.y._hasCategories()) {
                        sortValue = (dimple._helpers.cy(a, chart, series) < dimple._helpers.cy(b, chart, series) ? -1 : 1);
                    } else if (orderedSeriesArray !== null && orderedSeriesArray !== undefined) {
                        sortValue = arrayIndexCompare(orderedSeriesArray, a.aggField, b.aggField);
                    }
                    return sortValue;
                },
                addTransition = function (input, duration) {
                    var returnShape = null;
                    if (duration === 0) {
                        returnShape = input;
                    } else {
                        returnShape = input.transition().duration(duration);
                    }
                    return returnShape;
                },
                drawMarkerBacks = function (lineDataRow) {
                    var markerBacks,
                        markerBackClasses = ["dmp-marker-backs", className, "dmp-" + lineDataRow.keyString],
                        rem;
                    if (series.lineMarkers) {
                        if (series._markerBacks === null || series._markerBacks === undefined || series._markerBacks[lineDataRow.keyString] === undefined) {
                            markerBacks = chart._group.selectAll("." + markerBackClasses.join(".")).data(lineDataRow.data);
                        } else {
                            markerBacks = series._markerBacks[lineDataRow.keyString].data(lineDataRow.data, function (d) { return d.key; });
                        }
                        // Add
                        markerBacks
                            .enter()
                            .append("circle")
                            .attr("id", function (d) { return d.key; })
                            .attr("class", markerBackClasses.join(" "))
                            .attr("cx", function (d) { return (series.x._hasCategories() ? dimple._helpers.cx(d, chart, series) : series.x._previousOrigin); })
                            .attr("cy", function (d) { return (series.y._hasCategories() ? dimple._helpers.cy(d, chart, series) : series.y._previousOrigin); })
                            .attr("r", 0)
                            .attr("fill", "white")
                            .attr("stroke", "none");

                        // Update
                        addTransition(markerBacks, duration)
                            .attr("cx", function (d) { return dimple._helpers.cx(d, chart, series); })
                            .attr("cy", function (d) { return dimple._helpers.cy(d, chart, series); })
                            .attr("r", 2 + series.lineWeight);

                        // Remove
                        rem = addTransition(markerBacks.exit(), duration)
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

                        if (series._markerBacks === undefined || series._markerBacks === null) {
                            series._markerBacks = {};
                        }
                        series._markerBacks[lineDataRow.keyString] = markerBacks;
                    }
                },
                // Add the actual marker. We need to do this even if we aren't displaying them because they
                // catch hover events
                drawMarkers = function (lineDataRow) {
                    var markers,
                        markerClasses = ["dmp-markers", className, "dmp-" + lineDataRow.keyString],
                        rem;
                    // Deal with markers in the same way as main series to fix #28
                    if (series._markers === null || series._markers === undefined || series._markers[lineDataRow.keyString] === undefined) {
                        markers = chart._group.selectAll("." + markerClasses.join(".")).data(lineDataRow.data);
                    } else {
                        markers = series._markers[lineDataRow.keyString].data(lineDataRow.data, function (d) { return d.key; });
                    }
                    // Add
                    markers
                        .enter()
                        .append("circle")
                        .attr("id", function (d) { return d.key; })
                        .attr("class", markerClasses.join(" "))
                        .on("mouseover", function (e) {
                            self.enterEventHandler(e, this, chart, series);
                        })
                        .on("mouseleave", function (e) {
                            self.leaveEventHandler(e, this, chart, series);
                        })
                        .attr("cx", function (d) { return (series.x._hasCategories() ? dimple._helpers.cx(d, chart, series) : series.x._previousOrigin); })
                        .attr("cy", function (d) { return (series.y._hasCategories() ? dimple._helpers.cy(d, chart, series) : series.y._previousOrigin); })
                        .attr("r", 0)
                        .attr("opacity", (series.lineMarkers || lineDataRow.data.length < 2 ? lineDataRow.color.opacity : 0))
                        .call(function () {
                            if (!chart.noFormats) {
                                this.attr("fill", "white")
                                    .style("stroke-width", series.lineWeight)
                                    .attr("stroke", function (d) {
                                        return (graded ? dimple._helpers.fill(d, chart, series) : lineDataRow.color.stroke);
                                    });
                            }
                        });

                    // Update
                    addTransition(markers, duration)
                        .attr("cx", function (d) { return dimple._helpers.cx(d, chart, series); })
                        .attr("cy", function (d) { return dimple._helpers.cy(d, chart, series); })
                        .attr("r", 2 + series.lineWeight)
                        .call(function () {
                            if (!chart.noFormats) {
                                this.attr("fill", "white")
                                    .style("stroke-width", series.lineWeight)
                                    .attr("stroke", function (d) {
                                        return (graded ? dimple._helpers.fill(d, chart, series) : lineDataRow.color.stroke);
                                    });
                            }
                        });

                    // Remove
                    rem = addTransition(markers.exit(), duration)
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
                },
                updated,
                removed;

            if (series.c !== null && series.c !== undefined && ((series.x._hasCategories() && series.y._hasMeasure()) || (series.y._hasCategories() && series.x._hasMeasure()))) {
                graded = true;
            }

            // Create a set of line data grouped by the aggregation field
            for (i = 0; i < data.length; i += 1) {
                key = [];
                rowIndex = -1;
                // Skip the first category unless there is a category axis on x or y
                for (k = firstAgg; k < data[i].aggField.length; k += 1) {
                    key.push(data[i].aggField[k]);
                }
                // Find the corresponding row in the lineData
                keyString = dimple._createClass(key);
                for (k = 0; k < lineData.length; k += 1) {
                    if (lineData[k].keyString === keyString) {
                        rowIndex = k;
                        break;
                    }
                }
                // Add a row to the line data if none was found
                if (rowIndex === -1) {
                    rowIndex = lineData.length;
                    lineData.push({
                        key: key,
                        keyString: keyString,
                        color: "white",
                        data: [],
                        line: {},
                        entryExit: {}
                    });
                }
                // Add this row to the relevant data
                lineData[rowIndex].data.push(data[i]);
            }

            // Sort the line data itself based on the order series array - this matters for stacked lines and default color
            // consistency with colors usually awarded in terms of prominence
            if (orderedSeriesArray !== null && orderedSeriesArray !== undefined) {
                lineData.sort(function (a, b) {
                    return arrayIndexCompare(orderedSeriesArray, a.key, b.key);
                });
            }

            // Create a set of line data grouped by the aggregation field
            for (i = 0; i < lineData.length; i += 1) {
                // Sort the points so that lines are connected in the correct order
                lineData[i].data.sort(sortFunction);
                // If this should have colour gradients, add them
                if (graded) {
                    dimple._addGradient(lineData[i].key, "fill-line-gradient-" + lineData[i].keyString, (series.x._hasCategories() ? series.x : series.y), data, chart, duration, "fill");
                }
                // Get the points that this line will appear
                lineData[i].entry = entryCoords(lineData[i].data);
                // Get the actual points of the line
                lineData[i].update = updateCoords(lineData[i].data);
                // Get the actual points of the line
                lineData[i].exit = exitCoords(lineData[i].data);
                // Add the color in this loop, it can't be done during initialisation of the row becase
                // the lines should be ordered first (to ensure standard distribution of colors
                lineData[i].color = chart.getColor(lineData[i].key.length > 0 ? lineData[i].key[lineData[i].key.length - 1] : "All");
            }

            if (chart._tooltipGroup !== null && chart._tooltipGroup !== undefined) {
                chart._tooltipGroup.remove();
            }

            if (series.shapes === null || series.shapes === undefined) {
                theseShapes = chart._group.selectAll("." + className).data(lineData);
            } else {
                theseShapes = series.shapes.data(lineData, function (d) { return d.key; });
            }

            // Add
            theseShapes
                .enter()
                .append("path")
                .attr("id", function (d) { return d.key; })
                .attr("class", function (d) {
                    return className + " dmp-line " + d.keyString;
                })
                .attr("d", function (d) {
                    return d.entry;
                })
                .call(function () {
                    // Apply formats optionally
                    if (!chart.noFormats) {
                        this.attr("opacity", function (d) { return (graded ? 1 : d.color.opacity); })
                            .attr("fill", "none")
                            .attr("stroke", function (d) { return (graded ? "url(#fill-line-gradient-" + d.keyString + ")" : d.color.stroke); })
                            .attr("stroke-width", series.lineWeight);
                    }
                })
                .each(drawMarkerBacks)
                .each(drawMarkers);

            // Update
            updated = addTransition(theseShapes, duration)
                .attr("d", function (d) { return d.update; })
                .each(drawMarkerBacks)
                .each(drawMarkers);

            // Remove
            removed = addTransition(theseShapes.exit(), duration)
                .attr("d", function (d) { return d.exit; })
                .each(drawMarkerBacks)
                .each(drawMarkers);

            // Run after transition methods
            if (duration === 0) {
                updated.each(function (d, i) {
                    if (series.afterDraw !== null && series.afterDraw !== undefined) {
                        series.afterDraw(this, d, i);
                    }
                });
                removed.remove();
            } else {
                updated.each("end", function (d, i) {
                    if (series.afterDraw !== null && series.afterDraw !== undefined) {
                        series.afterDraw(this, d, i);
                    }
                });
                removed.each("end", function () {
                    d3.select(this).remove();
                });
            }

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
                            // Added 1px offset to cater for svg issue where a transparent
                            // group overlapping a line can sometimes hide it in some browsers
                            // Issue #10
                            .attr("y2", (cy < dropDest.y ? dropDest.y - 1 : dropDest.y + 1));
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
                            // Added 1px offset to cater for svg issue where a transparent
                            // group overlapping a line can sometimes hide it in some browsers
                            // Issue #10
                            .attr("x2", (cx < dropDest.x ? dropDest.x - 1 : dropDest.x + 1));
            }

            // Add a group for text
            t = chart._tooltipGroup.append("g");
            // Create a box for the popup in the text group
            box = t.append("rect")
                .attr("class", "dmp-tooltip");

            // Add the series categories
            if (series.categoryFields !== null && series.categoryFields !== undefined && series.categoryFields.length > 0) {
                series.categoryFields.forEach(function (c, i) {
                    if (c !== null && c !== undefined && e.aggField[i] !== null && e.aggField[i] !== undefined) {
                        // If the category name and value match don't display the category name
                        rows.push(c + (e.aggField[i] !== c ? ": " + e.aggField[i] : ""));
                    }
                }, this);
            }

            if (series.x._hasTimeField()) {
                if (e.xField[0] !== null && e.xField[0] !== undefined) {
                    rows.push(series.x.timeField + ": " + series.x._getFormat()(e.xField[0]));
                }
            } else if (series.x._hasCategories()) {
                // Add the x axis categories
                series.x.categoryFields.forEach(function (c, i) {
                    if (c !== null && c !== undefined && e.xField[i] !== null && e.xField[i] !== undefined) {
                        // If the category name and value match don't display the category name
                        rows.push(c + (e.xField[i] !== c ? ": " + e.xField[i] : ""));
                    }
                }, this);
            } else {
                // Add the axis measure value
                if (series.x.measure !== null && series.x.measure !== undefined && e.width !== null && e.width !== undefined) {
                    rows.push(series.x.measure + ": " + series.x._getFormat()(e.width));
                }
            }

            if (series.y._hasTimeField()) {
                if (e.yField[0] !== null && e.yField[0] !== undefined) {
                    rows.push(series.y.timeField + ": " + series.y._getFormat()(e.yField[0]));
                }
            } else if (series.y._hasCategories()) {
                // Add the y axis categories
                series.y.categoryFields.forEach(function (c, i) {
                    if (c !== null && c !== undefined && e.yField[i] !== null && e.yField[i] !== undefined) {
                        rows.push(c + (e.yField[i] !== c ? ": " + e.yField[i] : ""));
                    }
                }, this);
            } else {
                // Add the axis measure value
                if (series.y.measure !== null && series.y.measure !== undefined && e.height !== null && e.height !== undefined) {
                    rows.push(series.y.measure + ": " + series.y._getFormat()(e.height));
                }
            }

            if (series.z !== null && series.z !== undefined) {
                // Add the axis measure value
                if (series.z.measure !== null && series.z.measure !== undefined && e.zValue !== null && e.zValue !== undefined) {
                    rows.push(series.z.measure + ": " + series.z._getFormat()(e.zValue));
                }
            }

            if (series.c !== null && series.c !== undefined) {
                // Add the axis measure value
                if (series.c.measure !== null && series.c.measure !== undefined && e.cValue !== null && e.cValue !== undefined) {
                    rows.push(series.c.measure + ": " + series.c._getFormat()(e.cValue));
                }
            }

            // Get distinct text rows to deal with cases where 2 axes have the same dimensionality
            rows = rows.filter(function(elem, pos) {
                return rows.indexOf(elem) === pos;
            });

            // Create a text object for every row in the popup
            t.selectAll(".textHoverShapes").data(rows).enter()
                .append("text")
                    .attr("class", "dmp-tooltip")
                    .text(function (d) { return d; })
                    .style("font-family", "sans-serif")
                    .style("font-size", "10px");

            // Get the max height and width of the text items
            t.each(function () {
                w = (this.getBBox().width > w ? this.getBBox().width : w);
                h = (this.getBBox().width > h ? this.getBBox().height : h);
            });

            // Position the text relative to the bubble, the absolute positioning
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
            overlap = cx + r + textMargin + popupMargin + w > parseFloat(chart.svg.node().getBBox().width);

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

