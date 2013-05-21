// Copyright: 2013 PMSI-AlignAlytics
// License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
// Source: /src/objects/series/methods/_axisBounds.js
this._axisBounds = function (position) {
    // A value to maintain the frame value
    var initialFrameValue = null;
    // The bounds object to return
    var bounds = { min: 0, max: 0 }
    // The row in the data for iterating
    var dataRow = 0;
    // The primary axis for this comparison
    var primaryAxis = null;
    // The secondary axis for this comparison
    var secondaryAxis = null;
    // The running totals of the categories
    var categoryTotals = [];
    // The maximum index of category totals
    var catCount = 0;

    // If the primary axis is x the secondary is y and vice versa, a z axis has no secondary
    if (position[0] == "x") { primaryAxis = xAxis; secondaryAxis = yAxis; }
    else if (position[0] == "y") { primaryAxis = yAxis; secondaryAxis = xAxis; }
    else if (position[0] == "z") { primaryAxis = zAxis; }
    else if (position[0] == "c") { primaryAxis = colorAxis; }

    // We need to aggregate the data first
    var aggData = this._positionData;

    // If the corresponding axis is category axis
    if (primaryAxis.showPercent) {
        // Iterate the data
        aggData.forEach(function (d, i) {
            if (d[primaryAxis.position + "Bound"] < bounds.min) { bounds.min = d[primaryAxis.position + "Bound"]; }
            if (d[primaryAxis.position + "Bound"] > bounds.max) { bounds.max = d[primaryAxis.position + "Bound"]; }
        }, this);
    }
    // If the corresponding axis is a measure axis or null
    else if (secondaryAxis == null || secondaryAxis.categoryFields == null || secondaryAxis.categoryFields.length == 0) {
        aggData.forEach(function (d, i) {
            // If the primary axis is stacked
            if (this.stacked && (primaryAxis.position == "x" || primaryAxis.position == "y")) {
                // We just need to push the bounds.  A stacked axis will always include 0 so I just need to push the min and max out from there
                if (d[primaryAxis.position + "Value"] < 0) { bounds.min = bounds.min + d[primaryAxis.position + "Value"]; }
                else { bounds.max = bounds.max + d[primaryAxis.position + "Value"]; }
            }
            else {
                // If it isn't stacked we need to catch the minimum and maximum values
                if (d[primaryAxis.position + "Value"] < bounds.min) { bounds.min = d[primaryAxis.position + "Value"]; }
                if (d[primaryAxis.position + "Value"] > bounds.max) { bounds.max = d[primaryAxis.position + "Value"]; }
            }
        }, this);
    }
    else {
        // If this category value (or combination if multiple fields defined) is not already in the array of categories, add it.
        var measureName = primaryAxis.position + "Value";
        var fieldName = secondaryAxis.position + "Field";
        // Get a list of distinct categories on the secondary axis
        var distinctCats = [];
        aggData.forEach(function (d, i) {
            // Create a field for this row in the aggregated data
            var field = d[fieldName].join("/");
            var index = distinctCats.indexOf(field);
            if (index == -1) {
                distinctCats.push(field);
                index = distinctCats.length - 1;
            };
            // Get the index of the field
            if (categoryTotals[index] == undefined) {
                categoryTotals[index] = { min: 0, max: 0 };
                if (index >= catCount) {
                    catCount = index + 1;
                }
            }
            // The secondary axis is a category axis, we need to account
            // for distribution across categories
            if (this.stacked) {
                if (d[measureName] < 0) { categoryTotals[index].min = categoryTotals[index].min + d[measureName]; }
                else { categoryTotals[index].max = categoryTotals[index].max + d[measureName]; }
            }
            else {
                // If it isn't stacked we need to catch the minimum and maximum values
                if (d[measureName] < categoryTotals[index].min) { categoryTotals[index].min = d[measureName]; }
                if (d[measureName] > categoryTotals[index].max) { categoryTotals[index].max = d[measureName]; }
            }
        }, this);
        categoryTotals.forEach(function (catTot, i) {
            if (catTot != undefined) {
                if (catTot.min < bounds.min) { bounds.min = catTot.min; }
                if (catTot.max > bounds.max) { bounds.max = catTot.max; }
            }
        }, this);
    }
    return bounds;
};

