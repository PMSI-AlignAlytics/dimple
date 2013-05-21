// Copyright: 2013 PMSI-AlignAlytics
// License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
// Source: /src/objects/plot/line.js
dimple.plot.line = {
    stacked: false,
    supportedAxes: ["x", "y", "c"],
    draw: function (chart, series, duration) {
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
		_addGradient(seriesValue, "fill-line-gradient-" + seriesValue.replace(" ", ""), (series.x._hasCategories() ? series.x : series.y), data, chart, duration, "fill");
	    }, this);
	}
	var line = d3.svg.line()
			.x(function (d) { return _helpers.cx(d, chart, series); })
			.y(function (d) { return _helpers.cy(d, chart, series); });
	if (series.shapes == null || series.shapes == undefined) {
	    series.shapes = chart.svg.selectAll(".line")
		.data(uniqueValues)
		.enter()
		    .append("svg:path")
	    	    .attr("opacity", function(d) { return chart.getColor(d).opacity; });
	}
	series.shapes
	    .data(uniqueValues)
	    .transition().duration(duration)
	    .attr("class", function (d) { return "series line " + d.join("/").replace(" ", ""); })
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
		    this.remove();
		}
		return line(seriesData);
	    })
	    .call(function () {
		if (!chart.noFormats) {
		    this.attr("fill", "none")
			.attr("stroke", function (d) { return (graded ? "url(#fill-line-gradient-" + d.replace(" ", "") + ")" : chart.getColor(d[d.length - 1]).stroke); })
			.attr("stroke-width", series.lineWeight);
		}
	    });
	// Deal with single point lines
	chart.svg.selectAll(".fill")
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
};

