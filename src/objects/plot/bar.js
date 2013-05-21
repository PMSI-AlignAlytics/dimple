// Copyright: 2013 PMSI-AlignAlytics
// License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
// Source: /src/objects/plot/bar.js
dimple.plot.bar = {
    stacked: true,
    supportedAxes: ["x", "y", "c"],
    draw: function (chart, series, duration) {
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
    }
};

