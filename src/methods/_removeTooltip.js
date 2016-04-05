    // Copyright: 2015 AlignAlytics
    // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
    // Source: /src/methods/_removeTooltip.js
    /*jslint unparam: true */
    dimple._removeTooltip = function (e, shape, chart, series) {
        if (chart._tooltipGroups[e.key]) {
            chart._tooltipGroups[e.key].remove();
        }
    };
    /*jslint unparam: false */
