    // Copyright: 2013 PMSI-AlignAlytics
    // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
    // Source: /src/objects/legend/begin.js
    // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.legend
    dimple.legend = function (chart, x, y, width, height, horizontalAlign, series) {

        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.legend#wiki-chart
        this.chart = chart;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.legend#wiki-series
        this.series = series;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.legend#wiki-x
        this.x = dimple._parsePosition(x, this.chart.svg.node().offsetWidth);
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.legend#wiki-y
        this.y = dimple._parsePosition(y, this.chart.svg.node().offsetHeight);
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.legend#wiki-width
        this.width = dimple._parsePosition(width, this.chart.svg.node().offsetWidth);
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.legend#wiki-height
        this.height = dimple._parsePosition(height, this.chart.svg.node().offsetHeight);
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.legend#wiki-horizontalAlign
        this.horizontalAlign = horizontalAlign;
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.legend#wiki-shapes
        this.shapes = null;