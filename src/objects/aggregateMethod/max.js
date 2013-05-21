// Copyright: 2013 PMSI-AlignAlytics
// License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
// Source: /src/objects/aggregateMethod/max.js
dimple.aggregateMethod.max = function (lhs, lhsCount, rhs, rhsCount) {
    return parseFloat(lhs) > parseFloat(rhs) ? parseFloat(lhs) : parseFloat(rhs);
};
