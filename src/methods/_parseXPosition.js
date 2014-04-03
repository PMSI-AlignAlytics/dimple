    // Copyright: 2014 PMSI-AlignAlytics
    // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
    // Source: /src/methods/_parseXPosition.js
    dimple._parseXPosition = function (value, parent) {
        var returnValue = 0,
            values = value.toString().split(",");
        values.forEach(function (v) {
            if (v !== undefined && v !== null) {
                if (!isNaN(v)) {
                    returnValue += parseFloat(v);
                } else if (v.slice(-1) === "%") {
                    returnValue += dimple._parentWidth(parent) * (parseFloat(v.slice(0, v.length - 1)) / 100);
                } else if (v.slice(-2) === "px") {
                    returnValue += parseFloat(v.slice(0, v.length - 2));
                } else {
                    returnValue = value;
                }
            }
        }, this);
        return returnValue;
    };
