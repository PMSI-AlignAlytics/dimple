// Copyright: 2013 PMSI-AlignAlytics
// License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
// Source: /src/objects/plot/bubble.js
dimple.plot.bubble = {
    
    // By default the bubble values are not stacked
    stacked: false,
    
    // The axis positions affecting the bubble series
    supportedAxes: ["x", "y", "z", "c"],
    
    // Draw the axis
    draw: function (chart, series, duration) {
        
        // Get self pointer for inner functions
        var self = this;
        
        // Clear any hover gubbins before redrawing so the hover markers aren't left behind
        chart.svg.selectAll(".hoverShapes")
            .transition()
            .duration(duration / 4)
            .style("opacity", 0)
            .remove();
        
        // Get the series data
        var chartData = series._positionData;
        
        // If the series is uninitialised create placeholders, otherwise use the existing shapes
        var theseShapes = null;
        var className = "series" + chart.series.indexOf(series);
        if (series.shapes == null || series.shapes == undefined) {
            theseShapes = chart.svg.selectAll("." + className).data(chartData);}
        else {
            theseShapes = series.shapes.data(chartData, function (d) { return d.key; });
        }
        
        // Add
        theseShapes
            .enter()
            .append("circle")
            .attr("id", function (d) { return d.key; })
            .attr("class", function (d) { return className + " bubble " + d.aggField.join(" ") + " " + d.xField.join(" ") + " " + d.yField.join(" ") + " " + d.zField.join(" "); })
            .attr("cx", function (d) { return series.x._previousOrigin; })
            .attr("cy", function (d) { return series.y._previousOrigin; })
            .attr("r", 0 )
            .attr("opacity", function (d) { return _helpers.opacity(d, chart, series); })
            .on("mouseover", function (e) {
                self.enterEventHandler(e, this, chart, series, duration)
            })
            .on("mouseleave", function (e) {
                self.leaveEventHandler(e, this, chart, series, duration)
            })
            .call(function () {
                if (!chart.noFormats) {
                    this.attr("fill", function (d) { return _helpers.fill(d, chart, series); })
                        .attr("stroke", function (d) { return _helpers.stroke(d, chart, series); });    
                }    
            });
            
        // Update
        theseShapes
            .transition().duration(duration)
            .attr("cx", function (d) { return _helpers.cx(d, chart, series); })
            .attr("cy", function (d) { return _helpers.cy(d, chart, series); })
            .attr("r", function (d) { return _helpers.r(d, chart, series); })
            .call(function () {
                if (!chart.noFormats) {
                    this.attr("fill", function (d) { return _helpers.fill(d, chart, series); })
                        .attr("stroke", function (d) { return _helpers.stroke(d, chart, series); });    
                }    
            });
            
        // Remove
        theseShapes
            .exit()
            .transition().duration(duration)
            .attr("r", 0)
            .attr("cx", function (d) { return series.x._origin; })
            .attr("cy", function (d) { return series.y._origin; })
            .each("end", function () {
                d3.select(this).remove();    
            })
            
        // Save the shapes to the series array
        series.shapes = theseShapes;
    },
        
    // Handle the mouse enter event
    enterEventHandler: function (e, shape, chart, series, duration) {
      
        // The margin between the text and the box
        var textMargin = 5;
        // The margin between the ring and the popup
        var popupMargin = 10;
        // The popup animation duration in ms
        var animDuration = 750;
        
        // Collect some facts about the highlighted bubble
        var svg = chart.svg;
        var selectedShape = d3.select(shape);
        var cx = parseFloat(selectedShape.attr("cx"));
        var cy = parseFloat(selectedShape.attr("cy"));
        var r = parseFloat(selectedShape.attr("r"));
        var opacity = selectedShape.attr("opacity");
        var fill = selectedShape.attr("fill");
	var dropDest = series._dropLineOrigin();
        
        // Fade the popup stroke mixing the shape fill with 60% white
        var popupStrokeColor = d3.rgb(
                    d3.rgb(fill).r + 0.6 * (255 - d3.rgb(fill).r),
                    d3.rgb(fill).g + 0.6 * (255 - d3.rgb(fill).g),
                    d3.rgb(fill).b + 0.6 * (255 - d3.rgb(fill).b)
                );
        
        // Fade the popup fill mixing the shape fill with 80% white
        var popupFillColor = d3.rgb(
                    d3.rgb(fill).r + 0.8 * (255 - d3.rgb(fill).r),
                    d3.rgb(fill).g + 0.8 * (255 - d3.rgb(fill).g),
                    d3.rgb(fill).b + 0.8 * (255 - d3.rgb(fill).b)
                );
        
        // Create a group for the hover objects
        var g = svg.append("g")
            .attr("class", "hoverShapes");
        
        // Add a ring around the data point
        g.append("circle")
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
                    .attr("r", r + 4)
                    .style("stroke-width", 2);
    
        // Add a drop line to the x axis
        if (dropDest.y !== null) {
            g.append("line")
                .attr("x1", cx)
                .attr("y1", (cy < dropDest.y ? cy + r + 4 : cy - r - 4 ))
                .attr("x2", cx)
                .attr("y2", (cy < dropDest.y ? cy + r + 4 : cy - r - 4 ))
                .style("fill", "none")
                .style("stroke", fill)
                .style("stroke-width", 2)
                .style("stroke-dasharray", ("3, 3"))
                .style("opacity", opacity)
                .transition()
                    .delay(animDuration / 2)
                    .duration(animDuration / 2)
                    .ease("linear")
                        .attr("y2", dropDest.y);
        }
        
        // Add a drop line to the y axis
        if (dropDest.x !== null) {
            g.append("line")
                .attr("x1", (cx < dropDest.x ? cx + r + 4 : cx - r - 4 ))
                .attr("y1", cy)
                .attr("x2", (cx < dropDest.x ? cx + r + 4 : cx - r - 4 ))
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
                        .attr("x2", dropDest.x);  
        }
        
        // Add a group for text
        var t = g.append("g");
        // Create a box for the popup in the text group
        var box = t.append("rect");
        // Get the rows for the text
        var rows = [];
        
        // Add the series categories
        if (series.categoryFields != null && series.categoryFields != undefined && series.categoryFields.length > 0) {
            series.categoryFields.forEach(function (c, i) {
                // If the category name and value match don't display the category name
                rows.push(c + (e.aggField != c ? ": " + e.aggField[i] : ""))
            }, this);
        }
        
        if (series.x._hasCategories()) {
            // Add the x axis categories
            series.x.categoryFields.forEach(function (c, i) {
                // If the category name and value match don't display the category name
                rows.push(c + (e.xField != c ? ": " + e.xField[i] : ""));
            }, this);
        }
        else {
            // Add the axis measure value
            rows.push(series.x.measure + ": " + series.x._getFormat()(e.cx));
        }
        
        if (series.y._hasCategories()) {
            // Add the y axis categories
            series.y.categoryFields.forEach(function (c, i) {
                rows.push(c + (e.yField != c ? ": " + e.yField[i] : ""));
            }, this);
        }
        else {
            // Add the axis measure value
            rows.push(series.y.measure + ":" + series.y._getFormat()(e.cy));
        }
        
        if (series.z != null && series.z != undefined) {
            // Add the axis measure value
            rows.push(series.z.measure + ": " + series.z._getFormat()(e.zValue));
        }
        
        if (series.c != null && series.c != undefined) {
            // Add the axis measure value
            rows.push(series.c.measure+ ": " + series.c._getFormat()(e.cValue));
        }
        
        // Get distinct text rows to deal with cases where 2 axes have the same dimensionality
        rows = rows.filter(function(elem, pos) {
            return rows.indexOf(elem) == pos;
        })
        
        // Create a text object for every row in the popup
        t.selectAll(".textHoverShapes").data(rows).enter()
            .append("text")
                .text(function (d) { return d; })
                .style("font-family", "sans-serif")
                .style("font-size", "10px");
        
        // The running y value for the text elements
        var y = 0;
        // The maximum bounds of the text elements
        var w = 0;
        var h = 0;
        
        // Get the max height and width of the text items
        t.each(function (d) {
            w = (this.getBBox().width > w ? this.getBBox().width : w);
            h = (this.getBBox().width > h ? this.getBBox().height : h);
        });
        
        // Position the text relatve to the bubble, the absolute positioning
        // will be done by translating the group
        t.selectAll("text")
                .attr("x", 0)
                .attr("y", function (d, i) {
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
        var overlap = cx + r + textMargin + popupMargin + w > parseFloat(svg.attr("width"));
        
        // Translate the shapes to the x position of the bubble (the x position of the shapes is handled)
        t.attr("transform", "translate(" +
               (overlap ? cx - (r + textMargin + popupMargin + w) : cx + r + textMargin + popupMargin) + " , " +
               (cy - ((y - (h - textMargin)) / 2)) +
            ")");
    },
    
        
    // Handle the mouse leave event
    leaveEventHandler: function (e, shape, chart, series, duration) {
        // Clear all hover shapes
        chart.svg
            .selectAll(".hoverShapes")
            .remove();
    }
};

