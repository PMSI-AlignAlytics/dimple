// Copyright: 2013 PMSI-AlignAlytics
// License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
// Source: /src/objects/chart/methods/_getOrderedList.js
dimple._getOrderedList = function (data, fields, levelDefinitions) {
    // Force the level definitions into an array
    if (levelDefinitions == null || levelDefinitions == undefined) {
        levelDefinitions = [];
    } 
    else {
        levelDefinitions = [].concat(levelDefinitions);
    }
    // Add the base case
    levelDefinitions = levelDefinitions.concat({ ordering: fields, desc: false });
    // Function for recursively sorting
    var rollupData = dimple._rollUp(data, fields);
    // If we go below the leaf stop recursing
    if (levelDefinitions.length >= 1) {
        // Build a stack of compare methods
        var sortStack = []
        // Iterate each level definition
        levelDefinitions.forEach(function (def, i) {
            // Draw ascending by default
            var desc = (def.desc === null || def.desc === undefined ? false : def.desc);
            // Get the ordering definition
            var ordering = def.ordering;
            // Handle the ordering based on the type set
            if (typeof ordering == "function") {
                // Apply the sort predicate directly
                sortStack.push(function (a, b) {
                        return (desc ? -1 : 1) * ordering(a, b);
                });
            }
            else if (ordering instanceof Array) {
                // The order list may be an array of arrays
                // combine the values with pipe delimiters.
                // The delimiter is irrelevant as long as it is consistent
                // with the sort predicate below
                var orderArray = [];
                ordering.forEach(function (d) {
                    orderArray.push(([].concat(d)).join("|"));
                }, this);
                // Sort according to the axis position
                sortStack.push(function (a, b) {
                    var aStr = "";
                    var bStr = "";
                    [].concat(fields).forEach(function (f, i) {
                        aStr += (i > 0 ? "|" : "") + a[f];
                        bStr += (i > 0 ? "|" : "") + b[f];
                    }, this);
                    // If the value is not found it should go to the end (if descending it
                    // should go to the start so that it ends up at the back when reversed)
                    aIx = orderArray.indexOf(aStr);
                    bIx = orderArray.indexOf(bStr);
                    var aIx = (aIx < 0 ? (desc ? -1 : orderArray.length) : aIx);
                    var bIx = (bIx < 0 ? (desc ? -1 : orderArray.length) : bIx);
                    return (desc ? -1 : 1) * (aIx - bIx);
                });
            }
            else {
                // If the ordering is a field get it here
                var field = (typeof ordering == "string" ? ordering : null);
                // A little helper method for summing sub arrays
                var sum = function (array) {
                    var total = 0;
                    array.forEach(function (n) {
                        total += n;
                    });
                    return total;
                };
                // Comparator dealing with parses
                var compare = function (a, b) {
                    var result = 0;
                    if (!isNaN(sum(a)) && !isNaN(sum(b))) {
                        result = parseFloat(sum(a)) - parseFloat(sum(b));
                    }
                    else if (!isNaN(Date.parse(a[0])) && !isNaN(Date.parse(b[0]))) {
                        result = Date.parse(a[0]) - Date.parse(b[0]);
                    }  
                    else if (a[0] < b[0]) {
                        result = -1;
                    }
                    else if (a[0] > b[0]) {
                        result = 1;
                    }
                    return result;
                }
                // Sort the data
                sortStack.push(function (a, b) {
                    // The result value
                    var result = 0;
                    // Find the field
                    if (a[field] !== undefined && b[field] !== undefined) {
                        // Compare just the first mapped value
                        result = compare([].concat(a[field]), [].concat(b[field]));     
                    }
                    return (desc ? -1 : 1) * result;
                });
            }
        });
        rollupData.sort(function (a, b) {
            var compareIx = 0;
            var result = 0;
            while (compareIx < sortStack.length && result == 0) {
                result = sortStack[compareIx](a, b);
                compareIx++;
            }
            return result;
        });
    }       
    // Return the ordered list
    return rollupData;
};

