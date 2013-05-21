// Source: /src/objects/legend/methods/_getEntries.js
this._getEntries = function () {
    // Create an array of distinct series values
    var entries = [];
    // If there are some series
    if (this.series != null && this.series != undefined) {
        // Iterate all the associated series
        this.series.forEach(function (series, i) {
            // Get the series data
            var data = series._positionData;
            // Iterate the aggregated data
            data.forEach(function (row) {
                // Check whether this element is new
                var index = -1;
                for (var j = 0; j < entries.length; j++) {
                    if (entries[j].key == row.aggField.slice(-1)[0]) {
                        index = j;
                        break;
                    }
                }
                if (index == -1) {
                    // If it's a new element create a new row in the return array
                    entries.push({ key: row.aggField.slice(-1)[0], fill: row.fill, stroke: row.stroke, series: series, aggField: row.aggField });
                    index = entries.length - 1;
                }
            });
        }, this);
    }
    return entries;
}