    // Copyright: 2013 PMSI-AlignAlytics
    // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
    // Source: /src/objects/plot/bar.js
    dimple.plot.bar = {

        // By default the bar series is stacked if there are series categories
        stacked: true,

        // The axes which will affect the bar chart - not z
        supportedAxes: ["x", "y", "c"],

        // Draw the chart
        draw: function (chart, series, duration) {

            // Get self pointer for inner functions
            var self = this,
                // Get the series data
                chartData = series._positionData,
                // If the series is uninitialised create placeholders, otherwise use the existing shapes
                theseShapes = null,
                className = "series" + chart.series.indexOf(series);

            if (chart._tooltipGroup !== null && chart._tooltipGroup !== undefined) {
                chart._tooltipGroup.remove();
            }

            if (series.shapes === null || series.shapes === undefined) {
                theseShapes = chart._group.selectAll("." + className).data(chartData);
            } else {
                theseShapes = series.shapes.data(chartData, function (d) { return d.key; });
            }

            // Add
            theseShapes
                .enter()
                .append("rect")
                .attr("id", function (d) { return d.key; })
                .attr("class", function (d) { return className + " bar " + d.aggField.join(" ") + " " + d.xField.join(" ") + " " + d.yField.join(" "); })
                .attr("x", function (d) { return dimple._helpers.x(d, chart, series); })
                .attr("y", function (d) { return dimple._helpers.y(d, chart, series) + dimple._helpers.height(d, chart, series); })
                .attr("width", function (d) {return (d.xField !== null && d.xField.length > 0 ? dimple._helpers.width(d, chart, series) : 0); })
                .attr("height", function (d) {return (d.yField !== null && d.yField.length > 0 ? dimple._helpers.height(d, chart, series) : 0); })
                .attr("opacity", function (d) { return dimple._helpers.opacity(d, chart, series); })
                .on("mouseover", function (e) {
                    self.enterEventHandler(e, this, chart, series);
                })
                .on("mouseleave", function () {
                    self.leaveEventHandler(chart);
                })
                .call(function () {
                    if (!chart.noFormats) {
                        this.attr("fill", function (d) { return dimple._helpers.fill(d, chart, series); })
                            .attr("stroke", function (d) { return dimple._helpers.stroke(d, chart, series); });
                    }
                });

            // Update
            theseShapes
                .transition().duration(duration)
                .attr("x", function (d) { return dimple._helpers.x(d, chart, series); })
                .attr("y", function (d) { return dimple._helpers.y(d, chart, series); })
                .attr("width", function (d) { return dimple._helpers.width(d, chart, series); })
                .attr("height", function (d) { return dimple._helpers.height(d, chart, series); })
                .call(function () {
                    if (!chart.noFormats) {
                        this.attr("fill", function (d) { return dimple._helpers.fill(d, chart, series); })
                            .attr("stroke", function (d) { return dimple._helpers.stroke(d, chart, series); });
                    }
                });

            // Remove
            theseShapes
                .exit()
                .transition().duration(duration)
                .attr("x", function (d) { return dimple._helpers.x(d, chart, series); })
                .attr("y", function (d) { return dimple._helpers.y(d, chart, series); })
                .attr("width", function (d) { return dimple._helpers.width(d, chart, series); })
                .attr("height", function (d) { return dimple._helpers.height(d, chart, series); })
                .each("end", function () {
                    d3.select(this).remove();
                });

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
                x = parseFloat(selectedShape.attr("x")),
                y = parseFloat(selectedShape.attr("y")),
                width = parseFloat(selectedShape.attr("width")),
                height = parseFloat(selectedShape.attr("height")),
                opacity = selectedShape.attr("opacity"),
                fill = selectedShape.attr("fill"),
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
                t,
                box,
                rows = [],
                // The running y value for the text elements
                yRunning = 0,
                // The maximum bounds of the text elements
                w = 0,
                h = 0;

            if (chart._tooltipGroup !== null && chart._tooltipGroup !== undefined) {
                chart._tooltipGroup.remove();
            }
            chart._tooltipGroup = chart.svg.append("g");

            // Add a drop line to the x axis
            if (!series.x._hasCategories() && dropDest.y !== null) {
                chart._tooltipGroup.append("line")
                    .attr("x1", (x < series.x._origin ? x + 1 : x + width - 1))
                    .attr("y1", (y < dropDest.y ? y + height : y))
                    .attr("x2", (x < series.x._origin ? x + 1 : x + width - 1))
                    .attr("y2", (y < dropDest.y ? y + height : y))
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
                        .attr("y2", (y < dropDest.y ? dropDest.y - 1 : dropDest.y + 1));
            }

            // Add a drop line to the y axis
            if (!series.y._hasCategories() && dropDest.x !== null) {
                chart._tooltipGroup.append("line")
                    .attr("x1", (x < dropDest.x ? x + width : x))
                    .attr("y1", (y < series.y._origin ? y + 1 : y + height - 1))
                    .attr("x2", (x < dropDest.x ? x + width : x))
                    .attr("y2", (y < series.y._origin ? y + 1 : y + height - 1))
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
                        .attr("x2", (x < dropDest.x ? dropDest.x - 1 : dropDest.x + 1));
            }

            // Add a group for text
            t = chart._tooltipGroup.append("g");
            // Create a box for the popup in the text group
            box = t.append("rect");

            // Add the series categories
            if (series.categoryFields !== null && series.categoryFields !== undefined && series.categoryFields.length > 0) {
                series.categoryFields.forEach(function (c, i) {
                    // If the category name and value match don't display the category name
                    rows.push(c + (e.aggField[i] !== c ? ": " + e.aggField[i] : ""));
                }, this);
            }

            if (series.x._hasTimeField()) {
                rows.push(series.x.timeField + ": " + series.x._getFormat()(e.xField[0]));
            } else if (series.x._hasCategories()) {
                // Add the x axis categories
                series.x.categoryFields.forEach(function (c, i) {
                    // If the category name and value match don't display the category name
                    rows.push(c + (e.xField[i] !== c ? ": " + e.xField[i] : ""));
                }, this);
            } else {
                // Add the axis measure value
                rows.push(series.x.measure + ": " + series.x._getFormat()(e.width));
            }

            if (series.y._hasTimeField()) {
                rows.push(series.y.timeField + ": " + series.y._getFormat()(e.yField[0]));
            } else if (series.y._hasCategories()) {
                // Add the y axis categories
                series.y.categoryFields.forEach(function (c, i) {
                    rows.push(c + (e.yField[i] !== c ? ": " + e.yField[i] : ""));
                }, this);
            } else {
                // Add the axis measure value
                rows.push(series.y.measure + ": " + series.y._getFormat()(e.height));
            }

            if (series.c !== null && series.c !== undefined) {
                // Add the axis measure value
                rows.push(series.c.measure + ": " + series.c._getFormat()(series.c.showPercent ? e.cPct : e.cValue));
            }

            // Get distinct text rows to deal with cases where 2 axes have the same dimensionality
            rows = rows.filter(function(elem, pos) {
                return rows.indexOf(elem) === pos;
            });

            // Create a text object for every row in the popup
            t.selectAll(".textHoverShapes").data(rows).enter()
                .append("text")
                    .text(function (d) { return d; })
                    .style("font-family", "sans-serif")
                    .style("font-size", "10px");

            // Get the max height and width of the text items
            t.each(function () {
                w = (this.getBBox().width > w ? this.getBBox().width : w);
                h = (this.getBBox().width > h ? this.getBBox().height : h);
            });

            // Position the text relatve to the bubble, the absolute positioning
            // will be done by translating the group
            t.selectAll("text")
                .attr("x", 0)
                .attr("y", function () {
                    // Increment the y position
                    yRunning += this.getBBox().height;
                    // Position the text at the centre point
                    return yRunning - (this.getBBox().height / 2);
                });

            // Draw the box with a margin around the text
            box.attr("x", -textMargin)
                .attr("y", -textMargin)
                .attr("height", Math.floor(yRunning + textMargin) - 0.5)
                .attr("width", w + 2 * textMargin)
                .attr("rx", 5)
                .attr("ry", 5)
                .style("fill", popupFillColor)
                .style("stroke", popupStrokeColor)
                .style("stroke-width", 2)
                .style("opacity", 0.95);

            // Shift the popup around to avoid overlapping the svg edge
            if (x + width + textMargin + popupMargin + w < parseFloat(chart.svg.attr("width"))) {
                // Draw centre right
                t.attr("transform", "translate(" +
                    (x + width + textMargin + popupMargin) + " , " +
                    (y + (height / 2) - ((yRunning - (h - textMargin)) / 2)) +
                    ")");
            } else if (x - (textMargin + popupMargin + w) > 0) {
                // Draw centre left
                t.attr("transform", "translate(" +
                    (x - (textMargin + popupMargin + w)) + " , " +
                    (y + (height / 2) - ((yRunning - (h - textMargin)) / 2)) +
                    ")");
            } else if (y + height + yRunning + popupMargin + textMargin < parseFloat(chart.svg.attr("height"))) {
                // Draw centre below
                t.attr("transform", "translate(" +
                    (x + (width / 2) - (2 * textMargin + w) / 2) + " , " +
                    (y + height + 2 * textMargin) +
                    ")");
            } else {
                // Draw centre above
                t.attr("transform", "translate(" +
                    (x + (width / 2) - (2 * textMargin + w) / 2) + " , " +
                    (y - yRunning - (h - textMargin)) +
                    ")");
            }
        },

        // Handle the mouse leave event
        leaveEventHandler: function (chart) {
            if (chart._tooltipGroup !== null && chart._tooltipGroup !== undefined) {
                chart._tooltipGroup.remove();
            }
        }
    };

