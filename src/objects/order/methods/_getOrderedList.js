// Copyright: 2013 PMSI-AlignAlytics
// License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
// Source: /src/objects/order/methods/_getOrderedList.js
this._getOrderedList = function (data, fields, desc) {
    // Draw ascending by default
    desc = (desc === null || desc === undefined ? false : desc);    
    // Roll up the data
    var rolledUp = dimple._rollUp(data, fields);
    // Handle the ordering based on the type set
    if (typeof this.ordering == "function") {
        // Apply the sort predicate directly
        rolledUp.sort(this.ordering);
    }
    else if (this.ordering instanceof Array) {
        // The order list may be an array of arrays
        // combine the values with pipe delimiters.
        // The delimiter is irrelevant as long as it is consistent
        // with the sort predicate below
        var orderArray = [];
        this.ordering.forEach(function (d) {
            orderArray.push(([].concat(d)).join("|"));
        }, this);
        // Sort according to the axis position
        rolledUp.sort(function (a, b) {
            var aStr = "";
            var bStr = "";
            [].concat(fields).forEach(function (f, i) {
                aStr += (i > 0 ? "|" : "") + a[f];
                bStr += (i > 0 ? "|" : "") + b[f];
            }, this);
            var aIx = orderArray.indexOf(aStr);
            var bIx = orderArray.indexOf(bStr);
            return (desc ? -1 : 1) * (aIx - bIx);
        });
    }
    else if (typeof this.ordering == "string") {
        var dateMask = this.ordering;
        rolledUp.sort(function (a, b) {
            
        });
    }
    // Return the ordered list
    return rolledUp;
};
