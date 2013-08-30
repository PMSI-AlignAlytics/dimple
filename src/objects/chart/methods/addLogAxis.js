        // Copyright: 2013 PMSI-AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/chart/methods/addLogAxis.js
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.chart#wiki-addLogAxis
        this.addLogAxis = function (position, logField, logFormat, logBase) {
            var axis = this.addAxis(position, null, logField, null, logField);
            if (logBase !== null && logBase !== undefined) {
                axis.logBase = logBase;
            }
            if (logFormat !== null && logFormat !== undefined) {
                axis.logFormat = logFormat;
            }
            return axis;
        };