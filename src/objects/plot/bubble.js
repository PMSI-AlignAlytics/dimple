// Copyright: 2013 PMSI-AlignAlytics
// License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
// Source: /src/objects/plot/bubble.js
dimple.plot.bubble = {
    stacked: false,
    supportedAxes: ["x", "y", "z", "c"],
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
                self.enterEvent(e, this, chart, series, duration)
            })
            .on("mouseleave", function (e) {
                self.leaveEvent(e, this, chart, series, duration)
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
                this.remove();    
            })
            
        // Save the shapes to the series array
        series.shapes = theseShapes;
    },
        
    enterEvent: function (e, shape, chart, series, duration) {
      
        var svg = chart.svg;
        var selectedShape = d3.select(shape);
        var cx = parseFloat(selectedShape.attr("cx"));
        var cy = parseFloat(selectedShape.attr("cy"));
        var r = parseFloat(selectedShape.attr("r"));
        var ringColor = selectedShape.attr("fill");
        var popupStrokeColor = d3.rgb(
                    d3.rgb(ringColor).r + 0.6 * (255 - d3.rgb(ringColor).r),
                    d3.rgb(ringColor).g + 0.6 * (255 - d3.rgb(ringColor).g),
                    d3.rgb(ringColor).b + 0.6 * (255 - d3.rgb(ringColor).b)
                );
        var popupFillColor = d3.rgb(
                    d3.rgb(ringColor).r + 0.8 * (255 - d3.rgb(ringColor).r),
                    d3.rgb(ringColor).g + 0.8 * (255 - d3.rgb(ringColor).g),
                    d3.rgb(ringColor).b + 0.8 * (255 - d3.rgb(ringColor).b)
                );
        var opacity = selectedShape.attr("opacity");
        
        var g = svg.append("g")
            .attr("class", "hoverShapes");
                
        g.append("circle")
            .attr("cx", cx)
            .attr("cy", cy)
            .attr("r", r + 4)
            .attr("fill", "none")
            .attr("stroke", ringColor)
            .attr("stroke-width", 2);
            
        var t = g.append("g");
        var box = t.append("rect");
        var rows = [];
        if (series.categoryFields != null && series.categoryFields != undefined && series.categoryFields.length > 0) {
            series.categoryFields.forEach(function (c, i) {
                rows.push(c + ": " + e.aggField[i])
            }, this);
        }
        if (series.x._hasCategories()) {
            series.x.categoryFields.forEach(function (c, i) {
                rows.push(c + ": " + e.xField[i]);
            }, this);
        }
        else {
            rows.push(series.x.measure + ": " + series.x._getFormat()(e.xValue));
        }
        if (series.y._hasCategories()) {
            series.y.categoryFields.forEach(function (c, i) {
                rows.push(c + ": " + e.yField[i]);
            }, this);
        }
        else {
            rows.push(series.y.measure + ":" + series.y._getFormat()(e.yValue));
        }
        if (series.z != null && series.z != undefined) {
            rows.push(series.z.measure + ": " + series.z._getFormat()(e.zValue));
        }
        if (series.c != null && series.c != undefined) {
            rows.push(series.c.measure+ ": " + series.c._getFormat()(e.cValue));
        }
        // Get distinct values
        rows = rows.filter(function(elem, pos) {
            return rows.indexOf(elem) == pos;
        })
        t.selectAll(".textHoverShapes").data(rows).enter()
            .append("text")
                .text(function (d) { return d; })
                .style("font-family", "sans-serif")
                .style("font-size", "10px");
                
        var y = 0;
        var w = 0;
        // Get the bounds of the hover object
        t.each(function (d) {
            w = (this.getBBox().width > w ? this.getBBox().width : w)
        });
        t.selectAll("text")
                .attr("y", function (d, i) {
                    y += this.getBBox().height;
                    return y - (this.getBBox().height / 2);
                })
                .attr("x", function (d, i) {
                    return (cx + r + 15 + w > parseFloat(svg.attr("width")) ? -1 * (r + 15 + w) : r + 15);
                });
        box.attr("x", (cx + r + 15 + w > parseFloat(svg.attr("width")) ? -1 * (r + 20 + w) : r + 10))
           .attr("y", -5)
           .attr("height", Math.floor(y + 5) - 0.5)
           .attr("width", w + 10)
           .attr("rx", 5)
           .attr("ry", 5)
           .style("fill", popupFillColor)
           .style("stroke", popupStrokeColor)
           .style("stroke-width", 2)
           .style("opacity", 0.95);
        t.attr("transform", "translate(" + cx + " , " + (cy - ((y - 8) / 2)) + ")");
    },
    
    leaveEvent: function (e, shape, chart, series, duration) {
        chart.svg
            .selectAll(".hoverShapes")
            .remove();
    }
};

