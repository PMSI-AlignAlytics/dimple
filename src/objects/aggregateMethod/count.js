// Copyright: 2013 PMSI-AlignAlytics
// License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
// Source: /src/objects/aggregateMethod/count.js
dimple.aggregateMethod.count = function (lhs, lhsCount, rhs, rhsCount) {
    return parseFloat(lhsCount) + parseFloat(rhsCount);
};
