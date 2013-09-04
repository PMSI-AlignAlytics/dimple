        // Copyright: 2013 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/chart/methods/setBounds.js
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.chart#wiki-setBounds
        this.setBounds = function (x, y, width, height) {
            // Handle non-integer size expressions
            this.x = dimple._parsePosition(x, this.svg.node().offsetWidth);
            this.y = dimple._parsePosition(y, this.svg.node().offsetHeight);
            this.width = dimple._parsePosition(width, this.svg.node().offsetWidth);
            this.height = dimple._parsePosition(height, this.svg.node().offsetHeight);
            // Refresh the axes to redraw them against the new bounds
            this.draw();
            // return the chart object for method chaining
            return this;
        };

