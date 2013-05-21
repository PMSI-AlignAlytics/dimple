// Copyright: 2013 PMSI-AlignAlytics
// License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
// Source: /src/methods/_helpers.js
var _helpers = {
    
    // Calculate the centre x position
    cx: function (d, chart, series) {
        if (series.x.measure != null && series.x.measure != undefined) {
            return series.x._scale(d.cx);
        }
        else if (series.x.categoryFields != null && series.x.categoryFields != undefined && series.x.categoryFields.length >= 2) {
            return series.x._scale(d.cx) + _helpers.xGap(d, chart, series) + ((d.xOffset + 0.5) * (((chart.width / series.x._max) - 2 * _helpers.xGap(d, chart, series)) * d.width));
        }  
        else {
            return series.x._scale(d.cx) + ((chart.width / series.x._max) / 2);
        }    
    },
    
    // Calculate the centre y position
    cy: function (d, chart, series) {
        if (series.y.measure != null && series.y.measure != undefined) {
            return series.y._scale(d.cy);
        }
        else if (series.y.categoryFields != null && series.y.categoryFields != undefined && series.y.categoryFields.length >= 2) {
            return (series.y._scale(d.cy) - (chart.height / series.y._max)) +  _helpers.yGap(d, chart, series) + ((d.yOffset + 0.5) * (((chart.height / series.y._max) - 2 * _helpers.yGap(d, chart, series)) * d.height));
        }  
        else {
            return series.y._scale(d.cy) - ((chart.height / series.y._max) / 2);
        }    
    },
    
    // Calculate the radius
    r: function (d, chart, series) {
        if (series.z == null || series.z == undefined) {
            return 5;
        }
        else if (series.z._hasMeasure()) {
            return series.z._scale(d.r);
        }
        else {
            return series.z._scale(chart.height / 100);
        }
    },
    
    // Calculate the x gap for bar type charts
    xGap: function (d, chart, series) {
        if ((series.x.measure == null || series.x.measure == undefined) && series.barGap > 0) {
            return ((chart.width / series.x._max) * (series.barGap > 0.99 ? 0.99 : series.barGap)) / 2;
        }
        else {
            return 0;
        }
    },
    
    // Calculate the x gap for clusters within bar type charts
    xClusterGap: function (d, chart, series) {
        if (series.x.categoryFields != null && series.x.categoryFields != undefined && series.x.categoryFields.length >= 2 && series.clusterBarGap > 0) {
            return (d.width * ((chart.width / series.x._max) - (_helpers.xGap(d, chart, series) * 2)) * (series.clusterBarGap > 0.99 ? 0.99 : series.clusterBarGap)) / 2;
        }
        else {
            return 0;
        }
    },
    
    // Calculate the y gap for bar type charts
    yGap: function (d, chart, series) {
        if ((series.y.measure == null || series.y.measure == undefined) && series.barGap > 0) {
            return ((chart.height / series.y._max) * (series.barGap > 0.99 ? 0.99 : series.barGap)) / 2;
        }
        else {
            return 0;
        }
    },
    
    // Calculate the y gap for clusters within bar type charts
    yClusterGap: function (d, chart, series) {
        if (series.y.categoryFields != null && series.y.categoryFields != undefined && series.y.categoryFields.length >= 2 && series.clusterBarGap > 0) {
            return (d.height * ((chart.height / series.y._max) - (_helpers.yGap(d, chart, series) * 2)) * (series.clusterBarGap > 0.99 ? 0.99 : series.clusterBarGap)) / 2;
        }
        else {
            return 0;
        }
    },
    
    // Calculate the top left x position for bar type charts
    x: function (d, chart, series) {
        return series.x._scale(d.x)
            + _helpers.xGap(d, chart, series)
            + (d.xOffset * (_helpers.width(d, chart, series) + 2 * _helpers.xClusterGap(d, chart, series)))
            + _helpers.xClusterGap(d, chart, series);
    },
    
    // Calculate the top left y position for bar type charts
    y: function (d, chart, series) {
        if (series.y.measure != null && series.y.measure != undefined) {
            return series.y._scale(d.y);
        }
        else {
            return (series.y._scale(d.y) - (chart.height / series.y._max))
                + _helpers.yGap(d, chart, series)
                + (d.yOffset * (_helpers.height(d, chart, series) + 2 * _helpers.yClusterGap(d, chart, series)))
                + _helpers.yClusterGap(d, chart, series);
        }
    },
    
    // Calculate the width for bar type charts
    width: function (d, chart, series) {
        if (series.x.measure != null && series.x.measure != undefined) {
            return Math.abs(series.x._scale(d.width) - series.x._scale(0));
        }
        else {
            return d.width
                 * ((chart.width / series.x._max) - (_helpers.xGap(d, chart, series) * 2))
                 - (_helpers.xClusterGap(d, chart, series) * 2);
        }
    },
    
    // Calculate the height for bar type charts
    height: function (d, chart, series) {
        if (series.y.measure != null && series.y.measure != undefined) {
            return Math.abs(series.y._scale(0) - series.y._scale(d.height));
        }
        else {
            return d.height
                 * ((chart.height / series.y._max) - (_helpers.yGap(d, chart, series) * 2))
                 - (_helpers.yClusterGap(d, chart, series) * 2);
        }
    },
    
    // Calculate the opacity for series
    opacity: function (d, chart, series) {
        if (series.c != null && series.c != undefined) {
            return d.opacity;
        }
        else {
            return chart.getColor(d.aggField.slice(-1)[0]).opacity;
        }
    },

    // Calculate the fill coloring for series
    fill: function (d, chart, series) {
        if (series.c != null && series.c != undefined) {
            return d.fill;
        }
        else {
            return chart.getColor(d.aggField.slice(-1)[0]).fill;
        }
    },

    // Calculate the stroke coloring for series
    stroke: function (d, chart, series) {
        if (series.c != null && series.c != undefined) {
            return d.stroke;
        }
        else {
            return chart.getColor(d.aggField.slice(-1)[0]).stroke;
        }
    }
    
};

