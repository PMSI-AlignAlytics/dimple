        // Copyright: 2013 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/chart/methods/_getSeriesData.js
        // Create a dataset containing positioning information for every series
        this._getSeriesData = function () {
            // If there are series
            if (this.series !== null && this.series !== undefined) {
                // Iterate all the series
                this.series.forEach(function (series) {
                    // The data for this series
                    var returnData = [],
                        // Handle multiple category values by iterating the fields in the row and concatonate the values
                        // This is repeated for each axis using a small anon function
                        getField = function (axis, row) {
                            var returnField = [];
                            if (axis !== null && axis._hasCategories()) {
                                axis.categoryFields.forEach(function (cat) {
                                    returnField.push(row[cat]);
                                }, this);
                            }
                            return returnField;
                        },
                        // Catch a non-numeric value and re-calc as count
                        useCount = { x: false, y: false, z: false, c: false },
                        // If the elements are grouped a unique list of secondary category values will be required
                        secondaryElements = { x: [], y: [] },
                        // Get the x and y totals for percentages.  This cannot be done in the loop above as we need the data aggregated before we get an abs total.
                        // otherwise it will wrongly account for negatives and positives rolled together.
                        totals = { x: [], y: [], z: [] },
                        colorBounds = { min: null, max: null },
                        tot,
                        running = { x: [], y: [], z: [] },
                        addedCats = [],
                        catTotals = {},
                        grandTotals = { x: 0, y: 0, z: 0 },
                        key;
                    // Iterate every row in the data to calculate the return values
                    this.data.forEach(function (d) {
                        // Reset the index
                        var foundIndex = -1,
                            xField = getField(series.x, d),
                            yField = getField(series.y, d),
                            zField = getField(series.z, d),
                            // Get the aggregate field using the other fields if necessary
                            aggField = [],
                            key,
                            k,
                            newRow,
                            updateData;
                        if (series.categoryFields === null || series.categoryFields === undefined || series.categoryFields.length === 0) {
                            aggField = ["All"];
                        } else if (series.categoryFields.length === 1 && d[series.categoryFields[0]] === undefined) {
                            aggField = [series.categoryFields[0]];
                        } else {
                            series.categoryFields.forEach(function (cat) {
                                aggField.push(d[cat]);
                            }, this);
                        }
                        // Add a key
                        key = aggField.join("/") + "_" + xField.join("/") + "_" + yField.join("/") + "_" + zField.join("/");
                        // See if this field has already been added. 
                        for (k = 0; k < returnData.length; k += 1) {
                            if (returnData[k].key === key) {
                                foundIndex = k;
                                break;
                            }
                        }
                        // If the field was not added, do so here
                        if (foundIndex === -1) {
                            newRow = {
                                key: key,
                                aggField: aggField,
                                xField: xField,
                                xValue: null,
                                xCount: 0,
                                yField: yField,
                                yValue: null,
                                yCount: 0,
                                zField: zField,
                                zValue: null,
                                zCount: 0,
                                cValue: 0,
                                cCount: 0,
                                x: 0,
                                y: 0,
                                xOffset: 0,
                                yOffset: 0,
                                width: 0,
                                height: 0,
                                cx: 0,
                                cy: 0,
                                xBound: 0,
                                yBound: 0,
                                xValueList: [],
                                yValueList: [],
                                zValueList: [],
                                cValueList: [],
                                fill: {},
                                stroke: {}
                            };
                            returnData.push(newRow);
                            foundIndex = returnData.length - 1;
                        }
                        // Update the return data for the passed axis
                        updateData = function (axis, storyboard) {
                            var passStoryCheck = true,
                                lhs = { value: 0, count: 1 },
                                rhs = { value: 0, count: 1 },
                                selectStoryValue,
                                compare = "",
                                retRow;
                            if (storyboard !== null) {
                                selectStoryValue = storyboard.getFrameValue();
                                storyboard.categoryFields.forEach(function (cat, m) {
                                    if (m > 0) {
                                        compare += "/";
                                    }
                                    compare += d[cat];
                                    passStoryCheck = (compare === selectStoryValue);
                                }, this);
                            }
                            if (axis !== null && axis !== undefined && axis.measure !== null && axis.measure !== undefined) {
                                if (passStoryCheck) {
                                    retRow = returnData[foundIndex];
                                    // Keep a distinct list of values to calculate a distinct count in the case of a non-numeric value being found
                                    if (retRow[axis.position + "ValueList"].indexOf(d[axis.measure]) === -1) {
                                        retRow[axis.position + "ValueList"].push(d[axis.measure]);
                                    }
                                    // The code above is outside this check for non-numeric values because we might encounter one far down the list, and
                                    // want to have a record of all values so far.
                                    if (isNaN(parseFloat(d[axis.measure]))) {
                                        useCount[axis.position] = true;
                                    }
                                    // Set the value using the aggregate function method
                                    lhs.value = retRow[axis.position + "Value"];
                                    lhs.count = retRow[axis.position + "Count"];
                                    rhs.value = d[axis.measure];
                                    retRow[axis.position + "Value"] = series.aggregate(lhs, rhs);
                                    retRow[axis.position + "Count"] += 1;
                                }
                            }
                            // Get secondary elements if necessary
                            if (axis !== null && axis !== undefined && axis._hasCategories() && axis.categoryFields.length > 1 && secondaryElements[axis.position] !== undefined) {
                                if (secondaryElements[axis.position].indexOf(d[axis.categoryFields[1]]) === -1) {
                                    secondaryElements[axis.position].push(d[axis.categoryFields[1]]);
                                }
                            }
                        };
                        // Update all the axes
                        updateData(series.x, this.storyboard);
                        updateData(series.y, this.storyboard);
                        updateData(series.z, this.storyboard);
                        updateData(series.c, this.storyboard);
                    }, this);
                    returnData.forEach(function (ret) {
                        if (series.x !== null) {
                            if (useCount.x === true) { ret.xValue = ret.xValueList.length; }
                            tot = (totals.x[ret.xField.join("/")] === null || totals.x[ret.xField.join("/")] === undefined ? 0 : totals.x[ret.xField.join("/")]) + (series.y._hasMeasure() ? Math.abs(ret.yValue) : 0);
                            totals.x[ret.xField.join("/")] = tot;
                        }
                        if (series.y !== null) {
                            if (useCount.y === true) { ret.yValue = ret.yValueList.length; }
                            tot = (totals.y[ret.yField.join("/")] === null || totals.y[ret.yField.join("/")] === undefined ? 0 : totals.y[ret.yField.join("/")]) + (series.x._hasMeasure() ? Math.abs(ret.xValue) : 0);
                            totals.y[ret.yField.join("/")] = tot;
                        }
                        if (series.z !== null) {
                            if (useCount.z === true) { ret.zValue = ret.zValueList.length; }
                            tot = (totals.z[ret.zField.join("/")] === null || totals.z[ret.zField.join("/")] === undefined ? 0 : totals.z[ret.zField.join("/")]) + (series.z._hasMeasure() ? Math.abs(ret.zValue) : 0);
                            totals.z[ret.zField.join("/")] = tot;
                        }
                        if (series.c !== null) {
                            if (colorBounds.min === null || ret.cValue < colorBounds.min) { colorBounds.min = ret.cValue; }
                            if (colorBounds.max === null || ret.cValue > colorBounds.max) { colorBounds.max = ret.cValue; }
                        }
                    }, this);
                    // Before calculating the positions we need to sort elements
                    // EXTEND THIS TO BE MORE USER FLEXIBLE
                    returnData.sort(function (a, b) {
                        var returnVal = 0;
                        if (a.aggField !== b.aggField) {
                            returnVal = (a.aggField.join("/") < b.aggField.join("/") ? -1 : 1);
                        } else if (a.xField !== b.xField) {
                            returnVal = (a.xField.join("/") < b.xField.join("/") ? -1 : 1);
                        } else if (a.yField !== b.yField) {
                            returnVal = (a.yField.join("/") < b.yField.join("/") ? -1 : 1);
                        } else if (a.zField !== b.zField) {
                            returnVal = (a.zField.join("/") < b.zField.join("/") ? -1 : 1);
                        }
                        return returnVal;
                    });
                    // Set all the dimension properties of the data
                    for (key in totals.x) { if (totals.x.hasOwnProperty(key)) { grandTotals.x += totals.x[key]; } }
                    for (key in totals.y) { if (totals.y.hasOwnProperty(key)) { grandTotals.y += totals.y[key]; } }
                    for (key in totals.z) { if (totals.z.hasOwnProperty(key)) { grandTotals.z += totals.z[key]; } }

                    returnData.forEach(function (ret) {
                        var baseColor,
                            targetColor,
                            scale,
                            colorVal,
                            floatingPortion,
                            getAxisData = function (axis, opp, size) {
                                var totalField,
                                    value,
                                    selectValue,
                                    pos,
                                    cumValue;
                                if (axis !== null && axis !== undefined) {
                                    pos = axis.position;
                                    if (!axis._hasCategories()) {
                                        value = (axis.showPercent ? ret[pos + "Value"] / totals[opp][ret[opp + "Field"].join("/")] : ret[pos + "Value"]);
                                        totalField = ret[opp + "Field"].join("/") + (ret[pos + "Value"] >= 0);
                                        cumValue = running[pos][totalField] = ((running[pos][totalField] === null || running[pos][totalField] === undefined || pos === "z") ? 0 : running[pos][totalField]) + value;
                                        selectValue = ret[pos + "Bound"] = ret["c" + pos] = (((pos === "x" || pos === "y") && series.stacked) ? cumValue : value);
                                        ret[size] = value;
                                        ret[pos] = selectValue - (((pos === "x" && value >= 0) || (pos === "y" && value <= 0)) ? value : 0);
                                    } else {
                                        if (axis._hasMeasure()) {
                                            totalField = ret[axis.position + "Field"].join("/");
                                            value = (axis.showPercent ? totals[axis.position][totalField] / grandTotals[axis.position] : totals[axis.position][totalField]);
                                            if (addedCats.indexOf(totalField) === -1) {
                                                catTotals[totalField] = value + (addedCats.length > 0 ? catTotals[addedCats[addedCats.length - 1]] : 0);
                                                addedCats.push(totalField);
                                            }
                                            selectValue = ret[pos + "Bound"] = ret["c" + pos] = (((pos === "x" || pos === "y") && series.stacked) ? catTotals[totalField] : value);
                                            ret[size] = value;
                                            ret[pos] = selectValue - (((pos === "x" && value >= 0) || (pos === "y" && value <= 0)) ? value : 0);
                                        } else {
                                            ret[pos] = ret["c" + pos] = ret[pos + "Field"][0];
                                            ret[size] = 1;
                                            if (secondaryElements[pos] !== undefined && secondaryElements[pos] !== null && secondaryElements[pos].length >= 2) {
                                                ret[pos + "Offset"] = secondaryElements[pos].indexOf(ret[pos + "Field"][1]);
                                                ret[size] = 1 / secondaryElements[pos].length;
                                            }
                                        }
                                    }
                                }
                            };
                        getAxisData(series.x, "y", "width");
                        getAxisData(series.y, "x", "height");
                        getAxisData(series.z, "z", "r");

                        // If there is a color axis
                        if (series.c !== null && colorBounds.min !== colorBounds.max) {
                            // Limit the bounds of the color value to be within the range.  Users may override the axis bounds and this
                            // allows a 2 color scale rather than blending if the min and max are set to 0 and 0.01 for example negative values
                            // and zero value would be 1 color and positive another.
                            ret.cValue = (ret.cValue > colorBounds.max ? colorBounds.max : (ret.cValue < colorBounds.min ? colorBounds.min : ret.cValue));
                            // Calculate the factors for the calculations
                            scale = d3.scale.linear().range([0, (series.c.colors === null || series.c.colors.length === 1 ? 1 : series.c.colors.length - 1)]).domain([colorBounds.min, colorBounds.max]);
                            colorVal = scale(ret.cValue);
                            floatingPortion = colorVal - Math.floor(colorVal);
                            // If there is a single color defined
                            if (series.c.colors !== null && series.c.colors !== undefined && series.c.colors.length === 1) {
                                baseColor = d3.rgb(series.c.colors[0]);
                                targetColor = d3.rgb(this.getColor(ret.aggField.slice(-1)[0]).fill);
                            } else if (series.c.colors !== null && series.c.colors !== undefined && series.c.colors.length > 1) {
                                baseColor = d3.rgb(series.c.colors[Math.floor(colorVal)]);
                                targetColor = d3.rgb(series.c.colors[Math.ceil(colorVal)]);
                            } else {
                                baseColor = d3.rgb("white");
                                targetColor = d3.rgb(this.getColor(ret.aggField.slice(-1)[0]).fill);
                            }
                            // Calculate the correct grade of color
                            baseColor.r = Math.floor(baseColor.r + (targetColor.r - baseColor.r) * floatingPortion);
                            baseColor.g = Math.floor(baseColor.g + (targetColor.g - baseColor.g) * floatingPortion);
                            baseColor.b = Math.floor(baseColor.b + (targetColor.b - baseColor.b) * floatingPortion);
                            // Set the colors on the row
                            ret.fill = baseColor.toString();
                            ret.stroke = baseColor.darker(0.5).toString();
                        }

                    }, this);

                    // populate the data in the series
                    series._positionData = returnData;

                }, this);
            }
        };

