        // Copyright: 2015 AlignAlytics
        // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
        // Source: /src/objects/chart/methods/assignClass.js
        // Help: http://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.chart#wiki-assignClass
        this.assignClass = function (tag, css) {
            this._assignedClasses[tag] = css;
            return this._assignedClasses[tag];
        };

