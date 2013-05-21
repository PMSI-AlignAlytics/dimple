// Copyright: 2013 PMSI-AlignAlytics
// License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
// Source: /src/objects/chart/methods/addPctAxis.js
// Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.chart#wiki-addPctAxis
this.addPctAxis = function (position, measure) {
    var pctAxis = this.addMeasureAxis(position, measure);
    pctAxis.showPercent = true;
    return pctAxis;
};

