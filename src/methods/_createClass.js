
    // Copyright: 2015 AlignAlytics
    // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
    // Source: /src/methods/_createClass.js
    dimple._createClass = function (stringArray) {
        var i,
            returnArray = [],
            replacer = function(s) {
                var c = s.charCodeAt(0),
                    returnString = "-";
                if (c >= 65 && c <= 90) {
                    returnString = s.toLowerCase();
                }
                return returnString;
            };
        if (stringArray && (stringArray.length > 0)) {
            for (i = 0; i < stringArray.length; i += 1) {
                // Ignore invalid items
                if (stringArray[i]) {
                    /*jslint regexp: true */
                    returnArray.push("dimple-" + stringArray[i].toString().replace(/[^a-z0-9]/g, replacer));
                    /*jslint regexp: false */
                }
            }
        } else {
            returnArray = ["dimple-all"];
        }
        return returnArray.join(" ");
    };