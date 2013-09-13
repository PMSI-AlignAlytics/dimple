    // Copyright: 2013 PMSI-AlignAlytics
    // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
    // Source: /src/methods/_parseXPosition.js
    dimple._parseXPosition = function (value, parent) {
        var returnValue = value;
        if (value === undefined || value === null) {
            returnValue = 0;
        } else if (!isNaN(value)) {
            returnValue = value;
        } else if (value.slice(-1) === "%") {
            returnValue = dimple._parentWidth(parent) * (parseFloat(value.slice(0, value.length - 1)) / 100);
        } else if (value.slice(-2) === "px") {
            returnValue = parseFloat(value.slice(0, value.length - 2));
        }
        return returnValue;
    };
