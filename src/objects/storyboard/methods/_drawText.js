        // Copyright: 2014 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/storyboard/methods/drawText.js
        this._drawText = function (duration) {
            if (this.storyLabel === null || this.storyLabel === undefined) {
                var chart = this.chart,
                    xCount = 0;
                // Check for a secondary x axis
                this.chart.axes.forEach(function (a) {
                    if (a.position === "x") {
                        xCount += 1;
                    }
                }, this);
                this.storyLabel = this.chart._group.append("text")
                    .attr("x", this.chart._xPixels() + this.chart._widthPixels() * 0.01)
                    .attr("y", this.chart._yPixels() + (this.chart._heightPixels() / 35 > 10 ? this.chart._heightPixels() / 35 : 10) * (xCount > 1 ? 1.25 : -1))
                    .call(function () {
                        if (!chart.noFormats) {
                            this.style("font-family", "sans-serif")
                                .style("font-size", (chart._heightPixels() / 35 > 10 ? chart._heightPixels() / 35 : 10) + "px");
                        }
                    });
            }
            this.storyLabel
                .transition().duration(duration * 0.2)
                .attr("opacity", 0);
            this.storyLabel
                .transition().delay(duration * 0.2)
                .text(this.categoryFields.join("\\") + ": " + this.getFrameValue())
                .transition().duration(duration * 0.8)
                .attr("opacity", 1);
        };

