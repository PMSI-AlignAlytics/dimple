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
                    var data = series.data || this.data || [],
                        cats = [].concat(series.categoryFields),
                        returnData = this._getData(data, cats, series.aggregate, series._orderRules, series._isStacked(),
                            series.x, series.y, series.z, series.p, series.c),
                        higherLevelData = [],
                        i,
                        j,
                        aCats,
                        aCatString,
                        bCats,
                        bCatString;

                    // If there is a pie axis we need to run a second dataset because the x and y will be
                    // at a higher level of aggregation than the rows, we want all the segments for a pie chart to
                    // have the same x and y values
                    if (series.x && series.y && series.p && cats.length > 0)
                    {
                        cats.pop();
                        higherLevelData = this._getData(data, ["__dimple_placeholder__"].concat(cats), series.aggregate, series._orderRules, series._isStacked(),
                            series.x, series.y, series.z, null, series.c);
                        for (i = 0; i < returnData.length; i += 1) {
                            aCats = ["__dimple_placeholder__"].concat(returnData[i].aggField);
                            aCats.pop();
                            if (series.x && series.x._hasCategories()) {
                                aCats = aCats.concat(returnData[i].xField);
                            }
                            if (series.y && series.y._hasCategories()) {
                                aCats = aCats.concat(returnData[i].yField);
                            }
                            aCatString = aCats.join("|");
                            inner: for (j = 0; j < higherLevelData.length; j += 1) {
                                bCats = [].concat(higherLevelData[j].aggField);
                                if (series.x && series.x._hasCategories()) {
                                    bCats = bCats.concat(higherLevelData[j].xField);
                                }
                                if (series.y && series.y._hasCategories()) {
                                    bCats = bCats.concat(higherLevelData[j].yField);
                                }
                                bCatString = bCats.join("|");
                                if (aCatString === bCatString) {
                                    returnData[i].xField = higherLevelData[j].xField;
                                    returnData[i].xValue = higherLevelData[j].xValue;
                                    returnData[i].xCount = higherLevelData[j].xCount;
                                    returnData[i].yField = higherLevelData[j].yField;
                                    returnData[i].yValue = higherLevelData[j].yValue;
                                    returnData[i].yCount = higherLevelData[j].yCount;
                                    returnData[i].zField = higherLevelData[j].zField;
                                    returnData[i].zValue = higherLevelData[j].zValue;
                                    returnData[i].zCount = higherLevelData[j].zCount;
                                    returnData[i].x = higherLevelData[j].x;
                                    returnData[i].y = higherLevelData[j].y;
                                    returnData[i].xOffset = higherLevelData[j].xOffset;
                                    returnData[i].yOffset = higherLevelData[j].yOffset;
                                    returnData[i].width = higherLevelData[j].width;
                                    returnData[i].height = higherLevelData[j].height;
                                    returnData[i].cx = higherLevelData[j].cx;
                                    returnData[i].cy = higherLevelData[j].cy;
                                    returnData[i].xBound = higherLevelData[j].xBound;
                                    returnData[i].yBound = higherLevelData[j].yBound;
                                    returnData[i].xValueList = higherLevelData[j].xValueList;
                                    returnData[i].yValueList = higherLevelData[j].yValueList;
                                    returnData[i].zValueList = higherLevelData[j].zValueList;
                                    returnData[i].cValueList = higherLevelData[j].cValueList;
                                    break inner;
                                }
                            }
                        }
                    }

                    // populate the data in the series
                    series._positionData = returnData;

                }, this);
            }
        };

