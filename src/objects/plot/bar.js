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
            .append("rect")
            .attr("id", function (d) { return d.key; })
            .attr("class", function (d) { return className + " bar " + d.aggField.join(" ") + " " + d.xField.join(" ") + " " + d.yField.join(" "); })
            .attr("x", function (d) { return _helpers.x(d, chart, series); })
            .attr("y", function (d) { return _helpers.y(d, chart, series); })
            .attr("width", function (d) {return (d.xField != null && d.xField.length > 0 ? _helpers.width(d, chart, series) : 0); })
            .attr("height", function (d) {return (d.yField != null && d.yField.length > 0 ? _helpers.height(d, chart, series) : 0); })
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
            .attr("x", function (d) { return _helpers.x(d, chart, series); })
            .attr("y", function (d) { return _helpers.y(d, chart, series); })
            .attr("width", function (d) { return _helpers.width(d, chart, series); })
            .attr("height", function (d) { return _helpers.height(d, chart, series); })
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
            .attr("x", function (d) { return _helpers.x(d, chart, series); })
            .attr("y", function (d) { return _helpers.y(d, chart, series); })
            .attr("width", function (d) { return _helpers.width(d, chart, series); })
            .attr("height", function (d) { return _helpers.height(d, chart, series); })
            .each("end", function () {
                this.remove();    
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
        var x = parseFloat(selectedShape.attr("x"));
        var y = parseFloat(selectedShape.attr("y"));
        var width = parseFloat(selectedShape.attr("width"));
        var height = parseFloat(selectedShape.attr("height"));
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
    
	// Add a drop line to the x axis
	if (!series.x._hasCategories() && dropDest.y !== null) {
	    g.append("line")
		.attr("x1", (x < series.x._origin ? x + 1 : x + width - 1))
		.attr("y1", (y < dropDest.y ? y + height : y ))
		.attr("x2", (x < series.x._origin ? x + 1 : x + width - 1))
		.attr("y2", (y < dropDest.y ? y + height : y ))
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
	if (!series.y._hasCategories() && dropDest.x !== null) {
	    g.append("line")
		.attr("x1", (x < dropDest.x ? x + width : x ))
		.attr("y1", (y < series.y._origin ? y + 1 : y + height - 1 ))
		.attr("x2", (x < dropDest.x ? x + width : x ))
		.attr("y2", (y < series.y._origin ? y + 1 : y + height - 1 ))
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
            rows.push(series.x.measure + ": " + series.x._getFormat()(e.width));
        }
        
        if (series.y._hasCategories()) {
            // Add the y axis categories
            series.y.categoryFields.forEach(function (c, i) {
                rows.push(c + (e.yField != c ? ": " + e.yField[i] : ""));
            }, this);
        }
        else {
            // Add the axis measure value
            rows.push(series.y.measure + ":" + series.y._getFormat()(e.height));
        }
        
        if (series.c != null && series.c != undefined) {
            // Add the axis measure value
            rows.push(series.c.measure+ ": " + series.c._getFormat()(series.c.showPercent ? e.cPct : e.cValue));
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
        var yRunning = 0;
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
        if (x + width + textMargin + popupMargin + w < parseFloat(svg.attr("width"))) {
	    // Draw centre right
	    t.attr("transform", "translate(" +
               (x + width + textMargin + popupMargin) + " , " +
               (y + (height / 2) - ((yRunning - (h - textMargin)) / 2)) +
            ")");	
	}
	else if (x - (textMargin + popupMargin + w) > 0) {
	    // Draw centre left
	    t.attr("transform", "translate(" +
               (x - (textMargin + popupMargin + w)) + " , " +
               (y + (height / 2) - ((yRunning - (h - textMargin)) / 2)) +
            ")");
	}
	else if (y + height + yRunning + popupMargin + textMargin < parseFloat(svg.attr("height"))) {
	    // Draw centre below
	    t.attr("transform", "translate(" +
               (x + (width / 2) - (2 * textMargin + w) / 2) + " , " +
               (y + height + 2 * textMargin) +
            ")");
	}
	else {
	    // Draw centre above
	    t.attr("transform", "translate(" +
               (x + (width / 2) - (2 * textMargin + w) / 2) + " , " +
               (y - yRunning - (h - textMargin)) +
            ")");
	}
    },
    
        
    // Handle the mouse leave event
    leaveEventHandler: function (e, shape, chart, series, duration) {
        // Clear all hover shapes
        chart.svg
            .selectAll(".hoverShapes")
            .remove();
    }
};

