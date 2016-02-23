    // Copyright: 2015 AlignAlytics
    // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
    // Source: /src/methods/_parentHeight.js
    dimple._parentHeight = function (parent) {
        // Let's be explicit about what we are trying to get here
        var returnValue = parent.getBoundingClientRect().height;
        // If it returns nothing then go with "clientWidth"
        if (!returnValue || returnValue < 0) {
            returnValue = parent.clientHeight;
        }

        return returnValue;
    };
