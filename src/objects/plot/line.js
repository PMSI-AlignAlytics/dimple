// Copyright: 2013 PMSI-AlignAlytics
// License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
// Source: /src/objects/plot/line.js
dimple.plot.line = {
    stacked: false,
    supportedAxes: ["x", "y", "c"],
    draw: function (chart, series, duration) {
        
	// Get self pointer for inner functions
        var self = this;
	
	var data = series._positionData;
	var fillIns = [];
	var uniqueValues = [];
	// If there is a category axis we should draw a line for each aggField.  Otherwise
	// the first aggField defines the points and the others define the line
	var firstAgg = 1;
	if (series.x._hasCategories() || series.y._hasCategories()) {
	    firstAgg = 0;
	}
	data.forEach(function (d, i) {
	    var filter = [];
	    var match = false;
	    for (var k = firstAgg; k < d.aggField.length; k++) {
		filter.push(d.aggField[k]);
	    }
	    uniqueValues.forEach(function (d) {
		match = match || (d.join("/") == filter.join("/"));
	    }, this);
	    if (!match) {
		uniqueValues.push(filter);
	    }
	}, this);	
	var graded = false;
	if (series.c != null && series.c != undefined && ((series.x._hasCategories() && series.y._hasMeasure()) || (series.y._hasCategories() && series.x._hasMeasure()))) {
	    graded = true;
	    uniqueValues.forEach(function (seriesValue, i) {
		_addGradient(seriesValue, "fill-line-gradient-" + seriesValue.join("_").replace(" ", ""), (series.x._hasCategories() ? series.x : series.y), data, chart, duration, "fill");
	    }, this);
	}
	var line = d3.svg.line()
			.x(function (d) { return _helpers.cx(d, chart, series); })
			.y(function (d) { return _helpers.cy(d, chart, series); });
	if (series.shapes == null || series.shapes == undefined) {
	    series.shapes = chart._group.selectAll(".line")
		.data(uniqueValues)
		.enter()
		    .append("svg:path")
	    	    .attr("opacity", function(d) { return chart.getColor(d).opacity; });
	}
	series.shapes
	    .data(uniqueValues)
	    .transition().duration(duration)
	    .attr("class", function (d) { return "series line " + d.join("_").replace(" ", ""); })
	    .attr("d", function (d) { 
		var seriesData = [];
		data.forEach(function (r) {
		    var add = true;
		    for (var k = firstAgg; k < r.aggField.length; k++) {
			add = add && (d[k - firstAgg] == r.aggField[k]);
		    }
		    if (add) {
			seriesData.push(r);
		    }
		}, this);
		seriesData.sort(function (a, b) {
		    if (series.x._hasCategories()) {
			return (_helpers.cx(a, chart, series) < _helpers.cx(b, chart, series) ? -1 : 1); 
		    }
		    else if (series.y._hasCategories()) {
			return (_helpers.cy(a, chart, series) < _helpers.cy(b, chart, series) ? -1 : 1); 
		    }
		    else {
			return 0;
		    }
		});
		if (seriesData.length == 1) {
		    fillIns.push({
				cx: _helpers.cx(seriesData[0], chart, series),
				cy: _helpers.cy(seriesData[0], chart, series),
				opacity: chart.getColor(d[d.length - 1]).opacity,
				color: chart.getColor(d[d.length - 1]).stroke
				});
		    d3.select(this).remove();
		}
		return line(seriesData);
	    })
	    .call(function () {
		if (!chart.noFormats) {
		    this.attr("fill", "none")
			.attr("stroke", function (d) { return (graded ? "url(#fill-line-gradient-" + d.join("_").replace(" ", "") + ")" : chart.getColor(d[d.length - 1]).stroke);			    })
			.attr("stroke-width", series.lineWeight);
		}
	    });
	
	// Add line markers.  
	var markers = chart._group.selectAll(".markers")
            .data(data)
	    .enter()
	
	// Add a fully opaque white circle first so we don't see a ghost of the line
	if (series.lineMarkers) {
	    markers.append("circle")
		.transition().duration(duration)
		.attr("cx", function (d) { return _helpers.cx(d, chart, series); })
		.attr("cy", function (d) { return _helpers.cy(d, chart, series); })
		.attr("r", 2 + series.lineWeight)
		.attr("fill", "white")
		.attr("stroke", "none");
	}
	
	// Add the actual marker. We need to do this even if we aren't displaying them because they
	// catch hover events
        markers.append("circle")
            .on("mouseover", function (e) {
                self.enterEventHandler(e, this, chart, series, duration)
            })
            .on("mouseleave", function (e) {
                self.leaveEventHandler(e, this, chart, series, duration)
            })
            .transition().duration(duration)
            .attr("cx", function (d) { return _helpers.cx(d, chart, series); })
            .attr("cy", function (d) { return _helpers.cy(d, chart, series); })
            .attr("r", 2 + series.lineWeight)
            .attr("opacity", function (d) { return (series.lineMarkers ? chart.getColor(d).opacity : 0); })
            .call(function () {
                if (!chart.noFormats) {
                    this.attr("fill", "white") 
			.style("stroke-width", series.lineWeight)
                        .attr("stroke", function (d) {
			    return (graded ? _helpers.fill(d, chart, series) : chart.getColor(d.aggField[d.aggField.length - 1]).stroke);
			    });    
                }    
            });
	    
	// Deal with single point lines if there are no markers
	if (!series.lineMarkers) {
	    chart._group.selectAll(".fill")
		.data(fillIns)
		.enter()
		.append("circle")
		.attr("cx", function (d) { return d.cx; })
		.attr("cy", function (d) { return d.cy; })
		.attr("r", series.lineWeight )
		.attr("opacity", function (d) { return d.opacity; })
		.call(function () {
		    if (!chart.noFormats) {
			this.attr("fill", function (d) { return d.color; })
			    .attr("stroke", "none");    
		    }    
		});
	}
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
        var selectedShape = d3.select(shape);
        var cx = parseFloat(selectedShape.attr("cx"));
        var cy = parseFloat(selectedShape.attr("cy"));
        var r = parseFloat(selectedShape.attr("r"));
        var opacity = _helpers.opacity(e, chart, series);
        var fill = selectedShape.attr("stroke");
	var dropDest = series._dropLineOrigin();
    		
	// On hover make the line marker visible immediately
	selectedShape.style("opacity", 1);
	
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
        var g = chart._group.append("g")
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
                    .attr("r", r + series.lineWeight + 2)
                    .style("stroke-width", 2);
    
        // Add a drop line to the x axis
	if (dropDest.y !== null) {
	    g.append("line")
		.attr("x1", cx)
		.attr("y1", (cy < dropDest.y ? cy + r + series.lineWeight + 2 : cy - r - series.lineWeight - 2 ))
		.attr("x2", cx)
		.attr("y2", (cy < dropDest.y ? cy + r + series.lineWeight + 2 : cy - r - series.lineWeight - 2 ))
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
		.attr("x1", (cx < dropDest.x ? cx + r + series.lineWeight + 2 : cx - r - series.lineWeight - 2 ))
		.attr("y1", cy)
		.attr("x2", (cx < dropDest.x ? cx + r + series.lineWeight + 2 : cx - r - series.lineWeight - 2 ))
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
            rows.push(series.y.measure + ": " + series.y._getFormat()(e.cy));
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
        var overlap = cx + r + textMargin + popupMargin + w > parseFloat(chart.svg.attr("width"));
        
        // Translate the shapes to the x position of the bubble (the x position of the shapes is handled)
        t.attr("transform", "translate(" +
               (overlap ? cx - (r + textMargin + popupMargin + w) : cx + r + textMargin + popupMargin) + " , " +
               (cy - ((y - (h - textMargin)) / 2)) +
            ")");
    },
    
        
    // Handle the mouse leave event
    leaveEventHandler: function (e, shape, chart, series, duration) {
	// Return the opacity of the marker
        d3.select(shape).style("opacity", (series.lineMarkers ? _helpers.opacity(e, chart, series) : 0));
        // Clear all hover shapes
        chart._group
            .selectAll(".hoverShapes")
            .remove();
    }
};

