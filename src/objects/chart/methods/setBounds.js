        // Copyright: 2013 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/chart/methods/setBounds.js
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.chart#wiki-setBounds
        this.setBounds = function (x, y, width, height) {
            // Define the bounds
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            // Refresh the axes to redraw them against the new bounds
            this.axes.forEach(function (axis) {
                axis._update();
            }, this);
            // return the chart object for method chaining
            return this;
        };
