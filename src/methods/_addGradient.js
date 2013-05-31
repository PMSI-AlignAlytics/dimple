// Copyright: 2013 PMSI-AlignAlytics
// License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
// Source: /src/methods/_addGradient.js
var _addGradient = function (seriesValue, id, categoryAxis, data, chart, duration, colorProperty) {
    var grad = chart._group.select("#" + id);
    var cats = [];
    var field = categoryAxis.position + "Field";
    data.forEach(function (d) {
        if (cats.indexOf(d[field]) == -1) {
            cats.push(d[field]);    
        }
    }, this);
    var transition = true;
    if (grad.node() == null) {
        transition = false;
        grad = chart._group.append("linearGradient")
            .attr("id", id)
            .attr("gradientUnits", "objectBoundingBox")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 1)
            .attr("y2", 1);
    }
    var colors = [];
    cats.forEach(function (cat, j) {
        var row = {};
        for (var k = 0; k < data.length; k++) {
            if (data[k].aggField.join("_") == seriesValue.join("_") && data[k][field].join("_") == cat.join("_")) {
                row = data[k]; break;
            }
        }
        colors.push({ offset: Math.round((j / (cats.length - 1)) * 100) + "%", color: row[colorProperty] });
    }, this);
    if (transition) {
        grad.selectAll("stop")
            .data(colors)
            .transition().duration(duration)
            .attr("offset", function(d) { return d.offset; })
            .attr("stop-color", function(d) { return d.color; });
    }
    else {
        grad.selectAll("stop")
            .data(colors)
            .enter()
            .append("stop")
            .attr("offset", function(d) { return d.offset; })
            .attr("stop-color", function(d) { return d.color; });
    }
};

