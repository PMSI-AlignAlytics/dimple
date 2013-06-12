    // Copyright: 2013 PMSI-AlignAlytics
    // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
    // Source: /src/methods/_rollUp.js
    dimple._rollUp = function (data, fields) {

        // Get a squashed list. This will have a row
        // for every distinct combination of fields passed
        // and each field in the data will be included with an array of
        // all values in its place.  Therefore
        //      { "Field 1":"a", "Field 2":"x", "Field 3":"s", "Field 4":13 },
        //      { "Field 1":"a", "Field 2":"y", "Field 3":"s", "Field 4":14 },
        //      { "Field 1":"a", "Field 2":"z", "Field 3":"t", "Field 4":15 }

        // If fields = "Field 1" then this would return:
        //      { "Field 1":"a", "Field 2":["x","y","z"], "Field 3":["s","s","t"], "Field 4":[12,14,15]}

        // If fields = "Field 3" then this would return:
        //      { "Field 3":"s", "Field 1":["a","a"], "Field 2":["x","y"], "Field 4":[12,14]},
        //      { "Field 3":"t", "Field 1":["a"], "Field 2":["z"], "Field 4":[15]}

        // If fields = ["Field 1", "Field 3"] then this would return:
        //      { "Field 1":"a", "Field 3":"s", "Field 2":["x","y"], "Field 4":[12,14]},
        //      { "Field 1":"a", "Field 3":"t", "Field 2":["z"], "Field 4":[15]}

        var returnList = [];
        // Put single values into single value arrays
        if (fields !== null && fields !== undefined) {
            fields = [].concat(fields);
        } else {
            fields = [];
        }
        // Iterate every row in the data
        data.forEach(function (d) {
            // The index of the corresponding row in the return list
            var index = -1,
                newRow = {},
                match = true,
                field;
            // Find the corresponding value in the return list
            returnList.forEach(function (r, j) {
                if (index === -1) {
                    // Indicates a match
                    match = true;
                    // Iterate the passed fields and compare
                    fields.forEach(function (f) {
                        match = match && d[f] === r[f];
                    }, this);
                    // If this is a match get the index
                    if (match) {
                        index = j;
                    }
                }
            }, this);
            // Pick up the matched row, or add a new one
            if (index !== -1) {
                newRow = returnList[index];
            } else {
                // Iterate the passed fields and add to the new row
                fields.forEach(function (f) {
                    newRow[f] = d[f];
                }, this);
                returnList.push(newRow);
                index = returnList.length - 1;
            }
            // Iterate all the fields in the data
            for (field in d) {
                if (d.hasOwnProperty(field) && fields.indexOf(field) === -1) {
                    if (newRow[field] === undefined) {
                        newRow[field] = [];
                    }
                    newRow[field] = newRow[field].concat(d[field]);
                }
            }
            // Update the return list
            returnList[index] = newRow;
        }, this);
        // Return the flattened list
        return returnList;
    };
