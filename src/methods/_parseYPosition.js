    // Copyright: 2014 PMSI-AlignAlytics
    // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
    // Source: /src/methods/_parseYPosition.js
    dimple._parseYPosition = function (value, parent) {
        var returnValue = 0,
            values;
        if (value !== null && value !== undefined) {
            values = value.toString().split(",");
            values.forEach(function (v) {
                if (v !== undefined && v !== null) {
                    if (!isNaN(v)) {
                        returnValue += parseFloat(v);
                    } else if (v.slice(-1) === "%") {
                        returnValue += dimple._parentHeight(parent) * (parseFloat(v.slice(0, v.length - 1)) / 100);
                    } else if (v.slice(-2) === "px") {
                        returnValue += parseFloat(v.slice(0, v.length - 2));
                    } else {
                        returnValue = value;
                    }
                }
            }, this);
        }
        // Take the position from the extremity if the value is negative
        if (returnValue < 0) {
            returnValue = dimple._parentHeight(parent) + returnValue;
        }
        return returnValue;
    };
