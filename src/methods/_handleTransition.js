    // Copyright: 2014 PMSI-AlignAlytics
    // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
    // Source: /src/methods/_handleTransition.js
    dimple._handleTransition = function (input, duration) {
        var returnShape = null;
        if (duration === 0) {
            returnShape = input;
        } else {
            returnShape = input.transition().duration(duration);
        }
        return returnShape;
    };
