        // Copyright: 2015 AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/storyboard/methods/drawText.js
        this._drawText = function () {
            var self = this,
                xCount = 0;
            if (!self.storyLabel) {
                // Check for a secondary x axis
                self.chart.axes.forEach(function (a) {
                    if (a.position === "x") {
                        xCount += 1;
                    }
                }, self);
                self.storyLabel = self.chart._group.append("text")
                    .attr("class", "dimple-storyboard-label")
                    .attr("opacity", 1)
                    .attr("x", self.chart._xPixels() + self.chart._widthPixels() * 0.01)
                    .attr("y", self.chart._yPixels() + (self.chart._heightPixels() / 35 > 10 ? self.chart._heightPixels() / 35 : 10) * (xCount > 1 ? 1.25 : -1))
                    .call(function (context) {
                        if (!chart.noFormats) {
                            context.style("font-family", self.fontFamily)
                                .style("font-size", self._getFontSize());
                        }
                    });
            }
            self.storyLabel
                .text(self.categoryFields.join("\\") + ": " + self.getFrameValue());
        };
