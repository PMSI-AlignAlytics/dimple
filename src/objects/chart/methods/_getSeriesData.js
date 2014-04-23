        // Copyright: 2014 PMSI-AlignAlytics
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
                        // Handle multiple category values by iterating the fields in the row and concatenate the values
                        // This is repeated for each axis using a small anon function
                        getField = function (axis, row) {
                            var returnField = [];
                            if (axis !== null) {
                                if (axis._hasTimeField()) {
                                    returnField.push(axis._parseDate(row[axis.timeField]));
                                } else if (axis._hasCategories()) {
                                    axis.categoryFields.forEach(function (cat) {
                                        returnField.push(row[cat]);
                                    }, this);
                                }
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
                        key,
                        storyCat = "",
                        orderedStoryboardArray = [],
                        seriesCat = [],
                        orderedSeriesArray = [],
                        xCat = "",
                        xSortArray = [],
                        yCat = "",
                        ySortArray = [],
                        rules = [],
                        sortedData = series.data || this.data || [],
                        groupRules = [];

                    if (this.storyboard !== null && this.storyboard !== undefined && this.storyboard.categoryFields.length > 0) {
                        storyCat = this.storyboard.categoryFields[0];
                        orderedStoryboardArray = dimple._getOrderedList(sortedData, storyCat, this.storyboard._orderRules);
                    }

                    // Deal with mekkos
                    if (series.x._hasCategories() && series.x._hasMeasure()) {
                        xCat = series.x.categoryFields[0];
                        xSortArray = dimple._getOrderedList(sortedData, xCat, series.x._orderRules.concat([{ ordering : series.x.measure, desc : true }]));
                    }
                    if (series.y._hasCategories() && series.y._hasMeasure()) {
                        yCat = series.y.categoryFields[0];
                        ySortArray = dimple._getOrderedList(sortedData, yCat, series.y._orderRules.concat([{ ordering : series.y.measure, desc : true }]));
                    }

                    if (sortedData.length > 0 && series.categoryFields !== null && series.categoryFields !== undefined && series.categoryFields.length > 0) {
                        // Concat is used here to break the reference to the parent array, if we don't do this, in a storyboarded chart,
                        // the series rules to grow and grow until the system grinds to a halt trying to deal with them all.
                        rules = [].concat(series._orderRules);
                        seriesCat = [];
                        series.categoryFields.forEach(function (cat) {
                            if (sortedData[0][cat] !== undefined) {
                                seriesCat.push(cat);
                            }
                        }, this);
                        if (series.c !== null && series.c !== undefined && series.c._hasMeasure()) {
                            rules.push({ ordering : series.c.measure, desc : true });
                        } else if (series.z !== null && series.z !== undefined && series.z._hasMeasure()) {
                            rules.push({ ordering : series.z.measure, desc : true });
                        } else if (series.x._hasMeasure()) {
                            rules.push({ ordering : series.x.measure, desc : true });
                        } else if (series.y._hasMeasure()) {
                            rules.push({ ordering : series.y.measure, desc : true });
                        }
                        orderedSeriesArray = dimple._getOrderedList(sortedData, seriesCat, rules);
                    }

                    sortedData.sort(function (a, b) {
                        var returnValue = 0,
                            cats,
                            comp,
                            p,
                            q,
                            aMatch,
                            bMatch;
                        if (storyCat !== "") {
                            returnValue = orderedStoryboardArray.indexOf(a[storyCat]) - orderedStoryboardArray.indexOf(b[storyCat]);
                        }
                        if (xCat !== "" && returnValue === 0) {
                            returnValue = xSortArray.indexOf(a[xCat]) - xSortArray.indexOf(b[xCat]);
                        }
                        if (yCat !== "" && returnValue === 0) {
                            returnValue = ySortArray.indexOf(a[yCat]) - ySortArray.indexOf(b[yCat]);
                        }
                        if (seriesCat && seriesCat.length > 0 && returnValue === 0) {
                            cats = [].concat(seriesCat);
                            returnValue = 0;
                            for (p = 0; p < orderedSeriesArray.length; p += 1) {
                                comp = [].concat(orderedSeriesArray[p]);
                                aMatch = true;
                                bMatch = true;
                                for (q = 0; q < cats.length; q += 1) {
                                    aMatch = aMatch && (a[cats[q]] === comp[q]);
                                    bMatch = bMatch && (b[cats[q]] === comp[q]);
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
                        }
                        return returnValue;
                    });

                    // Iterate every row in the data to calculate the return values
                    sortedData.forEach(function (d) {
                        // Reset the index
                        var foundIndex = -1,
                            xField = getField(series.x, d),
                            yField = getField(series.y, d),
                            zField = getField(series.z, d),
                            // Get the aggregate field using the other fields if necessary
                            aggField = [],
                            key,
                            k,
                            i,
                            newRow,
                            updateData;

                        if (series.categoryFields === null || series.categoryFields === undefined || series.categoryFields.length === 0) {
                            aggField = ["All"];
                        } else {
                            // Iterate the category fields
                            for (i = 0; i < series.categoryFields.length; i += 1) {
                                // Either add the value of the field or the name itself.  This allows users to add custom values, for example
                                // Setting a particular color for a set of values can be done by using a non-existent final value and then coloring
                                // by it
                                if (d[series.categoryFields[i]] === undefined) {
                                    aggField.push(series.categoryFields[i]);
                                } else {
                                    aggField.push(d[series.categoryFields[i]]);
                                }
                            }
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
                            if (axis !== null && axis !== undefined) {
                                if (passStoryCheck) {
                                    retRow = returnData[foundIndex];
                                    if (axis._hasMeasure() && d[axis.measure] !== null && d[axis.measure] !== undefined) {
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
                            }
                        };
                        // Update all the axes
                        updateData(series.x, this.storyboard);
                        updateData(series.y, this.storyboard);
                        updateData(series.z, this.storyboard);
                        updateData(series.c, this.storyboard);
                    }, this);
                    // Get secondary elements if necessary
                    if (series.x !== null && series.x !== undefined && series.x._hasCategories() && series.x.categoryFields.length > 1 && secondaryElements.x !== undefined) {
                        groupRules = [];
                        if (series.y._hasMeasure()) {
                            groupRules.push({ ordering : series.y.measure, desc : true });
                        }
                        secondaryElements.x = dimple._getOrderedList(sortedData, series.x.categoryFields[1], series.x._groupOrderRules.concat(groupRules));
                    }
                    if (series.y !== null && series.y !== undefined && series.y._hasCategories() && series.y.categoryFields.length > 1 && secondaryElements.y !== undefined) {
                        groupRules = [];
                        if (series.x._hasMeasure()) {
                            groupRules.push({ ordering : series.x.measure, desc : true });
                        }
                        secondaryElements.y = dimple._getOrderedList(sortedData, series.y.categoryFields[1], series.y._groupOrderRules.concat(groupRules));
                        secondaryElements.y.reverse();
                    }
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
                                        selectValue = ret[pos + "Bound"] = ret["c" + pos] = (((pos === "x" || pos === "y") && series._isStacked()) ? cumValue : value);
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
                                            selectValue = ret[pos + "Bound"] = ret["c" + pos] = (((pos === "x" || pos === "y") && series._isStacked()) ? catTotals[totalField] : value);
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
                        if (series.c !== null && colorBounds.min !== null && colorBounds.max !== null) {
                            // Handle matching min and max
                            if (colorBounds.min === colorBounds.max) {
                                colorBounds.min -= 0.5;
                                colorBounds.max += 0.5;
                            }
                            // Limit the bounds of the color value to be within the range.  Users may override the axis bounds and this
                            // allows a 2 color scale rather than blending if the min and max are set to 0 and 0.01 for example negative values
                            // and zero value would be 1 color and positive another.
                            colorBounds.min = (series.c.overrideMin !== null && series.c.overrideMin !== undefined ? series.c.overrideMin : colorBounds.min);
                            colorBounds.max = (series.c.overrideMax !== null && series.c.overrideMax !== undefined ? series.c.overrideMax : colorBounds.max);
                            ret.cValue = (ret.cValue > colorBounds.max ? colorBounds.max : (ret.cValue < colorBounds.min ? colorBounds.min : ret.cValue));
                            // Calculate the factors for the calculations
                            scale = d3.scale.linear().range([0, (series.c.colors === null || series.c.colors.length === 1 ? 1 : series.c.colors.length - 1)]).domain([colorBounds.min, colorBounds.max]);
                            colorVal = scale(ret.cValue);
                            floatingPortion = colorVal - Math.floor(colorVal);
                            if (ret.cValue === colorBounds.max) {
                                floatingPortion = 1;
                            }
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

