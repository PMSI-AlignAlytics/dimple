// Copyright: 2013 PMSI-AlignAlytics
// License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
// Source: /src/objects/color/begin.js
dimple.color = function (fill, stroke, opacity) {
    this.fill = fill;
    this.stroke = (stroke == null || stroke == undefined ? d3.rgb(fill).darker(0.5).toString() : stroke);
    this.opacity = (opacity == null || opacity == undefined ? 0.8 : opacity);

    