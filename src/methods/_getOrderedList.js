    // Copyright: 2014 PMSI-AlignAlytics
    // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
    // Source: /src/objects/chart/methods/_getOrderedList.js
    dimple._getOrderedList = function (data, mainField, levelDefinitions) {
        var rollupData = [],
            sortStack = [],
            finalArray = [],
            fields = [mainField],
            defs = [];
        // Force the level definitions into an array
        if (levelDefinitions !== null && levelDefinitions !== undefined) {
            defs = defs.concat(levelDefinitions);
        }
        // Add the base case
        defs = defs.concat({ ordering: mainField, desc: false });
        // Exclude fields if this does not contain a function
        defs.forEach(function (def) {
            var field;
            if (typeof def.ordering === "function") {
                for (field in data[0]) {
                    if (data[0].hasOwnProperty(field) && fields.indexOf(field) === -1) {
                        fields.push(field);
                    }
                }
            } else if (!(def.ordering instanceof Array)) {
                fields.push(def.ordering);
            }
        }, this);
        rollupData = dimple._rollUp(data, mainField, fields);
        // If we go below the leaf stop recursing
        if (defs.length >= 1) {
            // Build a stack of compare methods
            // Iterate each level definition
            defs.forEach(function (def) {
                // Draw ascending by default
                var desc = (def.desc === null || def.desc === undefined ? false : def.desc),
                    ordering = def.ordering,
                    orderArray = [],
                    field = (typeof ordering === "string" ? ordering : null),
                    sum = function (array) {
                        var total = 0,
                            i;
                        for (i = 0; i < array.length; i += 1) {
                            if (isNaN(array[i])) {
                                total = 0;
                                break;
                            } else {
                                total += parseFloat(array[i]);
                            }
                        }
                        return total;
                    },
                    compare = function (a, b) {
                        var result = 0,
                            sumA = sum(a),
                            sumB = sum(b);
                        if (!isNaN(sumA) && sumA !== 0 && !isNaN(sumB) && sumB !== 0) {
                            result = parseFloat(sumA) - parseFloat(sumB);
                        } else if (!isNaN(Date.parse(a[0])) && !isNaN(Date.parse(b[0]))) {
                            result = Date.parse(a[0]) - Date.parse(b[0]);
                        } else if (a[0] < b[0]) {
                            result = -1;
                        } else if (a[0] > b[0]) {
                            result = 1;
                        }
                        return result;
                    };
                // Handle the ordering based on the type set
                if (typeof ordering === "function") {
                    // Apply the sort predicate directly
                    sortStack.push(function (a, b) {
                        return (desc ? -1 : 1) * ordering(a, b);
                    });
                } else if (ordering instanceof Array) {
                    // The order list may be an array of arrays
                    // combine the values with pipe delimiters.
                    // The delimiter is irrelevant as long as it is consistent
                    // with the sort predicate below
                    ordering.forEach(function (d) {
                        orderArray.push(([].concat(d)).join("|"));
                    }, this);
                    // Sort according to the axis position
                    sortStack.push(function (a, b) {
                        var aStr = "".concat(a[mainField]),
                            bStr = "".concat(b[mainField]),
                            aIx,
                            bIx;
                        // If the value is not found it should go to the end (if descending it
                        // should go to the start so that it ends up at the back when reversed)
                        aIx = orderArray.indexOf(aStr);
                        bIx = orderArray.indexOf(bStr);
                        aIx = (aIx < 0 ? (desc ? -1 : orderArray.length) : aIx);
                        bIx = (bIx < 0 ? (desc ? -1 : orderArray.length) : bIx);
                        return (desc ? -1 : 1) * (aIx - bIx);
                    });
                } else {
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
                var compareIx = 0,
                    result = 0;
                while (compareIx < sortStack.length && result === 0) {
                    result = sortStack[compareIx](a, b);
                    compareIx += 1;
                }
                return result;
            });
            // Return a simple array if only one field is being returned.
            // for multiple fields remove extra fields but leave objects
            rollupData.forEach(function (d) {
                finalArray.push(d[mainField]);
            }, this);
        }
        // Return the ordered list
        return finalArray;
    };

