// Source: /src/objects/legend/methods/_draw.js
this._draw = function (duration) {
    
    // Create an array of distinct color elements from the series
    var legendArray = this._getEntries();
    
    // If there is already a legend, fade to transparent and remove
    if (this.shapes != null || this.shapes != undefined) {
        this.shapes
            .transition()
            .duration(duration * 0.2)
            .attr("opacity", 0)
            .remove();
    }
    
    // Set some values for positioning
    var maxWidth = 0,
        maxHeight = 0,
        runningX = 0,
        runningY = 0,
        keyWidth = 15,
        keyHeight = 9;
    
    // Get a reference to the legend object for inside the function calls
    var self = this;
    
    // Create an empty hidden group for every legend entry
    // the selector here must not pick up any legend entries being removed by the
    // transition above
    var theseShapes = chart.svg
        .selectAll(".dontSelectAny")
        .data(legendArray)
        .enter()
        .append("g")
            .attr("class", "legend")
            .attr("opacity", 0);
    
    // Add text into the group
    theseShapes.append("text")
        .attr("id", function (d) { return "legend_" + d.key; })
        .attr("class", "legendText")
        .text(function(d) {
            return d.key;
        })
        .call(function () {
            if (!chart.noFormats) {
                this.style("font-family", "sans-serif")
                    .style("font-size", (chart.height / 35 > 10 ? chart.height / 35 : 10) + "px")
                    .style("shape-rendering", "crispEdges");
            }
        })
        .each(function (s) {
            var b = this.getBBox();
            if (b.width > maxWidth) {
                maxWidth = b.width;
            }
            if (b.height > maxHeight) {
                maxHeight = b.height;
            }
        });
    
    // Add a rectangle into the group
    theseShapes.append("rect")
        .attr("class", "legendKey")
        .attr("height", keyHeight)
        .attr("width",  keyWidth);
            
    // Expand the bounds of the largest shape slightly.  This will be the size allocated to
    // all elements
    maxHeight = (maxHeight < keyHeight ? keyHeight : maxHeight) + 2;
    maxWidth += keyWidth + 20;
    
    // Iterate the shapes and position them based on the alignment and size of the legend
    theseShapes
        .each(function (d) {
            if (runningX + maxWidth > self.width) {
                runningX = 0;
                runningY += maxHeight;
            }
            if (runningY > self.height) {
                d3.select(this).remove();
            }
            else {
                d3.select(this).select("text")
                    .attr("x", (self.horizontalAlign == "left" ? self.x + keyWidth + 5 + runningX : self.x + (self.width - runningX - maxWidth) + keyWidth + 5))
                    .attr("y", function (d) {
                        // This was previously done with dominant-baseline but this is used
                        // instead due to browser inconsistancy.
                        return self.y + runningY + this.getBBox().height / 1.65;
                    })
                    .attr("width", self.width)
                    .attr("height", self.height);
                d3.select(this).select("rect")
                    .attr("class", "legend legendKey")
                    .attr("x", (self.horizontalAlign == "left" ? self.x + runningX : self.x + (self.width - runningX - maxWidth)))
                    .attr("y", self.y + runningY)
                    .attr("height", keyHeight)
                    .attr("width",  keyWidth)
                    .style("fill", function () { return _helpers.fill(d, self.chart, d.series); })
                    .style("stroke", function () { return _helpers.stroke(d, self.chart, d.series); })
                    .style("opacity", function () { return _helpers.opacity(d, self.chart, d.series); })
                    .style("shape-rendering", "crispEdges");
                runningX += maxWidth;
            }
        });
        
    // Fade in the shapes if this is transitioning
    theseShapes
        .transition()
        .delay(duration * 0.2)
        .duration(duration * 0.8)
        .attr("opacity", 1);
        
    // Assign them to the public property for modification by the user.
    this.shapes = theseShapes;
};