    // Copyright: 2014 PMSI-AlignAlytics
    // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
    // Source: /src/methods/_getSeriesSortPredicate.js
    dimple._getSeriesSortPredicate = function (chart, series, orderedArray) {
        return function (a, b) {
            var sortValue = 0;
            if (series.x._hasCategories()) {
                sortValue = (dimple._helpers.cx(a, chart, series) < dimple._helpers.cx(b, chart, series) ? -1 : 1);
            } else if (series.y._hasCategories()) {
                sortValue = (dimple._helpers.cy(a, chart, series) < dimple._helpers.cy(b, chart, series) ? -1 : 1);
            } else if (orderedArray) {
                sortValue = dimple._arrayIndexCompare(orderedArray, a.aggField, b.aggField);
            }
            return sortValue;
        };
    };
