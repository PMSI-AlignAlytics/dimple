// Copyright: 2013 PMSI-AlignAlytics
// License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
// Source: /src/objects/plot/area.js
dimple.plot.area = {
    stacked: true,
    supportedAxes: ["x", "y", "c"],
    draw: function (chart, series, duration) {
	var data = series._positionData;
	var uniqueValues = dimple.getUniqueValues(data, "aggField");//.reverse(); // Reverse order so that areas overlap correctly
	var graded = false;
	if (series.c != null && series.c != undefined && ((series.x._hasCategories() && series.y._hasMeasure()) || (series.y._hasCategories() && series.x._hasMeasure()))) {
	    graded = true;
	    uniqueValues.forEach(function (seriesValue, i) {
		_addGradient(seriesValue, "fill-area-gradient-" + seriesValue.replace(" ", ""), (series.x._hasCategories() ? series.x : series.y), data, chart, duration, "fill");
		_addGradient(seriesValue, "stroke-area-gradient-" + seriesValue.replace(" ", ""), (series.x._hasCategories() ? series.x : series.y), data, chart, duration, "stroke");
	    }, this);
	}
	var line = d3.svg.line()
			.x(function (d) { return _helpers.cx(d, chart, series); })
			.y(function (d) { return _helpers.cy(d, chart, series); });
	//var termBound = function (pos, max) {
	//    return (series[pos]._hasCategories() ? series[pos].categories[(max ? series[pos].categories.length - 1 : 0)] : 0);
	//};
	if (series.shapes == null || series.shapes == undefined) {
	    series.shapes = chart.svg.selectAll(".area")
		.data(uniqueValues)
		.enter()
		    .append("svg:path")
		    .attr("opacity", function(d) { return chart.getColor(d).opacity; });
	}
	var catPoints = {}
	series.shapes
	    .data(uniqueValues)
	    .transition().duration(duration)
	    .attr("class", function (d) { return "series area " + d.replace(" ", ""); })
	    .attr("d", function (d, i) {
		//var startPoint = [{ cy: termBound("y", false), cx: termBound("x", false)}];
		//var endPoint = [{ cy: termBound("y", true), cx: termBound("x", true)}];
		var seriesData = dimple.filterData(data, "aggField", d)
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
		var baseline = [];
		for (var j = seriesData.length - 1; j >= 0; j--) {
		    var row = seriesData[j];
		    var newObj = { cx: 0, cy: 0, height: 0, width: 0, xOffset: 0, yOffset: 0 };
		    if (series.x._hasCategories()) {
			// Fix the x properties
			newObj.cx = row.cx;
			newObj.width = row.width;
			newObj.xOffset = row.xOffset;
			// Find the largest value for the xField less than this value
			if (catPoints[row.xField] == undefined) {
			    catPoints[row.xField] = [];
			}
			else {
			    var max = 0;
			    catPoints[row.xField].forEach(function (q) {
				if ((row.cy >= 0 && q >= 0) || (row.cy <= 0 && q <= 0)) {
				    if (Math.abs(q) <= Math.abs(row.cy) && Math.abs(q) > Math.abs(max)) {
					max = q;
				    }
				}
			    }, this);
			    newObj.cy = max;
			}
			baseline.push(newObj);
			catPoints[row.xField].push(row.cy);
		    }
		    else if (series.y._hasCategories()) {
			// Fix the y properties
			newObj.cy = row.cy;
			newObj.height = row.height;
			newObj.yOffset = row.yOffset;
			// Find the largest value for the xField less than this value
			if (catPoints[row.yField] == undefined) {
			    catPoints[row.yField] = [];
			}
			else {
			    var max = 0;
			    catPoints[row.yField].forEach(function (q) {
				if ((row.cx >= 0 && q >= 0) || (row.cx <= 0 && q <= 0)) {
				    if (Math.abs(q) <= Math.abs(row.cx) && Math.abs(q) > Math.abs(max)) {
					max = q;
				    }
				}
			    }, this);
			    newObj.cx = max;
			}
			baseline.push(newObj);
			catPoints[row.yField].push(row.cx);	
		    }
		}
		//return line(startPoint.concat(seriesData).concat(endPoint));
		return line(seriesData.concat(baseline).concat(seriesData[0]));
	    })
	    .call(function () {
		if (!chart.noFormats) {
		    this.attr("fill", function (d) { return (graded ? "url(#fill-area-gradient-" + d.replace(" ", "") + ")" : chart.getColor(d).fill); })
			.attr("stroke", function (d) { return (graded ? "url(#stroke-area-gradient-" + d.replace(" ", "") + ")" : chart.getColor(d).stroke); })
			.attr("stroke-width", series.lineWeight);	
		}
	    });
	
    }
};

