// Copyright: 2013 PMSI-AlignAlytics
// License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
// Source: /src/objects/aggregateMethod/sum.js
dimple.aggregateMethod.sum = function (lhs, lhsCount, rhs, rhsCount) {
    lhs = (lhs == null || lhs == undefined ? 0 : lhs);
    rhs = (rhs == null || rhs == undefined ? 0 : rhs);
    return parseFloat(lhs) + parseFloat(rhs);
}
