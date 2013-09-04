    // Copyright: 2013 PMSI-AlignAlytics
    // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
    // Source: /src/methods/_parsePosition.js
    dimple._parsePosition = function (value, svgScaleValue) {
        var returnValue = value;
        if (!isNaN(value)) {
            returnValue = value;
        } else if (value.slice(-1) === "%") {
            returnValue = svgScaleValue * (parseFloat(value.slice(0, value.length - 1)) / 100);
        } else if (value.slice(-2) === "px") {
            returnValue = parseFloat(value.slice(0, value.length - 2));
        }
        return returnValue;
    };
