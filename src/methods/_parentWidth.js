    // Copyright: 2015 AlignAlytics
    // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
    // Source: /src/methods/_parentWidth.js
    dimple._parentWidth = function (parent) {
         // Let's be explicit about what we are trying to get here
        var returnValue = parent.getBoundingClientRect().width;
        // If it returns nothing then go with "clientWidth"
        if (!returnValue || returnValue < 0) {
            returnValue = parent.clientWidth;
        }
        return returnValue;
    };
