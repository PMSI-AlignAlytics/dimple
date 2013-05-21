// Copyright: 2013 PMSI-AlignAlytics
// License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
// Source: /src/objects/aggregateMethod/min.js
dimple.aggregateMethod.min = function (lhs, lhsCount, rhs, rhsCount) {
    return (lhs == null ? parseFloat(rhs) : (parseFloat(lhs) < parseFloat(rhs) ? parseFloat(lhs) : parseFloat(rhs)));
};
