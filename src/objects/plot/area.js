    // Copyright: 2014 PMSI-AlignAlytics
    // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
    // Source: /src/objects/plot/area.js
    dimple.plot.area = {

        // By default the values are stacked
        stacked: true,

        // The axis positions affecting the area series
        supportedAxes: ["x", "y", "c"],

        // Draw the axis
        draw: function (chart, series, duration) {
            // Get the position data
            var data = series._positionData,
                areaData = [],
                theseShapes = null,
                className = "dimple-series-" + chart.series.indexOf(series),
                firstAgg = (series.x._hasCategories() || series.y._hasCategories() ? 0 : 1),
                interpolation,
                graded = false,
                i,
                j,
                k,
                key,
                keyString,
                rowIndex,
                updated,
                removed,
                orderedSeriesArray,
                catPoints = {},
                allPoints = [],
                points,
                finalPointArray = [],
                basePoints,
                basePoint,
                cat,
                lastAngle,
                catCoord,
                valCoord,
                onEnter = function () {
                    return function (e, shape, chart, series) {
                        d3.select(shape).style("opacity", 1);
                        dimple._showPointTooltip(e, shape, chart, series);
                    };
                },
                onLeave = function (lineData) {
                    return function (e, shape, chart, series) {
                        d3.select(shape).style("opacity", (series.lineMarkers || lineData.data.length < 2 ? dimple._helpers.opacity(e, chart, series) : 0));
                        dimple._removeTooltip(e, shape, chart, series);
                    };
                },
                drawMarkers = function (d) {
                    dimple._drawMarkers(d, chart, series, duration, className, graded, onEnter(d), onLeave(d));
                },
                coord = function (position, datum) {
                    var val;
                    if (series.interpolation === "step" && series[position]._hasCategories()) {
                        series.barGap = 0;
                        series.clusterBarGap = 0;
                        val = dimple._helpers[position](datum, chart, series) + (position === "y" ? dimple._helpers.height(datum, chart, series) : 0);
                    } else {
                        val = dimple._helpers["c" + position](datum, chart, series);
                    }
                    // Remove long decimals from the coordinates as this fills the dom up with noise and makes matching below less likely to work.  It
                    // shouldn't really matter but positioning to < 0.1 pixel is pretty pointless anyway.
                    return parseFloat(val.toFixed(1));
                },
                getArea = function (inter, originProperty) {
                    return d3.svg.line()
                        .x(function (d) { return (series.x._hasCategories() || !originProperty ? d.x : series.x[originProperty]); })
                        .y(function (d) { return (series.y._hasCategories() || !originProperty ? d.y : series.y[originProperty]); })
                        .interpolate(inter);
                },
                sortByX = function (a, b) {
                    return parseFloat(a.x) - parseFloat(b.x);
                },
                addNextPoint = function (source, target, startAngle) {
                    // Given a point we need to find the next point clockwise from the start angle
                    var i,
                        point = target[target.length - 1],
                        thisAngle,
                        bestAngleSoFar = 9999,
                        returnPoint = point;
                    for (i = 0; i < source.length; i += 1) {
                        if (source[i].x !== point.x || source[i].y !== point.y) {
                            // get the angle in degrees since start angle
                            thisAngle = 180 - (Math.atan2(source[i].x - point.x, source[i].y - point.y) * (180 / Math.PI));
                            if (thisAngle > startAngle && thisAngle < bestAngleSoFar) {
                                returnPoint = source[i];
                                bestAngleSoFar = thisAngle;
                            }
                        }
                    }
                    target.push(returnPoint);
                    return bestAngleSoFar;
                };

            // Handle the special interpolation handling for step
            interpolation =  (series.interpolation === "step" ? "step-after" : series.interpolation);

            // Get the array of ordered values
            orderedSeriesArray = dimple._getSeriesOrder(series.data || chart.data, series);

            if (series.c && ((series.x._hasCategories() && series.y._hasMeasure()) || (series.y._hasCategories() && series.x._hasMeasure()))) {
                graded = true;
            }

            // If there is a coordinate with categories get it here so we don't have to keep checking
            if (series.x._hasCategories()) {
                catCoord = "x";
                valCoord = "y";
            } else if (series.y._hasCategories()) {
                catCoord = "y";
                valCoord = "x";
            }

            // Create a set of area data grouped by the aggregation field
            for (i = 0; i < data.length; i += 1) {
                key = [];
                rowIndex = -1;
                // Skip the first category unless there is a category axis on x or y
                for (k = firstAgg; k < data[i].aggField.length; k += 1) {
                    key.push(data[i].aggField[k]);
                }
                // Find the corresponding row in the areaData
                keyString = dimple._createClass(key);
                for (k = 0; k < areaData.length; k += 1) {
                    if (areaData[k].keyString === keyString) {
                        rowIndex = k;
                        break;
                    }
                }
                // Add a row to the area data if none was found
                if (rowIndex === -1) {
                    rowIndex = areaData.length;
                    areaData.push({
                        key: key,
                        keyString: keyString,
                        color: "white",
                        data: [],
                        points: [],
                        area: {},
                        entry: {},
                        exit: {}
                    });
                }
                // Add this row to the relevant data
                areaData[rowIndex].data.push(data[i]);
            }

            // Sort the area data itself based on the order series array - this matters for stacked areas and default color
            // consistency with colors usually awarded in terms of prominence
            if (orderedSeriesArray) {
                areaData.sort(function (a, b) {
                    return dimple._arrayIndexCompare(orderedSeriesArray, a.key, b.key);
                });
            }

            // Create a set of area data grouped by the aggregation field
            for (i = 0; i < areaData.length; i += 1) {
                // Sort the points so that areas are connected in the correct order
                areaData[i].data.sort(dimple._getSeriesSortPredicate(chart, series, orderedSeriesArray));
                // Get points here, this is so that as well as drawing the line with them, we can also
                // use them for the baseline
                for (j = 0; j < areaData[i].data.length; j += 1) {
                    areaData[i].points.push({
                        x: coord("x", areaData[i].data[j]),
                        y: coord("y", areaData[i].data[j])
                    });
                    // if there is a category axis, add the points to a distinct set.  Set these to use the origin value
                    // this will be updated with the last value in each case as we build the areas
                    if (catCoord) {
                        catPoints[areaData[i].points[areaData[i].points.length - 1][catCoord]] = series[valCoord]._previousOrigin;
                    }
                }
            }

            // catPoints needs to be lookup, but also accessed sequentially so we need to create an array of keys
            for (cat in catPoints) {
                if (catPoints.hasOwnProperty(cat)) {
                    allPoints.push(parseFloat(cat));
                }
            }
            // Sort the points as integers
            allPoints.sort(function (a, b) { return parseFloat(a) - parseFloat(b); });

            // Create the areas
            for (i = 0; i < areaData.length; i += 1) {
                points = areaData[i].points;
                basePoints = [];
                finalPointArray = [];
                // If this should have colour gradients, add them
                if (graded) {
                    dimple._addGradient(areaData[i].key, "fill-area-gradient-" + areaData[i].keyString, (series.x._hasCategories() ? series.x : series.y), data, chart, duration, "fill");
                }

                // All points will only be populated if there is a category axis
                if (allPoints && allPoints.length > 0) {
                    // Iterate the point array because we need to fill in zero points for missing ones, otherwise the areas
                    // will cross where an upper area has no value and a lower value has a spike Issue #7
                    for (j = 0, k = 0; j < allPoints.length; j += 1) {
                        // We are only interested in points between the first and last point of this areas data (i.e. don't fill ends - important
                        // for grouped area charts)
                        if (allPoints[j] >= points[0][catCoord] && allPoints[j] <= points[points.length - 1][catCoord]) {
                            // Get a base point, this needs to go on the base points array as well as filling in gaps in the point array.
                            // Create a point using the coordinate on the category axis and the last recorded value
                            // position from the dictionary
                            basePoint = {};
                            basePoint[catCoord] = allPoints[j];
                            basePoint[valCoord] = catPoints[allPoints[j]];
                            // add the base point
                            basePoints.push(basePoint);
                            // handle missing points
                            if (points[k][catCoord] > allPoints[j]) {
                                // If there is a missing point we need to in fill
                                finalPointArray.push(basePoint);
                            } else {
                                // They must be the same
                                finalPointArray.push(points[k]);
                                // Use this to update the dictionary to the new value coordinate
                                catPoints[allPoints[j]] = points[k][valCoord];
                                k += 1;
                            }
                        }
                    }
                } else {
                    // If there is no category axis we need to apply some custom logic.  In order to avoid
                    // really jagged areas the default behaviour will be to draw from the left most point then rotate a line
                    // clockwise until it hits another point and continue from each point until back to where we started.  This
                    // means it will not connect every point, but it will contain every point:
                    // E.g.
                    //                     D
                    //         C
                    //      A      B     E
                    //         F      G
                    //      H
                    //
                    // Would draw A -> C -> D -> E -> G -> H -> A
                    //
                    // This may not be what everyone wants so if there is a series order specified we will just join
                    // the points in that order instead.  This will not allow users to skip points and therefore not achieve
                    // the default behaviour explicitly.
                    if (series._orderRules && series._orderRules.length > 0) {
                        finalPointArray = points.concat(points[0]);
                    } else {
                        // Find the leftmost point
                        points = points.sort(sortByX);
                        finalPointArray.push(points[0]);
                        lastAngle = 0;
                        // Iterate until the first and last points match
                        do {
                            lastAngle = addNextPoint(points, finalPointArray, lastAngle);
                        } while (finalPointArray.length <= points.length && (finalPointArray[0].x !== finalPointArray[finalPointArray.length - 1].x || finalPointArray[0].y !== finalPointArray[finalPointArray.length - 1].y));
                    }
                }

                // The final array of points for the entire outskirts of the area
                finalPointArray = finalPointArray.concat(basePoints.reverse()).concat(finalPointArray[0]);

                // Get the points that this area will appear
                areaData[i].entry = getArea(interpolation, "_previousOrigin")(finalPointArray);
                areaData[i].update = getArea(interpolation)(finalPointArray);
                areaData[i].exit = getArea(interpolation, "_origin")(finalPointArray);

                // Add the color in this loop, it can't be done during initialisation of the row because
                // the areas should be ordered first (to ensure standard distribution of colors
                areaData[i].color = chart.getColor(areaData[i].key.length > 0 ? areaData[i].key[areaData[i].key.length - 1] : "All");

            }
//            // Create a set of area data grouped by the aggregation field
//            for (i = 0; i < areaData.length; i += 1) {
//
//                // Sort the points so that areas are connected in the correct order
//                areaData[i].data.sort(dimple._getSeriesSortPredicate(chart, series, orderedSeriesArray));
//
//                // If this should have colour gradients, add them
//                if (graded) {
//                    dimple._addGradient(areaData[i].key, "fill-area-gradient-" + areaData[i].keyString, (series.x._hasCategories() ? series.x : series.y), data, chart, duration, "fill");
//                }
//
//                // Clone the data before adding elements
//                dataClone = [].concat(areaData[i].data);
//
//                // If this is a custom dimple step area duplicate the last datum so that the final step is completed
//                if (series.interpolation === "step") {
//                    if (series.x._hasCategories()) {
//                        // Clone the last row and duplicate it.
//                        dataClone = dataClone.concat(JSON.parse(JSON.stringify(dataClone[dataClone.length - 1])));
//                        dataClone[dataClone.length - 1].cx = "";
//                        dataClone[dataClone.length - 1].x = "";
//                    }
//                    if (series.y._hasCategories()) {
//                        // Clone the last row and duplicate it.
//                        dataClone = [JSON.parse(JSON.stringify(dataClone[0]))].concat(dataClone);
//                        dataClone[0].cy = "";
//                        dataClone[0].y = "";
//                    }
//                }
//
//                // Add zero baseline for this row
//                if (series.x._hasCategories() && series.y._hasMeasure()) {
//                    for (j = dataClone.length - 1; j >= 0; j -= 1) {
//                        areaData[i].baseData.push({
//                            x : dataClone[j].x,
//                            cx : dataClone[j].cx,
//                            xOffset : dataClone[j].xOffset,
//                            width : dataClone[j].width,
//                            y: (i === 0 ? 0 : areaData[i - 1].data[j].y),
//                            cy : (i === 0 ? 0 : areaData[i - 1].data[j].cy),
//                            yOffset: (i === 0 ? 0 : areaData[i - 1].data[j].yOffset),
//                            height: (i === 0 ? 0 : areaData[i - 1].data[j].height)
//                        });
//                    }
//                } else if (series.y._hasCategories() && series.x._hasMeasure()) {
//                    for (j = dataClone.length - 1; j >= 0; j -= 1) {
//                        areaData[i].baseData.push({
//                            x : (i === 0 ? 0 : areaData[i - 1].data[j].x),
//                            cx : (i === 0 ? 0 : areaData[i - 1].data[j].cx),
//                            xOffset : (i === 0 ? 0 : areaData[i - 1].data[j].xOffset),
//                            width : (i === 0 ? 0 : areaData[i - 1].data[j].width),
//                            y: dataClone[j].y,
//                            cy : dataClone[j].cy,
//                            yOffset: dataClone[j].yOffset,
//                            height: dataClone[j].height
//                        });
//                    }
//                }
//
//                // Get the points that this area will appear
//                areaData[i].entry = getArea(interpolation, "_previousOrigin")(areaData[i].baseData.concat(dataClone));
//                areaData[i].update = getArea(interpolation)(areaData[i].baseData.concat(dataClone));
//                areaData[i].exit = getArea(interpolation, "_origin")(areaData[i].baseData.concat(dataClone));
//
//                // Add the color in this loop, it can't be done during initialisation of the row because
//                // the areas should be ordered first (to ensure standard distribution of colors
//                areaData[i].color = chart.getColor(areaData[i].key.length > 0 ? areaData[i].key[areaData[i].key.length - 1] : "All");
//
//            }

            if (chart._tooltipGroup !== null && chart._tooltipGroup !== undefined) {
                chart._tooltipGroup.remove();
            }

            if (series.shapes === null || series.shapes === undefined) {
                theseShapes = chart._group.selectAll("." + className).data(areaData);
            } else {
                theseShapes = series.shapes.data(areaData, function (d) { return d.key; });
            }

            // Add
            theseShapes
                .enter()
                .append("path")
                .attr("id", function (d) { return d.key; })
                .attr("class", function (d) {
                    return className + " dimple-line " + d.keyString;
                })
                .attr("d", function (d) {
                    return d.entry;
                })
                .call(function () {
                    // Apply formats optionally
                    if (!chart.noFormats) {
                        this.attr("opacity", function (d) { return (graded ? 1 : d.color.opacity); })
                            .attr("fill", function (d) { return (graded ? "url(#fill-line-gradient-" + d.keyString + ")" : d.color.fill); })
                            .attr("stroke", function (d) { return (graded ? "url(#stroke-line-gradient-" + d.keyString + ")" : d.color.stroke); })
                            .attr("stroke-width", series.lineWeight);
                    }
                })
                .each(drawMarkers);

            // Update
            updated = dimple._handleTransition(theseShapes, duration)
                .attr("d", function (d) { return d.update; })
                .each(drawMarkers);

            // Remove
            removed = dimple._handleTransition(theseShapes.exit(), duration)
                .attr("d", function (d) { return d.exit; })
                .each(drawMarkers);

            dimple._postDrawHandling(series, updated, removed, duration);

            // Save the shapes to the series array
            series.shapes = theseShapes;

        }
    };

