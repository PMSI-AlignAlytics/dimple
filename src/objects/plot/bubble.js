// Copyright: 2013 PMSI-AlignAlytics
// License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
// Source: /src/objects/plot/bubble.js
dimple.plot.bubble = {
    stacked: false,
    supportedAxes: ["x", "y", "z", "c"],
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
            .append("circle")
            .attr("id", function (d) { return d.key; })
            .attr("class", function (d) { return className + " bubble " + d.aggField.join(" ") + " " + d.xField.join(" ") + " " + d.yField.join(" ") + " " + d.zField.join(" "); })
            .attr("cx", function (d) { return series.x._previousOrigin; })
            .attr("cy", function (d) { return series.y._previousOrigin; })
            .attr("r", 0 )
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
                this.remove();    
            })
            
        // Save the shapes to the series array
        series.shapes = theseShapes;
    }
};

